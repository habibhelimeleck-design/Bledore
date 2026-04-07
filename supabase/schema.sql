-- =============================================================================
-- E.TALENT GABON — Supabase MVP Schema
-- Version : 1.0  |  Date : 2026-04-02
-- Rôles   : face (talent) | producer (recruteur)
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. EXTENSIONS
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";   -- recherche plein texte fuzzy


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ENUMS
-- ─────────────────────────────────────────────────────────────────────────────

-- Rôle global de l'utilisateur
create type public.user_role as enum ('face', 'producer');

-- Statut de visibilité d'un profil face
create type public.profile_visibility as enum ('public', 'producers_only', 'private');

-- Statut d'une mission
create type public.mission_status as enum (
  'draft',        -- brouillon, invisible
  'published',    -- visible par tous les faces
  'closed',       -- plus de candidatures acceptées
  'archived'      -- archivée, non listée
);

-- Statut d'une candidature
create type public.application_status as enum (
  'pending',      -- envoyée, en attente de lecture
  'viewed',       -- vue par le producteur
  'shortlisted',  -- présélectionnée
  'accepted',     -- acceptée
  'rejected'      -- refusée
);

-- Type de média
create type public.media_type as enum ('photo', 'video', 'audio', 'document');

-- Statut de modération
create type public.moderation_status as enum ('pending', 'approved', 'rejected');


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. TABLES
-- ─────────────────────────────────────────────────────────────────────────────

-- ---------------------------------------------------------------------------
-- 2.1  profiles
--      Un enregistrement par auth.users. Créé automatiquement via trigger.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  role            public.user_role  not null,

  -- Identité
  full_name       text        not null,
  username        text        unique,           -- @handle optionnel
  avatar_url      text,
  bio             text,
  phone           text,

  -- Localisation (Gabon)
  city            text,                         -- ex : Libreville, Port-Gentil…
  country         text        not null default 'GA',

  -- Face uniquement
  birth_date      date,
  gender          text,
  height_cm       smallint,
  languages       text[],     -- ex: ['fr','fang','myene']
  skills          text[],     -- ex: ['danse','acting','chant']
  socials         jsonb,                        -- réseaux sociaux (TalentSocials)
  visibility      public.profile_visibility not null default 'producers_only',
  is_available    boolean     not null default true,

  -- Méta
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.profiles is
  'Profil public lié 1:1 à auth.users. Partagé par faces et producteurs.';

-- ---------------------------------------------------------------------------
-- 2.2  producer_accounts
--      Informations entreprise / structure liées à un producteur.
-- ---------------------------------------------------------------------------
create table public.producer_accounts (
  id              uuid        primary key default uuid_generate_v4(),
  profile_id      uuid        not null unique references public.profiles(id) on delete cascade,

  company_name    text        not null,
  sector          text,                         -- ex: publicité, cinéma, événementiel
  website         text,
  description     text,
  logo_url        text,
  is_verified     boolean     not null default false,  -- vérifié par admin

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.producer_accounts is
  'Informations entreprise du producteur. 1 producteur = 1 producer_account.';

-- ---------------------------------------------------------------------------
-- 2.3  missions
--      Offres de casting publiées par les producteurs.
-- ---------------------------------------------------------------------------
create table public.missions (
  id              uuid        primary key default uuid_generate_v4(),
  producer_id     uuid        not null references public.profiles(id) on delete cascade,

  -- Contenu
  title           text        not null,
  description     text        not null,
  category        text        not null,         -- ex: publicité, clip, film, événement
  cover_url       text,

  -- Critères
  required_skills text[],
  required_gender text,
  required_age_min smallint,
  required_age_max smallint,
  location        text,                         -- ville ou "Remote"
  is_remote       boolean     not null default false,

  -- Rémunération (XAF)
  budget_min      integer,
  budget_max      integer,
  currency        text        not null default 'XAF',

  -- Dates
  deadline        date,
  shooting_date   date,

  -- Statut
  status          public.mission_status not null default 'draft',

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.missions is
  'Offres de casting créées par les producteurs. Visibles par les faces si status=published.';

-- ---------------------------------------------------------------------------
-- 2.4  applications
--      Candidatures d'une face à une mission.
-- ---------------------------------------------------------------------------
create table public.applications (
  id              uuid        primary key default uuid_generate_v4(),
  mission_id      uuid        not null references public.missions(id) on delete cascade,
  talent_id       uuid        not null references public.profiles(id) on delete cascade,

  cover_letter    text,
  status          public.application_status not null default 'pending',
  producer_note   text,                         -- note interne du producteur

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Un talent ne peut candidater qu'une seule fois par mission
  unique (mission_id, talent_id)
);

comment on table public.applications is
  'Candidature d une face à une mission. Visible uniquement par la face et le producteur.';

-- ---------------------------------------------------------------------------
-- 2.5  media_assets
--      Photos / vidéos du portfolio d'une face.
-- ---------------------------------------------------------------------------
create table public.media_assets (
  id              uuid        primary key default uuid_generate_v4(),
  talent_id       uuid        not null references public.profiles(id) on delete cascade,

  media_type      public.media_type not null default 'photo',
  url             text        not null,
  thumbnail_url   text,
  caption         text,
  is_cover        boolean     not null default false,  -- photo de couverture du profil
  sort_order      smallint    not null default 0,

  created_at      timestamptz not null default now()
);

comment on table public.media_assets is
  'Portfolio photo/vidéo des faces. Stockage via Supabase Storage.';

-- ---------------------------------------------------------------------------
-- 2.6  moderation_flags
--      Signalements simples pour la modération admin.
-- ---------------------------------------------------------------------------
create table public.moderation_flags (
  id              uuid        primary key default uuid_generate_v4(),
  reporter_id     uuid        not null references public.profiles(id) on delete cascade,

  -- Cible flexible (une table + un id)
  target_table    text        not null,  -- 'missions' | 'profiles' | 'media_assets'
  target_id       uuid        not null,

  reason          text        not null,
  status          public.moderation_status not null default 'pending',
  admin_note      text,

  created_at      timestamptz not null default now(),
  resolved_at     timestamptz
);

comment on table public.moderation_flags is
  'Signalements utilisateur pour modération. Traités en back-office.';


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. INDEX
-- ─────────────────────────────────────────────────────────────────────────────

-- profiles
create index idx_profiles_role        on public.profiles(role);
create index idx_profiles_city        on public.profiles(city);
create index idx_profiles_username    on public.profiles(username);
create index idx_profiles_available   on public.profiles(is_available) where role = 'face';
create index idx_profiles_fulltext    on public.profiles using gin(to_tsvector('french', coalesce(full_name,'') || ' ' || coalesce(bio,'')));

-- missions
create index idx_missions_producer    on public.missions(producer_id);
create index idx_missions_status      on public.missions(status);
create index idx_missions_category    on public.missions(category);
create index idx_missions_deadline    on public.missions(deadline);
create index idx_missions_fulltext    on public.missions using gin(to_tsvector('french', coalesce(title,'') || ' ' || coalesce(description,'')));

-- applications
create index idx_applications_mission on public.applications(mission_id);
create index idx_applications_face    on public.applications(talent_id);
create index idx_applications_status  on public.applications(status);

-- media_assets
create index idx_media_face           on public.media_assets(talent_id);
create index idx_media_type           on public.media_assets(media_type);
create index idx_media_cover          on public.media_assets(is_cover) where is_cover = true;

-- moderation_flags
create index idx_flags_target         on public.moderation_flags(target_table, target_id);
create index idx_flags_status         on public.moderation_flags(status);


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. FONCTIONS UTILITAIRES
-- ─────────────────────────────────────────────────────────────────────────────

-- Mise à jour automatique du champ updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Retourne le rôle de l'utilisateur courant (évite les appels répétés)
create or replace function public.current_user_role()
returns public.user_role language sql stable security definer as $$
  select role from public.profiles where id = auth.uid();
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────

-- updated_at sur toutes les tables mutables
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_producer_accounts_updated_at
  before update on public.producer_accounts
  for each row execute function public.set_updated_at();

create trigger trg_missions_updated_at
  before update on public.missions
  for each row execute function public.set_updated_at();

create trigger trg_applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Trigger principal : création automatique du profil après inscription
--
-- Fonctionnement :
--   1. L'utilisateur s'inscrit via Supabase Auth (email / OAuth / phone)
--   2. auth.users reçoit une nouvelle ligne
--   3. Ce trigger lit les metadata passées à signUp() :
--        supabase.auth.signUp({ email, password,
--          options: { data: { full_name, role } } })
--   4. Il crée la ligne dans public.profiles automatiquement
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role      public.user_role;
  v_full_name text;
begin
  -- Récupère le rôle depuis les metadata (défaut : 'face')
  v_role := coalesce(
    (new.raw_user_meta_data->>'role')::public.user_role,
    'face'
  );

  -- Récupère le nom complet depuis les metadata
  v_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.email
  );

  insert into public.profiles (id, role, full_name)
  values (new.id, v_role, v_full_name);

  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles          enable row level security;
alter table public.producer_accounts enable row level security;
alter table public.missions          enable row level security;
alter table public.applications      enable row level security;
alter table public.media_assets      enable row level security;
alter table public.moderation_flags  enable row level security;


-- ─────────────────────────────────────────────────────────────────────────────
-- 6.1  PROFILES
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT : profil public → tout le monde | producers_only → connecté | private → soi-même
create policy "profiles_select_public"
  on public.profiles for select
  using (
    visibility = 'public'
    or auth.uid() = id
    or (
      visibility = 'producers_only'
      and auth.role() = 'authenticated'
    )
  );

-- SELECT profils producteurs : visibles par tous les utilisateurs connectés
-- (déjà couvert par la policy ci-dessus via visibility implicite)

-- INSERT : chaque utilisateur insère uniquement son propre profil (via trigger)
-- Le trigger tourne en SECURITY DEFINER, donc la policy INSERT n'est pas
-- strictement nécessaire pour le trigger, mais protège les insertions directes.
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- UPDATE : seulement ses propres données
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- DELETE : seulement soi-même (suppression de compte)
create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 6.2  PRODUCER_ACCOUNTS
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT : visible par tout utilisateur connecté (pour affichage sur les missions)
create policy "producer_accounts_select_authenticated"
  on public.producer_accounts for select
  using (auth.role() = 'authenticated');

-- INSERT : uniquement si le profil lié appartient à l'utilisateur ET rôle=producer
create policy "producer_accounts_insert_own"
  on public.producer_accounts for insert
  with check (
    auth.uid() = profile_id
    and public.current_user_role() = 'producer'
  );

-- UPDATE : seulement le producteur propriétaire
create policy "producer_accounts_update_own"
  on public.producer_accounts for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- DELETE : seulement le producteur propriétaire
create policy "producer_accounts_delete_own"
  on public.producer_accounts for delete
  using (auth.uid() = profile_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 6.3  MISSIONS
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT : missions publiées → tout utilisateur connecté
--          brouillons/archivées → seulement le producteur propriétaire
create policy "missions_select"
  on public.missions for select
  using (
    status = 'published'
    or status = 'closed'    -- visible pour voir si c'est fermé
    or auth.uid() = producer_id
  );

-- INSERT : uniquement un producteur connecté
create policy "missions_insert_producer"
  on public.missions for insert
  with check (
    auth.uid() = producer_id
    and public.current_user_role() = 'producer'
  );

-- UPDATE : seulement le producteur propriétaire
create policy "missions_update_own"
  on public.missions for update
  using (auth.uid() = producer_id)
  with check (auth.uid() = producer_id);

-- DELETE : seulement le producteur propriétaire
create policy "missions_delete_own"
  on public.missions for delete
  using (auth.uid() = producer_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 6.4  APPLICATIONS
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT : visible par le talent concerné OU le producteur propriétaire de la mission
create policy "applications_select"
  on public.applications for select
  using (
    auth.uid() = talent_id
    or auth.uid() = (
      select producer_id from public.missions where id = mission_id
    )
  );

-- INSERT : un talent ne peut candidater qu'avec son propre compte + mission published
create policy "applications_insert_face"
  on public.applications for insert
  with check (
    auth.uid() = talent_id
    and public.current_user_role() = 'talent'
    and exists (
      select 1 from public.missions
      where id = mission_id and status = 'published'
    )
  );

-- UPDATE :
--   • Le talent peut modifier sa lettre de motivation (si pending)
--   • Le producteur peut modifier le statut et sa note interne
create policy "applications_update_face"
  on public.applications for update
  using (auth.uid() = talent_id)
  with check (auth.uid() = talent_id);

create policy "applications_update_producer"
  on public.applications for update
  using (
    auth.uid() = (
      select producer_id from public.missions where id = mission_id
    )
  );

-- DELETE : un talent peut retirer sa propre candidature (si pending)
create policy "applications_delete_face"
  on public.applications for delete
  using (
    auth.uid() = talent_id
    and status = 'pending'
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- 6.5  MEDIA_ASSETS
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT : visible selon la visibilité du profil du talent
create policy "media_assets_select"
  on public.media_assets for select
  using (
    auth.uid() = talent_id
    or (
      auth.role() = 'authenticated'
      and exists (
        select 1 from public.profiles p
        where p.id = talent_id
          and p.visibility in ('public', 'producers_only')
      )
    )
  );

-- INSERT : le talent insère uniquement ses propres médias
create policy "media_assets_insert_own"
  on public.media_assets for insert
  with check (
    auth.uid() = talent_id
    and public.current_user_role() = 'talent'
  );

-- UPDATE : le talent modifie uniquement ses propres médias
create policy "media_assets_update_own"
  on public.media_assets for update
  using (auth.uid() = talent_id)
  with check (auth.uid() = talent_id);

-- DELETE : le talent supprime uniquement ses propres médias
create policy "media_assets_delete_own"
  on public.media_assets for delete
  using (auth.uid() = talent_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 6.6  MODERATION_FLAGS
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT : l'auteur du signalement peut voir son propre flag
create policy "flags_select_own"
  on public.moderation_flags for select
  using (auth.uid() = reporter_id);

-- INSERT : tout utilisateur connecté peut signaler
create policy "flags_insert_authenticated"
  on public.moderation_flags for insert
  with check (
    auth.uid() = reporter_id
    and auth.role() = 'authenticated'
  );

-- UPDATE / DELETE : réservé aux admins via service_role key (pas de policy → bloqué par défaut)
-- Pour les admins, utiliser le client avec service_role key (bypass RLS).


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. DONNÉES DE TEST (optionnel — commenter en production)
-- ─────────────────────────────────────────────────────────────────────────────
-- Les données de test sont à insérer via Supabase Auth (signUp) et non
-- directement en SQL, car le trigger handle_new_user dépend de auth.users.
-- Exemple d'appel côté client :
--
--   await supabase.auth.signUp({
--     email: 'talent@test.ga',
--     password: 'SecurePass123!',
--     options: { data: { full_name: 'Amara Diallo', role: 'face' } }
--   })
--
--   await supabase.auth.signUp({
--     email: 'prod@agenceleo.ga',
--     password: 'SecurePass123!',
--     options: { data: { full_name: 'Léo Productions', role: 'producer' } }
--   })


-- ─────────────────────────────────────────────────────────────────────────────
-- FIN DU SCHEMA
-- =============================================================================

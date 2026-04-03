export type UserRole          = "talent" | "producer";
export type ProfileVisibility = "public" | "producers_only" | "private";
export type MissionStatus     = "draft" | "published" | "closed" | "archived";
export type ApplicationStatus = "pending" | "viewed" | "shortlisted" | "accepted" | "rejected";
export type MediaType         = "photo" | "video" | "audio" | "document";
export type ModerationStatus  = "pending" | "approved" | "rejected";

export interface Profile {
  [key: string]: unknown;
  id:            string;
  role:          UserRole;
  full_name:     string;
  username:      string | null;
  avatar_url:    string | null;
  bio:           string | null;
  phone:         string | null;
  city:          string | null;
  country:       string;
  birth_date:    string | null;
  gender:        string | null;
  height_cm:     number | null;
  languages:     string[] | null;
  skills:        string[] | null;
  visibility:    ProfileVisibility;
  is_available:  boolean;
  created_at:    string;
  updated_at:    string;
}

export interface ProducerAccount {
  [key: string]: unknown;
  id:           string;
  profile_id:   string;
  company_name: string;
  sector:       string | null;
  website:      string | null;
  description:  string | null;
  logo_url:     string | null;
  is_verified:  boolean;
  created_at:   string;
  updated_at:   string;
}

export interface Mission {
  [key: string]: unknown;
  id:               string;
  producer_id:      string;
  title:            string;
  description:      string;
  category:         string;
  cover_url:        string | null;
  required_skills:  string[] | null;
  required_gender:  string | null;
  required_age_min: number | null;
  required_age_max: number | null;
  location:         string | null;
  is_remote:        boolean;
  budget_min:       number | null;
  budget_max:       number | null;
  currency:         string;
  deadline:         string | null;
  shooting_date:    string | null;
  status:           MissionStatus;
  created_at:       string;
  updated_at:       string;
}

export interface Application {
  [key: string]: unknown;
  id:             string;
  mission_id:     string;
  face_id:        string;
  cover_letter:   string | null;
  status:         ApplicationStatus;
  producer_note:  string | null;
  created_at:     string;
  updated_at:     string;
}

export interface MediaAsset {
  [key: string]: unknown;
  id:            string;
  face_id:       string;
  media_type:    MediaType;
  url:           string;
  thumbnail_url: string | null;
  caption:       string | null;
  is_cover:      boolean;
  sort_order:    number;
  created_at:    string;
}

export interface ModerationFlag {
  [key: string]: unknown;
  id:           string;
  reporter_id:  string;
  target_table: string;
  target_id:    string;
  reason:       string;
  status:       ModerationStatus;
  admin_note:   string | null;
  created_at:   string;
  resolved_at:  string | null;
}

// ── Joined/enriched types ───────────────────────────────────────

export interface MissionWithProducer extends Mission {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url">;
  producer_accounts: Pick<ProducerAccount, "company_name" | "logo_url" | "is_verified"> | null;
}

export interface ApplicationWithMission extends Application {
  missions: Pick<Mission, "id" | "title" | "category" | "status" | "deadline"> & {
    profiles: Pick<Profile, "full_name" | "avatar_url">;
    producer_accounts: Pick<ProducerAccount, "company_name"> | null;
  };
}

export interface ApplicationWithFace extends Application {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url" | "city" | "skills" | "gender">;
}

// ── Supabase Database schema typing ────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row:           Profile;
        Insert:        Omit<Profile, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string };
        Update:        Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      producer_accounts: {
        Row:           ProducerAccount;
        Insert:        Omit<ProducerAccount, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update:        Partial<Omit<ProducerAccount, "id" | "profile_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      missions: {
        Row:           Mission;
        Insert:        Omit<Mission, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update:        Partial<Omit<Mission, "id" | "producer_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      applications: {
        Row:           Application;
        Insert:        Omit<Application, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update:        Partial<Omit<Application, "id" | "mission_id" | "face_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      media_assets: {
        Row:           MediaAsset;
        Insert:        Omit<MediaAsset, "id" | "created_at"> & { id?: string; created_at?: string };
        Update:        Partial<Omit<MediaAsset, "id" | "face_id" | "created_at">>;
        Relationships: [];
      };
      moderation_flags: {
        Row:           ModerationFlag;
        Insert:        Omit<ModerationFlag, "id" | "created_at"> & { id?: string; created_at?: string };
        Update:        Partial<Omit<ModerationFlag, "id" | "reporter_id" | "created_at">>;
        Relationships: [];
      };
    };
    Views:          { [_ in never]: never };
    Functions: {
      current_user_role: { Args: Record<PropertyKey, never>; Returns: UserRole };
    };
    Enums: {
      user_role:          UserRole;
      profile_visibility: ProfileVisibility;
      mission_status:     MissionStatus;
      application_status: ApplicationStatus;
      media_type:         MediaType;
      moderation_status:  ModerationStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
}

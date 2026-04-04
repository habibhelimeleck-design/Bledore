export type StaticTalent = {
  id: number;
  name: string;
  role: string;
  city: string;
  rating: number;
  missions: number;
  verified: boolean;
  categories: string[];
  image: string;
  specialty: string;
};

export const STATIC_TALENTS: StaticTalent[] = [
  {
    id: 1,
    name: "Mathias Asseko",
    role: "Entrepreneur Digital",
    city: "Libreville",
    rating: 4.9,
    missions: 18,
    verified: true,
    categories: ["Création de contenu"],
    image: "/1.jpg",
    specialty: "Digital, Entrepreneuriat",
  },
  {
    id: 2,
    name: "Jardel Oniane",
    role: "Influenceur",
    city: "Libreville",
    rating: 4.8,
    missions: 24,
    verified: true,
    categories: ["Création de contenu"],
    image: "/2.jpg",
    specialty: "Mode, Lifestyle",
  },
  {
    id: 3,
    name: "Nephtali Nalick",
    role: "Créateur de contenu",
    city: "Libreville",
    rating: 4.7,
    missions: 12,
    verified: true,
    categories: ["Acteurs"],
    image: "/3.jpg",
    specialty: "Création de contenu",
  },
  {
    id: 4,
    name: "Mr Wils",
    role: "Créateur de contenu",
    city: "Libreville",
    rating: 5.0,
    missions: 9,
    verified: true,
    categories: ["Voix"],
    image: "/4.jpg",
    specialty: "Création de contenu, Doublage",
  },
  {
    id: 5,
    name: "Diego Falandry",
    role: "Créateur de contenu",
    city: "Libreville",
    rating: 4.9,
    missions: 31,
    verified: true,
    categories: ["Mannequins"],
    image: "/5.jpg",
    specialty: "Editorial, Runway",
  },
  {
    id: 6,
    name: "Habib Lewouwa",
    role: "Entrepreneur digital",
    city: "Libreville",
    rating: 4.8,
    missions: 15,
    verified: true,
    categories: ["Mannequins"],
    image: "/6.jpg",
    specialty: "Brand, Contenu digital",
  },
];

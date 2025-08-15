export interface Skill {
  id: string;
  name: string;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon?: string;
  order?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  order?: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string[];
  location?: string;
  current?: boolean;
  order?: number;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  description: string;
  content: React.ReactNode;
  likes: number;
  comments: Comment[];
}

export interface TravelLocation {
  id: string;
  name: string;
  country: string;
  continent: string;
  coordinates: [number, number]; // [latitude, longitude]
  description?: string;
  imageUrl?: string;
  dateVisited?: string;
  duration?: string;
}

export type TravelStatus = 'lived' | 'visited' | 'wantToVisit' | 'wantToLive';
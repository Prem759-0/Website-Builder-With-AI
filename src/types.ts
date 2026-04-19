export interface Project {
  _id: string;
  name: string;
  userId: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type Device = 'desktop' | 'tablet' | 'mobile';

export type ViewMode = 'preview' | 'code' | 'split';

export interface UserStats {
  projects: number;
  generations: number;
  storage: string;
  plan: 'Free' | 'Pro';
  isPro: boolean;
}

export interface StripeSession {
  url: string;
}

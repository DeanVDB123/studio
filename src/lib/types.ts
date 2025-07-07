

export interface Photo {
  id: string;
  url: string; // Data URI or a remote URL if stored
  caption?: string;
  dataAiHint?: string; 
}

export interface MemorialData {
  id?: string; // Optional: will be assigned on creation
  userId?: string; // ID of the user who created this memorial
  deceasedName: string;
  birthDate: string; // Consider using Date objects if more manipulation is needed
  deathDate: string;  // Consider using Date objects
  lifeSummary: string; // For AI biography generation
  biography: string;
  photos: Photo[];
  tributes: string[]; // Array of tribute messages
  stories: string[]; // Array of stories
  ownerStatus?: string; // Status of the memorial owner
  plan?: string; // Plan for this specific memorial e.g., 'SPIRIT', 'ESSENCE'
  planExpiryDate?: string; // ISO 8601 format, or 'ETERNAL'
  viewCount?: number;
  lastVisited?: string;
  viewTimestamps?: string[]; // Array of ISO date strings for each view
  createdAt?: string;
  visibility?: 'shown' | 'hidden';
}

export interface OrganizedContent {
  biography: string;
  tributes: string[];
  stories: string[];
  photoGallery: string[]; // Array of photo data URIs
}

export interface SignupEvent {
  userId: string;
  email: string;
  signupDate: string; // ISO 8601 format
  status: string; // e.g., 'FREE', 'PAID'
}

export interface UserForAdmin {
    userId: string;
    email: string;
    signupDate: string;
    status: string;
    memorialCount: number;
    totalQrCodes: number;
}

export interface Feedback {
  id?: string;
  userId: string;
  email: string;
  feedback: string;
  createdAt: string; // ISO 8601 format
  status: 'read' | 'unread';
}

export interface AdminMemorialView {
  id: string;
  deceasedName: string;
  ownerId?: string;
  ownerEmail: string;
  ownerStatus: string;
  plan?: string;
  planExpiryDate?: string;
  createdAt: string;
  viewCount: number;
  visibility: 'shown' | 'hidden';
}

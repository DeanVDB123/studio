
export interface Photo {
  id: string;
  url: string; // Data URI or a remote URL if stored
  caption?: string;
}

export interface MemorialData {
  id?: string; // Optional: will be assigned on creation
  deceasedName: string;
  birthDate: string; // Consider using Date objects if more manipulation is needed
  deathDate: string;  // Consider using Date objects
  lifeSummary: string; // For AI biography generation
  biography: string;
  photos: Photo[];
  tributes: string[]; // Array of tribute messages
  stories: string[]; // Array of stories
}

export interface OrganizedContent {
  biography: string;
  tributes: string[];
  stories: string[];
  photoGallery: string[]; // Array of photo data URIs
}

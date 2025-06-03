
import type { MemorialData, Photo } from '@/lib/types';

// This is a server-side in-memory store.
// In a real application, this would be a database.
const memorials = new Map<string, MemorialData>();

export async function getMemorialById(id: string): Promise<MemorialData | undefined> {
  return memorials.get(id);
}

export async function getAllMemorials(): Promise<{ id: string; deceasedName: string }[]> {
  return Array.from(memorials.entries()).map(([id, data]) => ({ 
    id, 
    deceasedName: data.deceasedName 
  }));
}

export async function saveMemorial(id: string, data: MemorialData): Promise<MemorialData> {
  const memorialToSave = { ...data, id };
  memorials.set(id, memorialToSave);
  return memorialToSave;
}

export async function createMemorial(data: MemorialData): Promise<MemorialData> {
  const id = crypto.randomUUID();
  const newMemorial = { ...data, id };
  memorials.set(id, newMemorial);
  return newMemorial;
}

// Initialize with some dummy data for testing
if (process.env.NODE_ENV === 'development' && memorials.size === 0) {
  const dummyPhoto: Photo = { id: '1', url: 'https://placehold.co/600x400.png', caption: 'A beautiful memory' };
  createMemorial({
    deceasedName: 'Jane Doe',
    birthDate: '1950-01-01',
    deathDate: '2023-01-01',
    lifeSummary: 'A life well lived, full of joy and kindness. Jane loved gardening and spending time with her family.',
    biography: 'Jane Doe was born in a small town and grew up to be a beacon of light in her community. She dedicated her life to helping others and was known for her infectious laughter and warm heart. Her passions included gardening, where she found peace and joy, and spending cherished moments with her beloved family and friends. She will be dearly missed by all who knew her.',
    photos: [dummyPhoto, { id: '2', url: 'https://placehold.co/600x400.png', caption: 'Happy times' }],
    tributes: ['A wonderful person, deeply missed.', 'Her kindness touched so many.'],
    stories: ['I remember when Jane helped me with... it showed her true character.', 'One funny story about Jane...'],
  });
   createMemorial({
    deceasedName: 'John Smith',
    birthDate: '1965-07-15',
    deathDate: '2024-03-10',
    lifeSummary: 'John was an avid explorer and a loving father. He enjoyed hiking and telling stories.',
    biography: 'John Smith was a man of adventure and warmth. His love for the great outdoors was matched only by his devotion to his family. Known for his captivating stories and generous spirit, John left an indelible mark on everyone he met. He found solace in nature, often hiking through mountains and forests, and shared his passion with those around him. His legacy of curiosity and love will live on.',
    photos: [{id: '3', url: 'https://placehold.co/600x400.png', caption: 'Adventure time'}],
    tributes: ['A true inspiration.', 'We will never forget his laughter.'],
    stories: ['John once climbed a mountain just to see the sunrise...', 'He told the best campfire stories.'],
  });
}

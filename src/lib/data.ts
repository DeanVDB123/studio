
import type { MemorialData, Photo } from '@/lib/types';

// HMR-resilient in-memory store for development
declare global {
  // eslint-disable-next-line no-var
  var __memorials_map_cache: Map<string, MemorialData> | undefined;
}

let memorials: Map<string, MemorialData>;

if (process.env.NODE_ENV === 'production') {
  memorials = new Map<string, MemorialData>();
} else {
  if (!global.__memorials_map_cache) {
    global.__memorials_map_cache = new Map<string, MemorialData>();
    // Initialize with dummy data only if the cache is truly empty for the first time
    // These dummy memorials will not have a userId and thus won't show up for logged-in users by default.
    // This is intentional to give logged-in users a clean slate.
    const dummyPhotoJane: Photo = { id: 'jane-photo-1', url: 'https://placehold.co/600x400.png', dataAiHint: 'woman smiling', caption: 'A beautiful memory' };
    const janeMemorialId = 'jane-doe-dev-memorial';
    global.__memorials_map_cache.set(janeMemorialId, {
      id: janeMemorialId,
      // No userId, or a generic one if needed for some public access logic (not implemented here)
      deceasedName: 'Jane Doe (Sample)',
      birthDate: '1950-01-01',
      deathDate: '2023-01-01',
      lifeSummary: 'A life well lived, full of joy and kindness. Jane loved gardening and spending time with her family.',
      biography: 'Jane Doe was born in a small town and grew up to be a beacon of light in her community. She dedicated her life to helping others and was known for her infectious laughter and warm heart. Her passions included gardening, where she found peace and joy, and spending cherished moments with her beloved family and friends. She will be dearly missed by all who knew her.',
      photos: [dummyPhotoJane, { id: 'jane-photo-2', url: 'https://placehold.co/600x400.png', dataAiHint: 'family gathering', caption: 'Happy times' }],
      tributes: ['A wonderful person, deeply missed.', 'Her kindness touched so many.'],
      stories: ['I remember when Jane helped me with... it showed her true character.', 'One funny story about Jane...'],
    });

    const dummyPhotoJohn: Photo = { id: 'john-photo-1', url: 'https://placehold.co/600x400.png', dataAiHint: 'man nature', caption: 'Adventure time' };
    const johnMemorialId = 'john-smith-dev-memorial';
    global.__memorials_map_cache.set(johnMemorialId, {
      id: johnMemorialId,
      deceasedName: 'John Smith (Sample)',
      birthDate: '1965-07-15',
      deathDate: '2024-03-10',
      lifeSummary: 'John was an avid explorer and a loving father. He enjoyed hiking and telling stories.',
      biography: 'John Smith was a man of adventure and warmth. His love for the great outdoors was matched only by his devotion to his family. Known for his captivating stories and generous spirit, John left an indelible mark on everyone he met. He found solace in nature, often hiking through mountains and forests, and shared his passion with those around him. His legacy of curiosity and love will live on.',
      photos: [dummyPhotoJohn],
      tributes: ['A true inspiration.', 'We will never forget his laughter.'],
      stories: ['John once climbed a mountain just to see the sunrise...', 'He told the best campfire stories.'],
    });
     console.log('Initialized sample data. Memorials count:', global.__memorials_map_cache.size);
  }
  memorials = global.__memorials_map_cache;
}


// Public memorial pages should still be able to fetch by ID without userId check
export async function getMemorialById(id: string): Promise<MemorialData | undefined> {
  return memorials.get(id);
}

// Admin function: get all memorials for a specific user
export async function getAllMemorialsForUser(userId: string): Promise<{ id: string; deceasedName: string }[]> {
  return Array.from(memorials.values())
    .filter(memorial => memorial.userId === userId)
    .map(memorial => ({
      id: memorial.id!,
      deceasedName: memorial.deceasedName,
    }));
}

// Admin function: save memorial, ensuring it's for the correct user
export async function saveMemorial(id: string, userId: string, data: MemorialData): Promise<MemorialData> {
  const existingMemorial = memorials.get(id);
  if (existingMemorial && existingMemorial.userId !== userId) {
    throw new Error("Unauthorized: You can only edit your own memorials.");
  }
  const memorialToSave: MemorialData = { ...data, id, userId }; // Ensure userId is set/updated
  memorials.set(id, memorialToSave);
  return memorialToSave;
}

// Admin function: create memorial for a specific user
export async function createMemorial(userId: string, data: Omit<MemorialData, 'id' | 'userId'>): Promise<MemorialData> {
  const id = crypto.randomUUID();
  // Ensure data passed to createMemorial does not already contain an id or userId to avoid confusion
  const newMemorial: MemorialData = { ...data, id, userId };
  memorials.set(id, newMemorial);
  return newMemorial;
}

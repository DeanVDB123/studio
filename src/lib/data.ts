
'use server';

import type { MemorialData, Photo } from '@/lib/types';

// HMR-resilient in-memory store for development & demo
declare global {
  // eslint-disable-next-line no-var
  var __memorials_map_cache: Map<string, MemorialData> | undefined;
}

let memorials: Map<string, MemorialData>;

if (!global.__memorials_map_cache) {
  console.log('Initializing __memorials_map_cache for the first time.');
  global.__memorials_map_cache = new Map<string, MemorialData>();

  const janeMemorialId = 'jane-doe-dev-memorial';
  global.__memorials_map_cache.set(janeMemorialId, {
    id: janeMemorialId,
    userId: 'sample-user-jane', // Assign a dummy userId for potential viewing without login if needed, or leave blank
    deceasedName: 'Jane Doe (Sample)',
    birthDate: '1950-01-01',
    deathDate: '2023-01-01',
    lifeSummary: 'A life well lived, full of joy and kindness. Jane loved gardening and spending time with her family.',
    biography: 'Jane Doe was born in a small town and grew up to be a beacon of light in her community. She dedicated her life to helping others and was known for her infectious laughter and warm heart. Her passions included gardening, where she found peace and joy, and spending cherished moments with her beloved family and friends. She will be dearly missed by all who knew her.',
    photos: [{ id: 'jane-photo-1', url: 'https://placehold.co/600x400.png', dataAiHint: 'woman smiling', caption: 'A beautiful memory' }, { id: 'jane-photo-2', url: 'https://placehold.co/600x400.png', dataAiHint: 'family gathering', caption: 'Happy times' }],
    tributes: ['A wonderful person, deeply missed.', 'Her kindness touched so many.'],
    stories: ['I remember when Jane helped me with... it showed her true character.', 'One funny story about Jane...'],
  });

  const johnMemorialId = 'john-smith-dev-memorial';
  global.__memorials_map_cache.set(johnMemorialId, {
    id: johnMemorialId,
    userId: 'sample-user-john',
    deceasedName: 'John Smith (Sample)',
    birthDate: '1965-07-15',
    deathDate: '2024-03-10',
    lifeSummary: 'John was an avid explorer and a loving father. He enjoyed hiking and telling stories.',
    biography: 'John Smith was a man of adventure and warmth. His love for the great outdoors was matched only by his devotion to his family. Known for his captivating stories and generous spirit, John left an indelible mark on everyone he met. He found solace in nature, often hiking through mountains and forests, and shared his passion with those around him. His legacy of curiosity and love will live on.',
    photos: [{ id: 'john-photo-1', url: 'https://placehold.co/600x400.png', dataAiHint: 'man nature', caption: 'Adventure time' }],
    tributes: ['A true inspiration.', 'We will never forget his laughter.'],
    stories: ['John once climbed a mountain just to see the sunrise...', 'He told the best campfire stories.'],
  });
  console.log('Sample data initialized into __memorials_map_cache. Count:', global.__memorials_map_cache.size);
} else {
  console.log('Re-using existing __memorials_map_cache. Count:', global.__memorials_map_cache.size);
}
memorials = global.__memorials_map_cache;


// Public memorial pages should still be able to fetch by ID without userId check
export async function getMemorialById(id: string): Promise<MemorialData | undefined> {
  console.log(`[Server Action] getMemorialById called for ID: ${id}`);
  console.log('[Server Action] Current memorials map keys:', Array.from(memorials.keys()));
  return memorials.get(id);
}

// Admin function: get all memorials for a specific user
export async function getAllMemorialsForUser(userId: string): Promise<{ id: string; deceasedName: string }[]> {
  console.log(`[Server Action] getAllMemorialsForUser called for user: ${userId}`);
  console.log('[Server Action] Current memorials map (before filter):', Array.from(memorials.values()).map(m => ({id: m.id, name: m.deceasedName, userId: m.userId })));
  const userMemorials = Array.from(memorials.values())
    .filter(memorial => memorial.userId === userId)
    .map(memorial => ({
      id: memorial.id!,
      deceasedName: memorial.deceasedName,
    }));
  console.log(`[Server Action] Found ${userMemorials.length} memorials for user ${userId}:`, userMemorials);
  return userMemorials;
}

// Admin function: save memorial, ensuring it's for the correct user
export async function saveMemorial(id: string, userId: string, data: MemorialData): Promise<MemorialData> {
  console.log(`[Server Action] saveMemorial called for ID: ${id}, User: ${userId}`);
  const existingMemorial = memorials.get(id);
  if (existingMemorial && existingMemorial.userId !== userId) {
    console.error(`[Server Action] Unauthorized attempt to save memorial ID: ${id} by user ${userId}. Owner is ${existingMemorial.userId}`);
    throw new Error("Unauthorized: You can only edit your own memorials.");
  }
  const memorialToSave: MemorialData = { ...data, id, userId }; 
  memorials.set(id, memorialToSave);
  console.log(`[Server Action] Memorial saved: ${id}. Current count: ${memorials.size}`);
  return memorialToSave;
}

// Admin function: create memorial for a specific user
// Made id optional for the caller, but we still can pass it for fixed dummy data.
export async function createMemorial(userId: string, data: Omit<MemorialData, 'id' | 'userId'>, id?: string): Promise<MemorialData> {
  const memorialId = id || crypto.randomUUID();
  console.log(`[Server Action] createMemorial called for User: ${userId}. Attempting to create/use ID: ${memorialId}`);
  
  // Ensure data passed to createMemorial does not already contain an id or userId to avoid confusion
  const newMemorial: MemorialData = { ...data, id: memorialId, userId };
  memorials.set(memorialId, newMemorial);
  console.log(`[Server Action] Memorial created with ID: ${memorialId} for user ${userId}. Current map size: ${memorials.size}`);
  console.log('[Server Action] Current memorials map keys after create:', Array.from(memorials.keys()));
  return newMemorial;
}

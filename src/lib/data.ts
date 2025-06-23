
// src/lib/data.ts
'use server';

import type { MemorialData, Photo } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// To prevent the in-memory store from being cleared on hot-reloads in development,
// we attach it to the global object.
declare global {
  // eslint-disable-next-line no-var
  var memorialsStore: Map<string, MemorialData> | undefined;
}

const memorials = global.memorialsStore || (global.memorialsStore = new Map<string, MemorialData>());

// Populate with sample data only once during development
if (process.env.NODE_ENV !== 'production') {
  if (!memorials.has('sample-1') && !memorials.has('sample-2')) {
    const samplePhotos: Photo[] = [
      { id: 'p1', url: 'https://placehold.co/600x400.png', caption: 'A beautiful landscape', dataAiHint: 'landscape nature' },
      { id: 'p2', url: 'https://placehold.co/400x300.png', caption: 'Family gathering', dataAiHint: 'family people' },
    ];
    
    const sampleMemorials: MemorialData[] = [
      {
        id: 'sample-1',
        userId: 'sample-user-1',
        deceasedName: 'Jane "Jenny" Doe',
        birthDate: '1950-01-15',
        deathDate: '2023-05-20',
        lifeSummary: 'A beloved mother, talented artist, and avid gardener. Jenny brought joy to everyone she met with her vibrant spirit and kindness.',
        biography: 'Born in a small town, Jane, affectionately known as Jenny, discovered her passion for art at a young age. Her paintings, inspired by nature, were celebrated for their vivid colors and emotional depth. She was a devoted mother of two and a cherished grandmother of five. Jenny loved spending her weekends tending to her beautiful garden, a skill she passed down to her children. Her legacy of love, creativity, and generosity will live on in the hearts of all who knew her.',
        photos: samplePhotos,
        tributes: ['"A truly wonderful person, she will be dearly missed."', '"Her laughter was infectious. Rest in peace, dear friend."'],
        stories: ['"I remember when Jenny helped me paint my first mural. She was so patient and encouraging."'],
      },
      {
        id: 'sample-2',
        userId: 'sample-user-1',
        deceasedName: 'Johnathan P. Smithson III',
        birthDate: '1965-11-02',
        deathDate: '2024-01-10',
        lifeSummary: 'Dedicated teacher, community leader, and loving husband. John was known for his wisdom, humor, and unwavering support for his students.',
        biography: 'John Smithson was a cornerstone of his community for over thirty years. As a high school history teacher, he inspired countless students with his engaging lessons and genuine care. He also served on the town council, advocating for local parks and educational programs. John was a loving husband to his wife, Mary, for 40 years. He enjoyed woodworking and restoring antique radios in his spare time. His impact on the community and his family is immeasurable.',
        photos: [{ id: 'p3', url: 'https://placehold.co/300x400.png', caption: 'John at his workshop', dataAiHint: 'workshop person' }],
        tributes: ['"Mr. Smithson was the best teacher I ever had."', '"A true gentleman. Our town won\'t be the same without him."'],
        stories: ['"He once stayed after school for hours to help me understand a difficult concept. I\'ll never forget his dedication."'],
      }
    ];

    sampleMemorials.forEach(memorial => memorials.set(memorial.id!, memorial));
    console.log('[InMem] Initial sample data loaded into global store.');
  }
}


export async function getMemorialById(id: string): Promise<MemorialData | undefined> {
  console.log(`[InMem] getMemorialById called for ID: ${id}`);
  return memorials.get(id);
}

export async function getAllMemorialsForUser(userId: string): Promise<{ id: string; deceasedName: string; birthDate: string; deathDate: string; profilePhotoUrl?: string }[]> {
  console.log(`[InMem] getAllMemorialsForUser called for user: ${userId}. Current memorials map size: ${memorials.size}`);
  console.log('[InMem] Current keys in memorials map:', Array.from(memorials.keys()));
  
  const userMemorials: { id: string; deceasedName: string; birthDate: string; deathDate: string; profilePhotoUrl?: string }[] = [];
  memorials.forEach((memorial, id) => {
    console.log(`[InMem] getAllMemorialsForUser: Checking memorial ID: ${id}, Owner: ${memorial.userId}`);
    if (memorial.userId === userId) {
      console.log(`[InMem] getAllMemorialsForUser: Match found for user ${userId}: Memorial ID ${id}`);
      userMemorials.push({
        id,
        deceasedName: memorial.deceasedName,
        birthDate: memorial.birthDate,
        deathDate: memorial.deathDate,
        profilePhotoUrl: memorial.photos && memorial.photos.length > 0 ? memorial.photos[0].url : undefined,
      });
    }
  });
  console.log(`[InMem] getAllMemorialsForUser: Found ${userMemorials.length} memorials for user ${userId}. Data: ${JSON.stringify(userMemorials)}`);
  return userMemorials;
}

export async function saveMemorial(id: string, userId: string, data: MemorialData): Promise<MemorialData> {
  console.log(`[InMem] saveMemorial (UPDATE) called for ID: ${id}, User: ${userId}`);
  const existingMemorial = memorials.get(id);
  if (!existingMemorial) {
    console.error(`[InMem] Memorial with ID ${id} not found for update.`);
    throw new Error(`Memorial with ID ${id} not found for update.`);
  }
  if (existingMemorial.userId !== userId) {
     console.error(`[InMem] Unauthorized: User ${userId} cannot edit memorial ${id} owned by ${existingMemorial.userId}.`);
    throw new Error(`Unauthorized: User ${userId} cannot edit memorial ${id} owned by ${existingMemorial.userId}.`);
  }
  const updatedMemorial = { ...existingMemorial, ...data, id, userId }; 
  memorials.set(id, updatedMemorial);
  console.log(`[InMem] Memorial UPDATED: ${id}. User: ${userId}. Total memorials: ${memorials.size}`);
  return updatedMemorial;
}

export async function createMemorial(userIdFromAction: string, data: MemorialData): Promise<MemorialData> {
  const id = data.id; // Expect ID to be set by the caller (form/action)
  const memorialUserId = data.userId; // This should be the authenticated user's ID, stamped by the action

  console.log(`[InMem] createMemorial (CREATE) called. Action UserID: ${userIdFromAction}, Data UserID (from payload): ${data.userId}, Memorial ID from data: ${id}`);

  if (!id) {
    console.error("[InMem] CRITICAL: data.id is missing in createMemorial payload. It must be generated by the form/action layer.");
    throw new Error("Memorial ID missing during creation. ID must be generated by the caller.");
  }

  if (!memorialUserId) {
    console.error("[InMem] CRITICAL: data.userId is missing in createMemorial payload. This should be stamped by saveMemorialAction.");
    throw new Error("User ID missing in memorial data during creation. Cannot associate memorial with a user.");
  }
  
  if (userIdFromAction !== memorialUserId) {
      console.warn(`[InMem] Mismatch between action userId (${userIdFromAction}) and payload userId (${memorialUserId}). Using payload userId from data.userId as primary for the record.`);
  }

  if (memorials.has(id)) {
    // This case should be rare if IDs are UUIDs, but good to log if it happens.
    console.warn(`[InMem] Memorial with ID ${id} already exists. Overwriting for demo purposes. In production, this should ideally not happen for creates with unique IDs.`);
  }
  
  // Ensure the newMemorial object uses the id and userId from the data payload,
  // which should have been correctly set by the action/form.
  const newMemorial: MemorialData = { ...data, id, userId: memorialUserId };
  memorials.set(id, newMemorial);
  console.log(`[InMem] Memorial CREATED with ID: ${id} for user ${newMemorial.userId}. Total memorials: ${memorials.size}`);
  console.log('[InMem] Stored content for new memorial:', JSON.stringify(newMemorial, null, 2));
  return newMemorial;
}

export async function deleteMemorial(memorialId: string, userId: string): Promise<void> {
  console.log(`[InMem] deleteMemorial called for ID: ${memorialId}, User: ${userId}`);
  const memorial = memorials.get(memorialId);
  if (memorial) {
    if (memorial.userId !== userId) {
      console.error(`[InMem] Unauthorized: User ${userId} cannot delete memorial ${memorialId} owned by ${memorial.userId}.`);
      throw new Error(`Unauthorized: User ${userId} cannot delete memorial ${memorialId} owned by ${memorial.userId}.`);
    }
    memorials.delete(memorialId);
    console.log(`[InMem] Memorial DELETED: ${memorialId}. Total memorials: ${memorials.size}`);
  } else {
    console.warn(`[InMem] Memorial with ID ${memorialId} not found for deletion.`);
  }
}

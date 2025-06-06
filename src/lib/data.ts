
'use server';

import type { MemorialData, Photo } from '@/lib/types';
import { db } from '@/lib/firebase'; // Import Firestore instance
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

// Helper function to format detailed error messages
function formatFirestoreError(error: any, operation: string, contextId?: string): Error {
  let message = `Failed to ${operation} memorial`;
  if (contextId) {
    message += ` (ID: ${contextId})`;
  }
  message += '.';

  if (error instanceof Error && error.message) {
    message += ` Firebase error: ${error.message}`;
  }
  if (typeof error === 'object' && error !== null && 'code' in error) {
    message += ` (Code: ${(error as {code: string}).code})`;
  }
  return new Error(message);
}

// Public memorial pages can fetch by ID without userId check
export async function getMemorialById(id: string): Promise<MemorialData | undefined> {
  console.log(`[Firestore] getMemorialById called for ID: ${id}`);
  try {
    const memorialRef = doc(db, 'memorials', id);
    const memorialSnap = await getDoc(memorialRef);

    if (memorialSnap.exists()) {
      const data = memorialSnap.data() as MemorialData;
      console.log(`[Firestore] Memorial found for ID ${id}:`, { name: data.deceasedName, userId: data.userId });
      return { ...data, id: memorialSnap.id }; // Ensure id is part of the returned object
    } else {
      console.log(`[Firestore] No memorial found for ID ${id}`);
      return undefined;
    }
  } catch (error) {
    console.error(`[Firestore] Error fetching memorial by ID ${id}:`, error);
    throw formatFirestoreError(error, 'fetch', id);
  }
}

// Admin function: get all memorials for a specific user
export async function getAllMemorialsForUser(userId: string): Promise<{ id: string; deceasedName: string; birthDate: string; deathDate: string; profilePhotoUrl?: string; }[]> {
  console.log(`[Firestore] getAllMemorialsForUser called for user: ${userId}`);
  try {
    const memorialsCol = collection(db, 'memorials');
    const q = query(memorialsCol, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const userMemorials = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data() as MemorialData;
      return {
        id: docSnap.id,
        deceasedName: data.deceasedName,
        birthDate: data.birthDate,
        deathDate: data.deathDate,
        profilePhotoUrl: data.photos && data.photos.length > 0 ? data.photos[0].url : undefined,
      };
    });
    console.log(`[Firestore] Found ${userMemorials.length} memorials for user ${userId}`);
    return userMemorials;
  } catch (error) {
    console.error(`[Firestore] Error fetching memorials for user ${userId}:`, error);
    throw formatFirestoreError(error, 'fetch memorials for user', userId);
  }
}

// Admin function: save/update memorial, ensuring it's for the correct user
export async function saveMemorial(id: string, userId: string, data: MemorialData): Promise<MemorialData> {
  console.log(`[Firestore] saveMemorial called for ID: ${id}, User: ${userId}`);
  try {
    const memorialRef = doc(db, 'memorials', id);
    const memorialSnap = await getDoc(memorialRef);

    if (!memorialSnap.exists()) {
      const errorMsg = `Memorial with ID ${id} not found for update.`;
      console.error(`[Firestore] saveMemorial Error: ${errorMsg}`);
      throw new Error(errorMsg); // Specific error, not using formatFirestoreError here for not found
    }

    const existingData = memorialSnap.data() as MemorialData;
    if (existingData.userId !== userId) {
      const errorMsg = `Unauthorized: User ${userId} cannot edit memorial ${id} owned by ${existingData.userId}.`;
      console.error(`[Firestore] saveMemorial Error: ${errorMsg}`);
      throw new Error(errorMsg); // Specific error for unauthorized
    }

    const dataToUpdate: Partial<MemorialData> = { ...data };
    delete dataToUpdate.id;
    
    await updateDoc(memorialRef, dataToUpdate);
    console.log(`[Firestore] Memorial updated: ${id}`);
    return { ...data, id };
  } catch (error) {
    console.error(`[Firestore] Error saving memorial ${id}:`, error);
    // Check if it's one of the custom errors thrown above, if so, rethrow it
    if (error instanceof Error && (error.message.startsWith("Memorial with ID") || error.message.startsWith("Unauthorized:"))) {
      throw error;
    }
    throw formatFirestoreError(error, 'save', id);
  }
}

// Admin function: create a new memorial
export async function createMemorial(userId: string, data: MemorialData): Promise<MemorialData> {
  if (!data.id) {
    const errMsg = "[Firestore] createMemorial Error: Memorial ID is missing in data payload.";
    console.error(errMsg);
    throw new Error("Memorial ID is required to create a memorial.");
  }
  const memorialId = data.id;
  console.log(`[Firestore] createMemorial called for User: ${userId}. Memorial ID: ${memorialId}`);
  
  try {
    const memorialRef = doc(db, 'memorials', memorialId);
    const dataToSave: MemorialData = {
      ...data,
      userId: userId,
    };

    await setDoc(memorialRef, dataToSave);
    console.log(`[Firestore] Memorial created with ID: ${memorialId} for user ${userId}.`);
    return dataToSave;
  } catch (error) {
    console.error(`[Firestore] Error creating memorial ${memorialId}:`, error);
    throw formatFirestoreError(error, 'create', memorialId);
  }
}

// Admin function: delete memorial
export async function deleteMemorial(memorialId: string, userId: string): Promise<void> {
  console.log(`[Firestore] deleteMemorial called for ID: ${memorialId}, User: ${userId}`);
  try {
    const memorialRef = doc(db, 'memorials', memorialId);
    const memorialSnap = await getDoc(memorialRef);

    if (!memorialSnap.exists()) {
      console.warn(`[Firestore] Memorial with ID ${memorialId} not found for deletion.`);
      return; 
    }

    const existingData = memorialSnap.data() as MemorialData;
    if (existingData.userId !== userId) {
      const errorMsg = `Unauthorized: User ${userId} cannot delete memorial ${memorialId} owned by ${existingData.userId}.`;
      console.error(`[Firestore] deleteMemorial Error: ${errorMsg}`);
      throw new Error(errorMsg); // Specific error for unauthorized
    }

    await deleteDoc(memorialRef);
    console.log(`[Firestore] Memorial deleted: ${memorialId}.`);
  } catch (error) {
    console.error(`[Firestore] Error deleting memorial ${memorialId}:`, error);
    if (error instanceof Error && error.message.startsWith("Unauthorized:")) {
      throw error;
    }
    throw formatFirestoreError(error, 'delete', memorialId);
  }
}

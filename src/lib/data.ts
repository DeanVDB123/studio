
// src/lib/data.ts
'use server';

import { firestore } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, setDoc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import type { MemorialData, SignupEvent } from '@/lib/types';

const memorialsCollection = collection(firestore, 'memorials');
const signupsCollection = collection(firestore, 'signups');

// Helper function to get status for a user
async function fetchUserStatus(userId: string): Promise<string> {
  if (!userId) {
    console.warn(`[Firestore] fetchUserStatus called with no userId.`);
    return 'FREE'; // Default status
  }
  const signupsQuery = query(signupsCollection, where("userId", "==", userId));
  const signupSnapshot = await getDocs(signupsQuery);

  if (!signupSnapshot.empty) {
    const signupData = signupSnapshot.docs[0].data() as SignupEvent;
    return signupData.status || 'FREE'; // Default to FREE if status field is missing
  } else {
    console.warn(`[Firestore] No signup record found for user ID: ${userId}, defaulting to FREE.`);
    return 'FREE'; // Default to FREE if no signup record exists
  }
}

export async function getUserStatus(userId: string): Promise<string> {
    console.log(`[Firestore] getUserStatus called for user: ${userId}`);
    return await fetchUserStatus(userId);
}

export async function getMemorialById(id: string): Promise<MemorialData | undefined> {
  console.log(`[Firestore] getMemorialById called for ID: ${id}`);
  const docRef = doc(memorialsCollection, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const memorialData = docSnap.data() as MemorialData;

    if (memorialData.userId) {
      console.log(`[Firestore] Found memorial owner UID: ${memorialData.userId}. Fetching status.`);
      memorialData.ownerStatus = await fetchUserStatus(memorialData.userId);
      console.log(`[Firestore] Found owner status: ${memorialData.ownerStatus}`);
    }

    return memorialData;
  } else {
    console.warn(`[Firestore] No memorial found with ID: ${id}`);
    return undefined;
  }
}

export async function getAllMemorialsForUser(userId: string): Promise<{ id: string; deceasedName: string; birthDate: string; deathDate: string; profilePhotoUrl?: string }[]> {
  console.log(`[Firestore] getAllMemorialsForUser called for user: ${userId}.`);
  const q = query(memorialsCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const userMemorials = querySnapshot.docs.map(doc => {
    const data = doc.data() as MemorialData;
    return {
      id: doc.id,
      deceasedName: data.deceasedName,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      profilePhotoUrl: data.photos && data.photos.length > 0 ? data.photos[0].url : undefined,
    };
  });
  
  console.log(`[Firestore] Found ${userMemorials.length} memorials for user ${userId}.`);
  return userMemorials;
}

export async function saveMemorial(data: MemorialData): Promise<MemorialData> {
  if (!data.id) throw new Error("Memorial ID is required for saving.");
  if (!data.userId) throw new Error("User ID is required for saving.");
  
  console.log(`[Firestore] saveMemorial (UPDATE) called for ID: ${data.id}, User: ${data.userId}`);
  const docRef = doc(memorialsCollection, data.id);
  
  await updateDoc(docRef, { ...data });

  console.log(`[Firestore] Memorial UPDATED: ${data.id}. User: ${data.userId}.`);
  return data;
}

export async function createMemorial(data: MemorialData): Promise<MemorialData> {
  if (!data.id) throw new Error("Memorial ID is required for creation.");
  if (!data.userId) throw new Error("User ID is required for creation.");
  
  console.log(`[Firestore] createMemorial (CREATE) called. UserID: ${data.userId}, Memorial ID: ${data.id}`);
  const docRef = doc(memorialsCollection, data.id);
  
  await setDoc(docRef, data);
  
  console.log(`[Firestore] Memorial CREATED with ID: ${data.id} for user ${data.userId}.`);
  return data;
}

export async function deleteMemorial(memorialId: string, userId: string): Promise<void> {
  console.log(`[Firestore] deleteMemorial called for ID: ${memorialId}, User: ${userId}`);
  
  const docRef = doc(memorialsCollection, memorialId);
  const memorial = await getMemorialById(memorialId);
  if (memorial && memorial.userId !== userId) {
    throw new Error(`Unauthorized: User ${userId} cannot delete memorial ${memorialId}.`);
  }

  await deleteDoc(docRef);
  
  console.log(`[Firestore] Memorial DELETED: ${memorialId}.`);
  // Note: This doesn't delete associated images from Storage. That would require another step.
}

export async function logSignupEvent(eventData: { userId: string; email: string | null }): Promise<void> {
  console.log(`[Firestore] logSignupEvent called for user: ${eventData.userId}`);
  try {
    const dataToLog: SignupEvent = {
      userId: eventData.userId,
      email: eventData.email || 'N/A',
      signupDate: new Date().toISOString(),
      status: 'FREE', // Assign default status
    };
    await addDoc(signupsCollection, dataToLog);
    console.log(`[Firestore] Signup event logged successfully for user ${eventData.userId} with status 'FREE'.`);
  } catch (error) {
    console.error('[Firestore] Failed to log signup event:', error);
    // Do not re-throw, as this background task should not prevent the user from signing up.
  }
}


// src/lib/data.ts
'use server';

import { firestore } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { MemorialData } from '@/lib/types';

const memorialsCollection = collection(firestore, 'memorials');

export async function getMemorialById(id: string): Promise<MemorialData | undefined> {
  console.log(`[Firestore] getMemorialById called for ID: ${id}`);
  const docRef = doc(memorialsCollection, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as MemorialData;
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

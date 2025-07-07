
// src/lib/data.ts
'use server';

import { firestore } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, setDoc, deleteDoc, updateDoc, addDoc, increment, arrayUnion, orderBy, deleteField } from 'firebase/firestore';
import type { MemorialData, SignupEvent, UserForAdmin, Feedback, AdminMemorialView } from '@/lib/types';

const memorialsCollection = collection(firestore, 'memorials');
const signupsCollection = collection(firestore, 'signups');
const feedbackCollection = collection(firestore, 'feedback');

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
    // This case might be hit for server-side rendering or if a user record is missing.
    // It is safer to return a default status than to error out.
    // However, for admin checks, a missing record means they are NOT an admin.
    console.warn(`[Firestore] No signup record found for user ID: ${userId}, defaulting to FREE.`);
    return 'FREE'; // Default to FREE if no signup record exists
  }
}

export async function getUserStatus(userId: string): Promise<string> {
    console.log(`[Firestore] getUserStatus called for user: ${userId}`);
    return await fetchUserStatus(userId);
}

export async function isAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  const status = await fetchUserStatus(userId);
  return status === 'ADMIN';
}

export async function getMemorialById(id: string): Promise<MemorialData | undefined> {
  console.log(`[Firestore] getMemorialById called for ID: ${id}`);
  const docRef = doc(memorialsCollection, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const memorialData = docSnap.data() as MemorialData;

    try {
        if (memorialData.userId) {
          console.log(`[Firestore] Found memorial owner UID: ${memorialData.userId}. Fetching status.`);
          memorialData.ownerStatus = await fetchUserStatus(memorialData.userId);
          console.log(`[Firestore] Found owner status: ${memorialData.ownerStatus}`);
        } else {
          // This is a demo/sample memorial without an owner. Treat it as public.
          console.log(`[Firestore] Memorial with ID ${id} has no owner. Treating as public demo.`);
          memorialData.ownerStatus = 'PAID'; // Assign a status that bypasses the 'FREE' tier check
        }
    } catch (error) {
        console.error(`[Firestore] Permission error fetching owner status for memorial ${id}. This may happen during server-side metadata generation for private memorials. Defaulting status. Error:`, error);
        // Default the status to avoid crashing server-side operations. 
        // Client-side logic will re-verify and handle access control.
        memorialData.ownerStatus = 'FREE';
    }

    return memorialData;
  } else {
    console.warn(`[Firestore] No memorial found with ID: ${id}`);
    return undefined;
  }
}

export async function getAllMemorialsForUser(userId: string): Promise<{ id: string; deceasedName: string; birthDate: string; deathDate: string; lifeSummary: string; profilePhotoUrl?: string; viewCount?: number; lastVisited?: string; viewTimestamps?: string[]; }[]> {
  console.log(`[Firestore] getAllMemorialsForUser called for user: ${userId}.`);
  const q = query(memorialsCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const userMemorials = querySnapshot.docs.map(doc => {
    const data = doc.data() as MemorialData;
    // Admins should see all their assigned memorials, but users should not see hidden ones.
    if (data.visibility === 'hidden') {
      return null;
    }
    return {
      id: doc.id,
      deceasedName: data.deceasedName,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      lifeSummary: data.lifeSummary,
      profilePhotoUrl: data.photos && data.photos.length > 0 ? data.photos[0].url : undefined,
      viewCount: data.viewCount || 0,
      lastVisited: data.lastVisited,
      viewTimestamps: data.viewTimestamps || [],
    };
  }).filter(Boolean); // This filters out the null values from hidden memorials
  
  console.log(`[Firestore] Found ${userMemorials.length} visible memorials for user ${userId}.`);
  return userMemorials as any[];
}

export async function saveMemorial(data: MemorialData): Promise<MemorialData> {
  if (!data.id) throw new Error("Memorial ID is required for saving.");
  if (!data.userId) throw new Error("User ID is required for saving.");
  
  console.log(`[Firestore] saveMemorial (UPDATE) called for ID: ${data.id}, User: ${data.userId}`);
  const docRef = doc(memorialsCollection, data.id);
  
  // Ensure the object passed to updateDoc does not contain undefined values
  const updateData = { ...data };
  Object.keys(updateData).forEach(key => updateData[key as keyof MemorialData] === undefined && delete updateData[key as keyof MemorialData]);

  await updateDoc(docRef, updateData);

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
  
  const isUserAdmin = await isAdmin(userId);

  // Allow deletion if the user is the owner OR if the user is an admin
  if (!isUserAdmin && memorial && memorial.userId !== userId) {
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

export async function incrementMemorialViewCount(memorialId: string): Promise<void> {
  if (!memorialId) {
    console.warn('[Firestore] incrementMemorialViewCount called with no memorialId.');
    return;
  }
  console.log(`[Firestore] incrementMemorialViewCount called for ID: ${memorialId}`);
  const docRef = doc(memorialsCollection, memorialId);
  try {
    // Atomically increment the viewCount, update lastVisited, and add a timestamp to the history.
    await updateDoc(docRef, {
      viewCount: increment(1),
      lastVisited: new Date().toISOString(),
      viewTimestamps: arrayUnion(new Date().toISOString()),
    });
    console.log(`[Firestore] View count incremented for memorial: ${memorialId}`);
  } catch (error) {
    console.error(`[Firestore] Failed to increment view count for ${memorialId}. This could be because the document does not exist or due to a permissions issue.`, error);
    // We don't re-throw because this is a non-critical background task.
  }
}

export async function saveFeedback(feedbackData: Omit<Feedback, 'id' | 'createdAt'>): Promise<void> {
  console.log(`[Firestore] saveFeedback called for user: ${feedbackData.userId}`);
  try {
    const dataToSave = {
      ...feedbackData,
      createdAt: new Date().toISOString(),
    };
    await addDoc(feedbackCollection, dataToSave);
    console.log(`[Firestore] Feedback saved successfully for user ${feedbackData.userId}.`);
  } catch (error) {
    console.error('[Firestore] Failed to save feedback:', error);
    throw new Error('Could not save feedback to the database.');
  }
}

export async function getAllFeedback(): Promise<Feedback[]> {
  console.log(`[Firestore] getAllFeedback called.`);
  const q = query(feedbackCollection, orderBy("createdAt", "desc"));
  const feedbackSnapshot = await getDocs(q);

  const feedbackList: Feedback[] = feedbackSnapshot.docs.map(doc => {
    const data = doc.data() as Feedback;
    return {
      id: doc.id,
      userId: data.userId,
      email: data.email,
      feedback: data.feedback,
      createdAt: data.createdAt,
      status: data.status || 'unread',
    };
  });
  console.log(`[Firestore] Found ${feedbackList.length} feedback entries.`);
  return feedbackList;
}

export async function getFeedbackById(id: string): Promise<Feedback | undefined> {
  console.log(`[Firestore] getFeedbackById called for ID: ${id}`);
  const docRef = doc(feedbackCollection, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const feedbackData = docSnap.data() as Feedback;
    return { ...feedbackData, id: docSnap.id };
  } else {
    console.warn(`[Firestore] No feedback found with ID: ${id}`);
    return undefined;
  }
}

export async function checkIfUserHasPaidMemorials(userId: string): Promise<boolean> {
  console.log(`[Firestore] checkIfUserHasPaidMemorials called for user: ${userId}`);
  const q = query(memorialsCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return false;
  }

  for (const doc of querySnapshot.docs) {
    const memorial = doc.data() as MemorialData;
    if (memorial.plan && memorial.plan.toUpperCase() !== 'SPIRIT') {
      if (memorial.planExpiryDate === 'ETERNAL') {
        return true; // Found an eternal plan
      }
      if (memorial.planExpiryDate && new Date() < new Date(memorial.planExpiryDate)) {
        return true; // Found an active, non-expired plan
      }
    }
  }

  return false; // No active paid memorials found
}

export async function updateFeedbackStatus(feedbackId: string, newStatus: 'read' | 'unread'): Promise<void> {
  console.log(`[Firestore] updateFeedbackStatus called for ID: ${feedbackId} to set to ${newStatus}`);
  const docRef = doc(feedbackCollection, feedbackId);
  await updateDoc(docRef, { status: newStatus });
}

export async function dbUpdateUserStatus(userId: string, newStatus: string): Promise<void> {
  console.log(`[Firestore] dbUpdateUserStatus called for user ${userId} to set status ${newStatus}.`);
    
  const q = query(signupsCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
      console.warn(`[Firestore] User with ID ${userId} not found in signups collection. Cannot update status.`);
      return;
  }

  const userDocRef = querySnapshot.docs[0].ref;
  const updatePayload: { status: string } = { status: newStatus };

  await updateDoc(userDocRef, updatePayload);
  console.log(`[Firestore] Successfully updated status for user ${userId} to ${newStatus}.`);
}

// Admin-specific functions
export async function getAllUsersWithMemorialCount(): Promise<UserForAdmin[]> {
  console.log(`[Firestore] getAllUsersWithMemorialCount called.`);
  const signupsSnapshot = await getDocs(signupsCollection);
  const memorialsSnapshot = await getDocs(memorialsCollection);

  const memorialCounts: Record<string, number> = {};
  memorialsSnapshot.forEach(doc => {
    const data = doc.data() as MemorialData;
    if (data.userId) {
      memorialCounts[data.userId] = (memorialCounts[data.userId] || 0) + 1;
    }
  });

  const users: UserForAdmin[] = signupsSnapshot.docs.map(doc => {
    const signupData = doc.data() as SignupEvent;
    return {
      userId: signupData.userId,
      email: signupData.email,
      signupDate: signupData.signupDate,
      status: signupData.status,
      memorialCount: memorialCounts[signupData.userId] || 0,
      totalQrCodes: 0,
    };
  });

  console.log(`[Firestore] Found ${users.length} total users.`);
  return users;
}

export async function getAllMemorialsForAdmin(): Promise<AdminMemorialView[]> {
    console.log(`[Firestore] getAllMemorialsForAdmin called.`);
    const memorialsSnapshot = await getDocs(collection(firestore, 'memorials'));
    const signupsSnapshot = await getDocs(collection(firestore, 'signups'));

    const usersMap: Record<string, { email: string, status: string }> = {};
    signupsSnapshot.forEach(doc => {
        const data = doc.data() as SignupEvent;
        if (data.userId) {
            usersMap[data.userId] = { email: data.email, status: data.status };
        }
    });

    const allMemorials: AdminMemorialView[] = memorialsSnapshot.docs.map(doc => {
        const data = doc.data() as MemorialData;
        const ownerInfo = data.userId ? usersMap[data.userId] : undefined;
        return {
            id: doc.id,
            deceasedName: data.deceasedName,
            ownerId: data.userId,
            ownerEmail: ownerInfo?.email || 'N/A (Demo)',
            ownerStatus: ownerInfo?.status || 'N/A',
            plan: data.plan,
            planExpiryDate: data.planExpiryDate,
            createdAt: data.createdAt || 'N/A',
            viewCount: data.viewCount || 0,
            visibility: data.visibility || 'shown',
        };
    });

    console.log(`[Firestore] Found ${allMemorials.length} total memorials for admin view.`);
    return allMemorials;
}

export async function updateMemorialVisibility(memorialId: string, newVisibility: 'shown' | 'hidden'): Promise<void> {
  console.log(`[Firestore] updateMemorialVisibility called for ID: ${memorialId} to set to ${newVisibility}`);
  const docRef = doc(memorialsCollection, memorialId);
  await updateDoc(docRef, { visibility: newVisibility });
}

export async function updateMemorialPlan(memorialId: string, newPlan: string, planExpiryDate: string | undefined): Promise<void> {
  console.log(`[Firestore] updateMemorialPlan called for ID: ${memorialId} to set plan to ${newPlan}`);
  const docRef = doc(memorialsCollection, memorialId);
  
  const payload: any = { plan: newPlan };
  if (planExpiryDate) {
    payload.planExpiryDate = planExpiryDate;
  } else {
    payload.planExpiryDate = deleteField();
  }

  await updateDoc(docRef, payload);
}
    

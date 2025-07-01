
'use server';

import { generateBiographyDraft, type GenerateBiographyDraftInput } from '@/ai/flows/generate-biography-draft';
import { organizeUserContent, type OrganizeUserContentInput } from '@/ai/flows/organize-user-content';
import type { MemorialData, OrganizedContent } from '@/lib/types';
import { createMemorial as dbCreateMemorial, saveMemorial as dbSaveMemorial, incrementMemorialViewCount, saveFeedback as dbSaveFeedback } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { uploadImage } from './storage';

export async function handleGenerateBiography(input: GenerateBiographyDraftInput): Promise<string> {
  console.log('[Action] handleGenerateBiography called with input:', JSON.stringify(input, null, 2));
  try {
    const result = await generateBiographyDraft(input);
    console.log('[Action] handleGenerateBiography successful. Result:', JSON.stringify(result, null, 2));
    return result.biographyDraft;
  } catch (error) {
    console.error('[Action] Error in handleGenerateBiography:', error);
    throw new Error('Failed to generate AI biography. Please check the summary and try again.');
  }
}

export async function handleOrganizeContent(input: OrganizeUserContentInput): Promise<OrganizedContent> {
  console.log('[Action] handleOrganizeContent called with input keys:', Object.keys(input));
  try {
    const result = await organizeUserContent(input);
    console.log('[Action] handleOrganizeContent successful. Result keys:', Object.keys(result.organizedContent));
    return result.organizedContent;
  } catch (error) {
    console.error('[Action] Error in handleOrganizeContent:', error);
    throw new Error('Failed to organize content with AI. Please review the content and try again.');
  }
}

export async function saveMemorialAction(userId: string, memorialData: MemorialData, isUpdate: boolean): Promise<MemorialData> {
  console.log(`[Action] saveMemorialAction called. User: ${userId}, isUpdate: ${isUpdate}, Memorial ID from input: ${memorialData.id}`);

  if (!userId) {
    console.error('[Action] CRITICAL: userId is missing in saveMemorialAction.');
    throw new Error('User authentication is required to save a memorial.');
  }

  const dataId = memorialData.id;
  if (!dataId) {
    console.error('[Action] CRITICAL: memorialData.id is missing in saveMemorialAction.');
    throw new Error('Memorial ID is required to save a memorial.');
  }
  
  // Handle image uploads before saving to Firestore
  try {
    // Filter out photos with no URL to avoid trying to upload empty data
    const photosToProcess = memorialData.photos.filter(photo => photo.url && photo.url.trim() !== '');

    const uploadPromises = photosToProcess.map(async (photo) => {
      // If the URL is a data URI, it's a new file that needs to be uploaded.
      // Existing photos will have http/https URLs and will be skipped.
      if (photo.url.startsWith('data:image')) {
        console.log(`[Action] Found new image data URI to upload for photo ID ${photo.id}`);
        const newUrl = await uploadImage(photo.url, dataId);
        return { ...photo, url: newUrl }; // Return a new photo object with the Firebase Storage URL
      }
      return photo; // Return existing photo object as is
    });

    // Wait for all uploads to complete
    const updatedPhotos = await Promise.all(uploadPromises);
    memorialData.photos = updatedPhotos; // Replace the photos array with the one containing new URLs
    console.log('[Action] All new images uploaded and photo URLs updated.');

  } catch (error) {
    console.error('[Action] Error during image upload process:', error);
    throw new Error('Failed to upload one or more images. Please try again.');
  }


  const dataToSave: MemorialData = {
    ...memorialData,
    userId: userId.trim(),
    id: dataId,
  };
  
  if (!isUpdate) {
    dataToSave.viewCount = 0; // Initialize view count for new memorials
  }
  
  console.log(`[Action] Data prepared for DB operation (dataToSave):`, JSON.stringify(dataToSave, null, 2));

  try {
    let savedMemorial: MemorialData;
    if (isUpdate) {
      if (!dataToSave.id) {
        console.error('[Action] CRITICAL: ID missing for an update operation.');
        throw new Error('Memorial ID is required for an update.');
      }
      console.log(`[Action] Calling dbSaveMemorial (UPDATE) with ID: ${dataToSave.id}, User: ${dataToSave.userId}`);
      savedMemorial = await dbSaveMemorial(dataToSave);
    } else {
      console.log(`[Action] Calling dbCreateMemorial (CREATE) with User: ${dataToSave.userId}, ID: ${dataToSave.id}`);
      savedMemorial = await dbCreateMemorial(dataToSave);
    }
    console.log(`[Action] Memorial ${isUpdate ? 'updated' : 'created'} successfully. ID: ${savedMemorial.id}, User: ${savedMemorial.userId}`);
    
    revalidatePath('/memorials', 'page');
    if (savedMemorial.id) {
      revalidatePath(`/edit/${savedMemorial.id}`);
      revalidatePath(`/${savedMemorial.id}`);
    }
    
    return savedMemorial;
  } catch (error: any) {
    console.error(`[Action] Error ${isUpdate ? 'saving' : 'creating'} memorial:`, error);
    if (error.message && error.message.includes('PERMISSION_DENIED')) {
      throw new Error(`Permission denied. This could be due to Firestore Security Rules. Ensure the 'userId' (${userId}) in the memorial data matches the authenticated user and the rules allow this operation.`);
    }
    // Pass the more specific error from the data layer up to the UI
    throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} memorial page. ${error.message || 'Please try again.'}`);
  }
}

export async function logMemorialViewAction(memorialId: string): Promise<void> {
  console.log(`[Action] logMemorialViewAction called for memorial ID: ${memorialId}`);
  if (!memorialId) {
    console.warn('[Action] logMemorialViewAction called without memorialId.');
    return;
  }
  try {
    await incrementMemorialViewCount(memorialId);
    // Revalidate the pages that show the view count.
    revalidatePath('/memorials', 'page');
    revalidatePath('/visits', 'page');
  } catch (error) {
    console.error(`[Action] Error in logMemorialViewAction for ID ${memorialId}:`, error);
    // Do not re-throw, this is a background task.
  }
}

export async function saveFeedbackAction(feedbackData: {
  userId: string;
  email: string;
  feedback: string;
}): Promise<void> {
  console.log(`[Action] saveFeedbackAction called for user: ${feedbackData.userId}`);
  if (!feedbackData.userId) {
    throw new Error('You must be logged in to submit feedback.');
  }
  if (!feedbackData.feedback || !feedbackData.feedback.trim()) {
    throw new Error('Feedback cannot be empty.');
  }

  try {
    await dbSaveFeedback(feedbackData);
  } catch (error: any) {
    console.error('[Action] Error in saveFeedbackAction:', error);
    throw new Error(error.message || 'An unexpected error occurred while saving feedback.');
  }
}

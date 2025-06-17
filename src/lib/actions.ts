
'use server';

import { generateBiographyDraft, type GenerateBiographyDraftInput } from '@/ai/flows/generate-biography-draft';
import { organizeUserContent, type OrganizeUserContentInput } from '@/ai/flows/organize-user-content';
import type { MemorialData, OrganizedContent } from '@/lib/types';
import { createMemorial as dbCreateMemorial, saveMemorial as dbSaveMemorial } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

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
  console.log(`[Action] Full memorialData received in saveMemorialAction:`, JSON.stringify(memorialData, null, 2));

  if (!userId) {
    console.error('[Action] CRITICAL: userId is missing in saveMemorialAction.');
    throw new Error('User authentication is required to save a memorial.');
  }

  const dataId = memorialData.id || uuidv4();
  console.log(`[Action] Determined dataId (memorialData.id || uuidv4()): ${dataId}`);

  const dataToSave: MemorialData = {
    ...memorialData,
    userId: userId,
    id: dataId,
  };
  console.log(`[Action] Data prepared for DB operation (dataToSave):`, JSON.stringify(dataToSave, null, 2));

  try {
    let savedMemorial: MemorialData;
    if (isUpdate) {
      if (!dataToSave.id) {
        console.error('[Action] CRITICAL: ID missing for an update operation.');
        throw new Error('Memorial ID is required for an update.');
      }
      console.log(`[Action] Calling dbSaveMemorial (UPDATE) with ID: ${dataToSave.id}, User: ${dataToSave.userId}`);
      savedMemorial = await dbSaveMemorial(dataToSave.id, dataToSave.userId, dataToSave);
    } else {
      // For create, ensure the data passed to dbCreateMemorial includes the correct id and userId
      console.log(`[Action] Calling dbCreateMemorial (CREATE) with User: ${dataToSave.userId}, ID: ${dataToSave.id}`);
      savedMemorial = await dbCreateMemorial(dataToSave.userId, dataToSave); // Pass the entire dataToSave object
    }
    console.log(`[Action] Memorial ${isUpdate ? 'updated' : 'created'} successfully. ID: ${savedMemorial.id}, User: ${savedMemorial.userId}`);
    
    revalidatePath('/admin', 'layout'); // Revalidate the admin dashboard and its layout
    if (savedMemorial.id) {
      revalidatePath(`/admin/edit/${savedMemorial.id}`);
      revalidatePath(`/memorial/${savedMemorial.id}`);
    }
    
    return savedMemorial;
  } catch (error: any) {
    console.error(`[Action] Error ${isUpdate ? 'updating' : 'creating'} memorial:`, error);
    if (error.message && error.message.includes('PERMISSION_DENIED')) {
      throw new Error(`Permission denied. This could be due to Firestore Security Rules. Ensure the 'userId' (${userId}) in the memorial data matches the authenticated user and the rules allow this operation.`);
    }
    throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} memorial page. ${error.message || 'Please try again.'}`);
  }
}


'use server';

import { generateBiographyDraft, type GenerateBiographyDraftInput } from '@/ai/flows/generate-biography-draft';
import { organizeUserContent, type OrganizeUserContentInput } from '@/ai/flows/organize-user-content';
import type { MemorialData, OrganizedContent } from '@/lib/types';
import { createMemorial as dbCreateMemorial, saveMemorial as dbSaveMemorial } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export async function handleGenerateBiography(input: GenerateBiographyDraftInput): Promise<string> {
  try {
    const result = await generateBiographyDraft(input);
    return result.biographyDraft;
  } catch (error) {
    console.error('Error generating biography draft:', error);
    throw new Error('Failed to generate biography. Please try again.');
  }
}

export async function handleOrganizeContent(input: OrganizeUserContentInput): Promise<OrganizedContent> {
  try {
    const result = await organizeUserContent(input);
    return result.organizedContent;
  } catch (error) {
    console.error('Error organizing content:', error);
    throw new Error('Failed to organize content. Please try again.');
  }
}

export async function saveMemorialAction(userId: string, memorialData: MemorialData): Promise<MemorialData> {
  if (!userId) {
    throw new Error("User ID is required to save a memorial.");
  }
  try {
    let savedMemorial: MemorialData;
    const dataToSave = { ...memorialData, userId }; // Ensure userId is part of the data payload

    if (memorialData.id) {
      // For updates, dbSaveMemorial in data.ts should check ownership
      savedMemorial = await dbSaveMemorial(memorialData.id, userId, dataToSave);
    } else {
      // For creates, dbCreateMemorial in data.ts will assign the userId
      savedMemorial = await dbCreateMemorial(userId, dataToSave);
    }
    revalidatePath('/admin'); // Revalidate the admin dashboard for the current user
    if (savedMemorial.id) {
       revalidatePath(`/admin/edit/${savedMemorial.id}`); // Revalidate specific edit page
       revalidatePath(`/memorial/${savedMemorial.id}`); // Revalidate public memorial page
    }
    return savedMemorial;
  } catch (error: any) {
    console.error('Error saving memorial data:', error);
    // More specific error messages could be returned if needed
    throw new Error(error.message || 'Failed to save memorial data. Please try again.');
  }
}

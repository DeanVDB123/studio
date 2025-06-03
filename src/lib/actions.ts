
'use server';

import { generateBiographyDraft, GenerateBiographyDraftInput } from '@/ai/flows/generate-biography-draft';
import { organizeUserContent, OrganizeUserContentInput } from '@/ai/flows/organize-user-content';
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

export async function saveMemorialAction(memorialData: MemorialData): Promise<MemorialData> {
  try {
    let savedMemorial: MemorialData;
    if (memorialData.id) {
      savedMemorial = await dbSaveMemorial(memorialData.id, memorialData);
    } else {
      savedMemorial = await dbCreateMemorial(memorialData);
    }
    revalidatePath('/admin');
    if (savedMemorial.id) {
       revalidatePath(`/admin/edit/${savedMemorial.id}`);
       revalidatePath(`/memorial/${savedMemorial.id}`);
    }
    return savedMemorial;
  } catch (error: any) {
    console.error('Error saving memorial data:', error);
    throw new Error('Failed to save memorial data. Please try again.');
  }
}


'use server';

import { storage } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads an image from a data URI to Firebase Storage.
 * @param dataUri The data URI of the image to upload.
 * @param memorialId The ID of the memorial this image belongs to.
 * @returns The public download URL of the uploaded image.
 */
export async function uploadImage(dataUri: string, memorialId: string): Promise<string> {
  if (!dataUri.startsWith('data:image')) {
    throw new Error('Invalid data URI format.');
  }
  
  const fileType = dataUri.split(';')[0].split('/')[1];
  const imageId = uuidv4();
  const storagePath = `memorials/${memorialId}/${imageId}.${fileType}`;
  const storageRef = ref(storage, storagePath);

  try {
    // We need to strip the 'data:image/jpeg;base64,' part from the URI
    const base64Data = dataUri.split(',')[1];
    
    // Upload the base64 string
    const snapshot = await uploadString(storageRef, base64Data, 'base64', {
      contentType: `image/${fileType}`
    });
    
    // Get the public URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log(`[Storage] Image uploaded successfully to ${storagePath}. URL: ${downloadURL}`);
    return downloadURL;

  } catch (error) {
    console.error('[Storage] Error uploading image:', error);
    throw new Error('Failed to upload image to Firebase Storage.');
  }
}

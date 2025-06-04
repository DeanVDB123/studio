
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { MemorialData, Photo, OrganizedContent } from '@/lib/types';
import { handleGenerateBiography, handleOrganizeContent, saveMemorialAction } from '@/lib/actions';
import { Wand2, UploadCloud, Trash2, FileImage, PlusCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

const photoSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1, "Image URL is required."),
  caption: z.string().optional(),
});

const memorialFormSchema = z.object({
  deceasedName: z.string().min(1, "Deceased's name is required."),
  birthDate: z.string().min(1, "Birth date is required."),
  deathDate: z.string().min(1, "Death date is required."),
  lifeSummary: z.string().min(1, "Life summary is required for AI biography generation."),
  biography: z.string().min(1, "Biography is required."),
  photos: z.array(photoSchema).min(0, "At least one photo is recommended."),
  tributes: z.array(z.string()).min(0, "At least one tribute is recommended."),
  stories: z.array(z.string()).min(0, "At least one story is recommended."),
});

type MemorialFormValues = z.infer<typeof memorialFormSchema>;

interface MemorialFormProps {
  initialData?: MemorialData;
  memorialId?: string;
}

export function MemorialForm({ initialData, memorialId }: MemorialFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isAiBioLoading, setIsAiBioLoading] = useState(false);
  const [isAiOrganizeLoading, setIsAiOrganizeLoading] = useState(false);

  const { control, handleSubmit, register, watch, setValue, getValues, formState: { errors } } = useForm<MemorialFormValues>({
    resolver: zodResolver(memorialFormSchema),
    defaultValues: {
      deceasedName: initialData?.deceasedName || '',
      birthDate: initialData?.birthDate || '',
      deathDate: initialData?.deathDate || '',
      lifeSummary: initialData?.lifeSummary || '',
      biography: initialData?.biography || '',
      photos: initialData?.photos || [],
      tributes: initialData?.tributes || [],
      stories: initialData?.stories || [],
    },
  });

  const { fields: photoFields, append: appendPhoto, remove: removePhoto } = useFieldArray({ control, name: "photos" });
  const { fields: tributeFields, append: appendTribute, remove: removeTribute } = useFieldArray({ control, name: "tributes" });
  const { fields: storyFields, append: appendStory, remove: removeStory } = useFieldArray({ control, name: "stories" });

  const watchPhotos = watch("photos");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue(`photos.${index}.url`, reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const onOrganizeContent = async () => {
    const { biography, tributes, stories, photos } = getValues();
    if (!biography && tributes.length === 0 && stories.length === 0 && photos.length === 0) {
      toast({ title: "Missing Content", description: "Please add some content (biography, tributes, stories, or photos) to organize.", variant: "destructive" });
      return;
    }
    
    setIsAiOrganizeLoading(true);
    try {
      const photosDataUris = photos.map(p => p.url).filter(url => url.startsWith('data:'));
      if (photos.some(p => !p.url.startsWith('data:')) && photos.length > 0) {
         toast({ title: "Warning", description: "Some photos are not data URIs and will be ignored by the AI organization process. Please ensure all photos are uploaded directly.", variant: "default" });
      }

      const organized: OrganizedContent = await handleOrganizeContent({
        biography,
        tributes,
        stories,
        photosDataUris,
      });

      setValue('biography', organized.biography, { shouldValidate: true });
      setValue('tributes', organized.tributes, { shouldValidate: true });
      setValue('stories', organized.stories, { shouldValidate: true });
      
      console.log("AI organized photo URIs:", organized.photoGallery);
      toast({ title: "Content Organized by AI", description: "Biography, tributes, and stories have been updated." });

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsAiOrganizeLoading(false);
    }
  };
  
  const onSubmit = (data: MemorialFormValues) => {
    startTransition(async () => {
      try {
        const payload: MemorialData = {
          ...data,
          id: memorialId,
        };
        const savedMemorial = await saveMemorialAction(payload);
        toast({ title: "Success", description: `Memorial page for ${savedMemorial.deceasedName} ${memorialId ? 'updated' : 'created'}.` });
        
        router.push('/admin'); 
      } catch (error: any) {
        toast({ title: "Error saving memorial", description: error.message, variant: "destructive" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Deceased Information</CardTitle>
          <CardDescription>Basic details about the person being remembered.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deceasedName">Full Name</Label>
              <Input id="deceasedName" {...register('deceasedName')} placeholder="e.g., Jane Doe" />
              {errors.deceasedName && <p className="text-sm text-destructive mt-1">{errors.deceasedName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lifeSummary">Brief Life Summary (for AI Bio)</Label>
              <Input id="lifeSummary" {...register('lifeSummary')} placeholder="e.g., Loved gardening, family, and travel." />
              {errors.lifeSummary && <p className="text-sm text-destructive mt-1">{errors.lifeSummary.message}</p>}
            </div>
            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input id="birthDate" type="date" {...register('birthDate')} />
              {errors.birthDate && <p className="text-sm text-destructive mt-1">{errors.birthDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="deathDate">Death Date</Label>
              <Input id="deathDate" type="date" {...register('deathDate')} />
              {errors.deathDate && <p className="text-sm text-destructive mt-1">{errors.deathDate.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Biography</CardTitle>
          <CardDescription>Share their life story. You can use the "Life Summary" field above to help the AI generate a starting point using the "Organize All Content with AI" button below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea id="biography" {...register('biography')} rows={10} placeholder="Write or generate the biography here..." />
          {errors.biography && <p className="text-sm text-destructive mt-1">{errors.biography.message}</p>}
        </CardContent>
      </Card>
      
      <Separator />

      <div className="flex justify-end">
          <Button type="button" onClick={onOrganizeContent} variant="secondary" disabled={isAiOrganizeLoading || isAiBioLoading}>
            {isAiOrganizeLoading || isAiBioLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Organize All Content with AI
          </Button>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Photo Gallery</CardTitle>
          <CardDescription>Upload photos to remember them by. AI Organization uses uploaded photos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {photoFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-4 p-4 border rounded-md">
              <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {watchPhotos[index]?.url ? (
                  <Image src={watchPhotos[index].url} alt={`Photo ${index + 1}`} width={96} height={96} className="object-cover w-full h-full" data-ai-hint="person memory" />
                ) : (
                  <FileImage className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex-grow space-y-2">
                <Label htmlFor={`photos.${index}.file`}>Upload Image</Label>
                <Input
                  id={`photos.${index}.file`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                  className="text-sm"
                />
                <Input type="hidden" {...register(`photos.${index}.url`)} />
                {errors.photos?.[index]?.url && <p className="text-sm text-destructive mt-1">{errors.photos[index]?.url?.message}</p>}
                
                <Label htmlFor={`photos.${index}.caption`}>Caption (Optional)</Label>
                <Input id={`photos.${index}.caption`} {...register(`photos.${index}.caption`)} placeholder="e.g., Graduation Day, 2010" />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removePhoto(index)} aria-label="Remove photo">
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendPhoto({ url: '', caption: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Photo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Tributes</CardTitle>
          <CardDescription>Collect messages and condolences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tributeFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <Textarea {...register(`tributes.${index}`)} placeholder={`Tribute ${index + 1}`} rows={2} className="flex-grow" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeTribute(index)} aria-label="Remove tribute">
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendTribute('')}>
             <PlusCircle className="mr-2 h-4 w-4" /> Add Tribute
          </Button>
           {errors.tributes && <p className="text-sm text-destructive mt-1">{typeof errors.tributes.message === 'string' ? errors.tributes.message : "Error in tributes"}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Stories & Memories</CardTitle>
          <CardDescription>Share personal anecdotes and cherished memories.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {storyFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <Textarea {...register(`stories.${index}`)} placeholder={`Story ${index + 1}`} rows={3} className="flex-grow" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeStory(index)} aria-label="Remove story">
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendStory('')}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Story
          </Button>
          {errors.stories && <p className="text-sm text-destructive mt-1">{typeof errors.stories.message === 'string' ? errors.stories.message : "Error in stories"}</p>}
        </CardContent>
      </Card>

      <CardFooter className="flex justify-end sticky bottom-0 bg-background py-4 border-t">
        <Button type="submit" disabled={isPending || isAiBioLoading || isAiOrganizeLoading} size="lg">
          {isPending || isAiBioLoading || isAiOrganizeLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {memorialId ? 'Update' : 'Create'} Memorial Page
        </Button>
      </CardFooter>
    </form>
  );
}

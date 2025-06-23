
"use client";

import type { ChangeEvent } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, UploadCloud, Trash2, FileImage, PlusCircle, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { MemorialData, Photo } from '@/lib/types';
import { saveMemorialAction } from '@/lib/actions';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const photoSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1, "Image URL is required."),
  caption: z.string().optional(),
});

const memorialFormSchema = z.object({
  deceasedName: z.string().min(1, "Deceased's name is required."),
  birthDate: z.string().min(1, "Birth date is required."),
  deathDate: z.string().min(1, "Death date is required."),
  lifeSummary: z.string().min(1, "Life summary is required."),
  biography: z.string().min(1, "Biography is required."),
  photos: z.array(photoSchema).min(0, "At least one photo is recommended."),
  tributes: z.array(z.string()).min(0, "At least one tribute is recommended."),
  stories: z.array(z.string()).min(0, "At least one story is recommended."),
}).refine(
  (data) => {
    if (data.birthDate && data.deathDate) {
      return new Date(data.deathDate) >= new Date(data.birthDate);
    }
    return true;
  },
  {
    message: "Death date must be on or after the birth date.",
    path: ["deathDate"],
  }
);


type MemorialFormValues = z.infer<typeof memorialFormSchema>;

interface MemorialFormProps {
  initialData?: MemorialData;
  memorialId?: string;
}

export function MemorialForm({ initialData, memorialId }: MemorialFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isBirthDatePickerOpen, setIsBirthDatePickerOpen] = useState(false);
  const [isDeathDatePickerOpen, setIsDeathDatePickerOpen] = useState(false);

  const { control, handleSubmit, register, watch, setValue, formState: { errors, isSubmitting } } = useForm<MemorialFormValues>({
    resolver: zodResolver(memorialFormSchema),
    defaultValues: {
      deceasedName: initialData?.deceasedName || '',
      birthDate: initialData?.birthDate || '',
      deathDate: initialData?.deathDate || '',
      lifeSummary: initialData?.lifeSummary || '',
      biography: initialData?.biography || '',
      photos: initialData?.photos?.map(p => ({ ...p, id: p.id || uuidv4() })) || [],
      tributes: initialData?.tributes || [],
      stories: initialData?.stories || [],
    },
  });
  
  const birthDateValue = watch('birthDate');
  const deathDateValue = watch('deathDate');

  const { fields: photoFields, append: appendPhoto, remove: removePhoto } = useFieldArray({ control, name: "photos" });
  const { fields: tributeFields, append: appendTribute, remove: removeTribute } = useFieldArray({ control, name: "tributes" });
  const { fields: storyFields, append: appendStory, remove: removeStory } = useFieldArray({ control, name: "stories" });

  const watchPhotos = watch("photos");

  useEffect(() => {
    if (initialData && initialData.userId && user && initialData.userId !== user.uid) {
      toast({ title: "Unauthorized", description: "You can only edit your own memorials.", variant: "destructive" });
      router.push('/admin');
    }
  }, [initialData, user, router, toast]);

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
  
  const onSubmit = (data: MemorialFormValues) => {
    if (!user || !user.uid) {
      toast({ title: "Authentication Error", description: "You must be logged in to save a memorial.", variant: "destructive" });
      console.error("[MemorialForm] User not authenticated or UID missing at onSubmit.");
      return;
    }

    const currentUserId = user.uid;
    const isUpdating = !!memorialId; 

    console.log(`[MemorialForm] onSubmit called. User ID: ${currentUserId}. Is Updating: ${isUpdating}`);
    
    startTransition(async () => {
      try {
        const payload: MemorialData = {
          ...data, 
          userId: currentUserId, 
          photos: data.photos.map(p => ({ ...p, id: p.id || uuidv4() })), 
        };
        
        if (isUpdating) {
          payload.id = memorialId; 
          console.log(`[MemorialForm] Preparing to UPDATE existing memorial. ID: ${memorialId}. User ID: ${currentUserId}`);
        } else {
          payload.id = uuidv4(); 
          console.log(`[MemorialForm] Preparing to CREATE new memorial. Generated ID: ${payload.id}. User ID: ${currentUserId}`);
        }
        
        console.log("[MemorialForm] Payload for saveMemorialAction:", JSON.stringify(payload, null, 2));
        console.log(`[MemorialForm] Calling saveMemorialAction with isUpdate: ${isUpdating}`);
        
        const savedMemorial = await saveMemorialAction(currentUserId, payload, isUpdating);
        console.log("[MemorialForm] saveMemorialAction successful. Response:", JSON.stringify(savedMemorial, null, 2));
        
        toast({ title: "Success", description: `Memorial page for ${savedMemorial.deceasedName} ${isUpdating ? 'updated' : 'created'}.` });
        
        // Navigate to the admin dashboard and refresh the page to show the new data
        router.push('/admin');
        router.refresh(); 
      } catch (error: any) {
        console.error(`[MemorialForm] Error in onSubmit (calling saveMemorialAction for ${isUpdating ? 'update' : 'create'}):`, error);
        toast({ title: "Error saving memorial", description: error.message || "An unexpected error occurred.", variant: "destructive" });
      }
    });
  };


  if (authLoading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading form...</span></div>;
  }

  if (!user && !authLoading) {
    router.push('/login');
    return null;
  }

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
              <Label htmlFor="lifeSummary">Brief Life Summary</Label>
              <Input id="lifeSummary" {...register('lifeSummary')} placeholder="e.g., Loved gardening, family, and travel." />
              {errors.lifeSummary && <p className="text-sm text-destructive mt-1">{errors.lifeSummary.message}</p>}
            </div>
            <div>
                <Label htmlFor="birthDate">Birth Date</Label>
                <Controller
                    control={control}
                    name="birthDate"
                    render={({ field }) => (
                        <Popover open={isBirthDatePickerOpen} onOpenChange={setIsBirthDatePickerOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(parseISO(field.value), "dd/MM/yyyy") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={field.value ? parseISO(field.value) : undefined}
                                    onSelect={(date) => {
                                        field.onChange(date ? format(date, "yyyy-MM-dd") : '');
                                        setIsBirthDatePickerOpen(false);
                                    }}
                                    disabled={(date) =>
                                        date > new Date() || (deathDateValue ? date > new Date(deathDateValue) : false)
                                    }
                                    initialFocus
                                    captionLayout="dropdown-buttons"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                />
                {errors.birthDate && <p className="text-sm text-destructive mt-1">{errors.birthDate.message}</p>}
            </div>
            <div>
                <Label htmlFor="deathDate">Death Date</Label>
                <Controller
                    control={control}
                    name="deathDate"
                    render={({ field }) => (
                         <Popover open={isDeathDatePickerOpen} onOpenChange={setIsDeathDatePickerOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(parseISO(field.value), "dd/MM/yyyy") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={field.value ? parseISO(field.value) : undefined}
                                    onSelect={(date) => {
                                        field.onChange(date ? format(date, "yyyy-MM-dd") : '');
                                        setIsDeathDatePickerOpen(false);
                                    }}
                                    disabled={(date) =>
                                        date > new Date() || (birthDateValue ? date < new Date(birthDateValue) : false)
                                    }
                                    initialFocus
                                    captionLayout="dropdown-buttons"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                />
                {errors.deathDate && <p className="text-sm text-destructive mt-1">{errors.deathDate.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Biography</CardTitle>
          <CardDescription>Share their life story. You can use the "Life Summary" field above to help write a comprehensive biography.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea id="biography" {...register('biography')} rows={10} placeholder="Write the biography here..." />
          {errors.biography && <p className="text-sm text-destructive mt-1">{errors.biography.message}</p>}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Photo Gallery</CardTitle>
          <CardDescription>Upload photos to remember them by. The first photo will be used as the profile picture on the memorial card and public page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {photoFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-4 p-4 border rounded-md">
              <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {watchPhotos[index]?.url ? (
                  <Image src={watchPhotos[index].url} alt={watchPhotos[index]?.caption || `Photo ${index + 1}`} width={96} height={96} className="object-cover w-full h-full" />
                ) : (
                  <FileImage className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex-grow space-y-2">
                <Label htmlFor={`photos.${index}.file`}>
                  {index === 0 ? "Upload Profile Photo (Main photo for card)" : `Upload Gallery Image ${index + 1}`}
                </Label>
                <Input
                  id={`photos.${index}.file`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                  className="text-sm"
                />
                <Controller
                  name={`photos.${index}.url`}
                  control={control}
                  render={({ field: urlField }) => <Input type="hidden" {...urlField} />}
                />
                {errors.photos?.[index]?.url && <p className="text-sm text-destructive mt-1">{errors.photos[index]?.url?.message}</p>}
                
                <Label htmlFor={`photos.${index}.caption`}>Caption (Optional)</Label>
                <Input id={`photos.${index}.caption`} {...register(`photos.${index}.caption`)} placeholder={index === 0 ? "e.g., A cherished portrait" : `e.g., Graduation Day, 2010`} />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removePhoto(index)} aria-label="Remove photo" disabled={isSubmitting || isPending}>
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendPhoto({ id: uuidv4(), url: '', caption: '' })} disabled={isSubmitting || isPending}>
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
              <Button type="button" variant="ghost" size="icon" onClick={() => removeTribute(index)} aria-label="Remove tribute" disabled={isSubmitting || isPending}>
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendTribute('')} disabled={isSubmitting || isPending}>
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
              <Button type="button" variant="ghost" size="icon" onClick={() => removeStory(index)} aria-label="Remove story" disabled={isSubmitting || isPending}>
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendStory('')} disabled={isSubmitting || isPending}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Story
          </Button>
          {errors.stories && <p className="text-sm text-destructive mt-1">{typeof errors.stories.message === 'string' ? errors.stories.message : "Error in stories"}</p>}
        </CardContent>
      </Card>

      <CardFooter className="flex justify-end sticky bottom-0 bg-background py-4 border-t">
        <Button type="submit" disabled={isPending || authLoading || !user || isSubmitting} size="lg">
          {isPending || authLoading || isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {memorialId ? 'Update' : 'Create'} Memorial Page
        </Button>
      </CardFooter>
    </form>
  );
}

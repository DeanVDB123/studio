
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { getMemorialById } from '@/lib/data';
import type { MemorialData } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

import { MemorialPageHeader } from '@/components/memorial/MemorialPageHeader';
import { BiographySection } from '@/components/memorial/BiographySection';
import { PhotoGallerySection } from '@/components/memorial/PhotoGallerySection';
import { TributesSection } from '@/components/memorial/TributesSection';
import { StoriesSection } from '@/components/memorial/StoriesSection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Feather, Lock, Loader2 } from 'lucide-react';
import { logMemorialViewAction } from '@/lib/actions';


interface MemorialClientPageProps {
  memorialId: string;
}

export default function MemorialClientPage({ memorialId }: MemorialClientPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [memorialData, setMemorialData] = useState<MemorialData | null | undefined>(undefined); // undefined: loading, null: not found/error
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMemorial() {
      if (!memorialId) return;
      setIsLoading(true);
      try {
        const data = await getMemorialById(memorialId);
        setMemorialData(data || null);
      } catch (error) {
        console.error("[MemorialPage] Failed to fetch memorial data:", error);
        setMemorialData(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMemorial();
  }, [memorialId]);

  useEffect(() => {
    // Log a view when the page has finished loading and has a valid memorialId
    if (memorialId && !isLoading) {
      logMemorialViewAction(memorialId);
    }
  }, [memorialId, isLoading]);


  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Memorial...</p>
      </div>
    );
  }

  if (!memorialData) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <Feather className="h-5 w-5" />
          <AlertTitle className="font-headline">Memorial Not Found</AlertTitle>
          <AlertDescription>
            The memorial page you are looking for does not exist or may have been removed.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-8">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  // Access Control Logic
  const isFreeTier = memorialData.ownerStatus === 'FREE';
  const isOwner = user && user.uid === memorialData.userId;

  if (isFreeTier && !isOwner) {
    return (
     <div className="container mx-auto py-12 px-4 text-center">
       <Alert className="max-w-md mx-auto border-yellow-500 text-yellow-800 [&>svg]:text-yellow-800">
         <Lock className="h-5 w-5" />
         <AlertTitle className="font-headline text-yellow-900">This Memorial is Private</AlertTitle>
         <AlertDescription>
           Memorials on the free plan are only visible to the owner. Please log in as the owner to view this page, or ask them to upgrade their plan to make it public.
         </AlertDescription>
       </Alert>
       <Button asChild className="mt-8">
         <Link href={user ? "/admin" : "/login"}>{user ? "Go to Your Dashboard" : "Log In"}</Link>
       </Button>
     </div>
   );
  }


  // If access is granted, render the page
  const profilePhotoUrl = memorialData.photos && memorialData.photos.length > 0 ? memorialData.photos[0].url : undefined;
  const backLinkHref = isOwner ? '/admin' : '/';

  return (
    <div className="bg-background min-h-screen font-body">
      <MemorialPageHeader
        deceasedName={memorialData.deceasedName}
        birthDate={memorialData.birthDate}
        deathDate={memorialData.deathDate}
        lifeSummary={memorialData.lifeSummary}
        profilePhotoUrl={profilePhotoUrl}
        backLinkHref={backLinkHref}
      />
      <main className="container mx-auto py-8 px-4 md:px-6 lg:px-8 space-y-12">
        <BiographySection biography={memorialData.biography} />
        <PhotoGallerySection photos={memorialData.photos} />
        <TributesSection tributes={memorialData.tributes} />
        <StoriesSection stories={memorialData.stories} />
      </main>
      <footer className="py-8 text-center bg-primary text-primary-foreground/80">
        <p>&copy; {new Date().getFullYear()} HonouredLives. All rights reserved.</p>
        <p className="text-sm mt-1">Created with love and remembrance.</p>
        {/* {memorialData.userId && (
          <div className="text-xs mt-4 space-y-1">
            <p>Owner UID: {memorialData.userId}</p>
            {memorialData.ownerStatus && (
              <p>Owner Status: <span className="font-semibold">{memorialData.ownerStatus}</span></p>
            )}
          </div>
        )} */}
      </footer>
    </div>
  );
}

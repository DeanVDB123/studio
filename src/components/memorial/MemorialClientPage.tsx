
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { getMemorialById } from '@/lib/data';
import type { MemorialData } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Feather, Lock, Loader2, ShieldOff } from 'lucide-react';
import { logMemorialViewAction } from '@/lib/actions';
import { ClassicTemplate } from '@/components/memorial/templates/ClassicTemplate';
import { ModernTemplate } from '@/components/memorial/templates/ModernTemplate';
import { SkylineTemplate } from './templates/SkylineTemplate';


interface MemorialClientPageProps {
  memorialId: string;
}

export default function MemorialClientPage({ memorialId }: MemorialClientPageProps) {
  const { user, userStatus, loading: authLoading } = useAuth();
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
    // Log a view when the page has finished loading, has a valid memorialId, and the memorial is visible
    if (memorialId && !isLoading && memorialData && memorialData.visibility !== 'hidden') {
      logMemorialViewAction(memorialId);
    }
  }, [memorialId, isLoading, memorialData]);


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

  const viewerIsAdmin = userStatus === 'ADMIN';
  const viewerIsOwner = user && user.uid === memorialData.userId;
  const ownerIsAdmin = memorialData.ownerStatus === 'ADMIN';

  // First, check for admin deactivation. This overrides all other rules.
  // Only admins can see a 'hidden' memorial.
  if (memorialData.visibility === 'hidden' && !viewerIsAdmin) {
      return (
        <div className="container mx-auto py-12 px-4 text-center">
          <Alert variant="destructive" className="max-w-md mx-auto">
              <ShieldOff className="h-5 w-5" />
              <AlertTitle className="font-headline">Memorial Not Available</AlertTitle>
              <AlertDescription>
                  This memorial page has been deactivated by an administrator.
              </AlertDescription>
          </Alert>
          <Button asChild className="mt-8">
              <Link href="/">Return Home</Link>
          </Button>
        </div>
      );
  }
  
  // Check if the plan is expired
  const isExpired = () => {
    if (!memorialData.planExpiryDate || memorialData.planExpiryDate === 'ETERNAL') {
      return false; // No expiry date or it's eternal, so not expired.
    }
    try {
      // Compare current date with expiry date
      return new Date() > new Date(memorialData.planExpiryDate);
    } catch (e) {
      console.error("Invalid plan expiry date format:", memorialData.planExpiryDate);
      return true; // Treat invalid dates as expired for safety
    }
  };

  const planIsActiveAndPublic = 
    memorialData.plan && 
    memorialData.plan.toUpperCase() !== 'SPIRIT' && 
    !isExpired();

  // Access is granted if: viewer is admin, viewer is owner, owner is admin, or the plan is active and public.
  if (!viewerIsAdmin && !viewerIsOwner && !planIsActiveAndPublic && !ownerIsAdmin) {
    let title = "This Memorial is Private";
    let description = "This memorial is not currently available for public viewing. Please ask the owner to upgrade their plan to make it public.";

    if (isExpired()) {
        title = "This Memorial's Plan has Expired";
        description = "Access to this public memorial has expired. Please contact the owner for more information.";
    }

    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Alert className="max-w-md mx-auto border-yellow-500 text-yellow-800 [&>svg]:text-yellow-800">
          <Lock className="h-5 w-5" />
          <AlertTitle className="font-headline text-yellow-900">
              {title}
          </AlertTitle>
          <AlertDescription>
            {description}
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-8">
          <Link href={user ? "/memorials" : "/login"}>{user ? "Go to Your Dashboard" : "Log In"}</Link>
        </Button>
      </div>
    );
  }

  // If we reach here, access is granted. Render the correct template.
  const backLinkHref = viewerIsOwner || viewerIsAdmin ? '/memorials' : '/';
  const propsToPass = { memorialData, backLinkHref };

  switch (memorialData.templateId) {
      case 'modern':
          return <ModernTemplate {...propsToPass} />;
      case 'skyline':
          return <SkylineTemplate {...propsToPass} />;
      case 'classic':
      default:
          return <ClassicTemplate {...propsToPass} />;
  }
}

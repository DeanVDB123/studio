
"use client"; 

import { MemorialForm } from '@/components/admin/MemorialForm';
import { QRCodeDisplay } from '@/components/admin/QRCodeDisplay';
import { getMemorialById } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState, useCallback } from 'react';
import type { MemorialData } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PricingTable } from '@/components/shared/PricingTable';

interface EditMemorialPageProps {
  params: Promise<{ memorialId: string }>;
}

interface EditMemorialPageClientProps {
  memorialId: string;
}

function EditMemorialPageClient({ memorialId }: EditMemorialPageClientProps) {
  const [memorialData, setMemorialData] = useState<MemorialData | null | undefined>(undefined); // undefined for loading, null for not found
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [permalink, setPermalink] = useState('');

  // Unsaved changes state
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [submitAndLeave, setSubmitAndLeave] = useState<(() => void) | null>(null);

  const getFormSubmitHandler = useCallback((handler: () => void) => {
    setSubmitAndLeave(() => handler);
  }, []);
  
  const handleSaveAndLeave = () => {
    if (submitAndLeave) {
      submitAndLeave();
      if(nextPath) router.push(nextPath);
    }
    setShowUnsavedDialog(false);
  };
  
  const handleDiscardAndLeave = () => {
    setIsFormDirty(false); // Manually mark as not dirty
    if (nextPath) {
      router.push(nextPath);
    }
    setShowUnsavedDialog(false);
  };

  useEffect(() => {
    // This code runs only on the client-side, ensuring window.location.origin is available.
    if (typeof window !== 'undefined') {
        setPermalink(`${window.location.origin}/${memorialId}`);
    }
  }, [memorialId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (isFormDirty) {
            e.preventDefault(); // For most browsers.
            e.returnValue = ''; // For some older browsers.
            return 'You have unsaved changes. Are you sure you want to leave?'; // For some older browsers.
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
}, [isFormDirty]);


  useEffect(() => {
    async function fetchMemorial() {
      if (authLoading) return; // Wait for auth to load

      if (!user) {
        // This should be handled by AuthGuard, but as a fallback
        router.push('/login');
        return;
      }

      setIsLoading(true);
      try {
        console.log(`[EditPage] Fetching memorial with ID: ${memorialId}`);
        const data = await getMemorialById(memorialId);
        if (data) {
          console.log(`[EditPage] Memorial data fetched:`, data.deceasedName);
          setMemorialData(data);
        } else {
          console.warn(`[EditPage] Memorial not found for ID: ${memorialId}`);
          setMemorialData(null); // Not found
        }
      } catch (error) {
        console.error("[EditPage] Failed to fetch memorial data:", error);
        setMemorialData(null); // Error case
        toast({ title: "Error", description: "Failed to load memorial data.", variant: "destructive"});
      } finally {
        setIsLoading(false);
      }
    }
    fetchMemorial();
  }, [memorialId, user, authLoading, router, toast]);

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Memorial Editor...</p>
      </div>
    );
  }
  
  if (memorialData === null) { 
    let alertDescriptionText = "The memorial page you are looking for does not exist or may have been removed.";
     if (process.env.NODE_ENV === 'development') {
       alertDescriptionText += " This could be due to a server restart clearing in-memory data or an ID mismatch. For Firestore, ensure the document ID is correct or rules allow access.";
     }
    return (
      <>
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Error: Memorial Not Found</AlertTitle>
          <AlertDescription>
            {alertDescriptionText}
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex justify-center">
            <Button asChild>
                <Link href="/memorials">Return to Memorials</Link>
            </Button>
        </div>
      </>
    );
  }
  
  const isFreePlan = (memorialData?.plan || 'SPIRIT').toUpperCase() === 'SPIRIT';

  return (
    <>
      <Dialog>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-headline mb-8">Edit Memorial: {memorialData.deceasedName}</h1>
            <MemorialForm 
              initialData={memorialData} 
              memorialId={memorialId}
              onFormDirtyChange={setIsFormDirty}
              getFormSubmitHandler={getFormSubmitHandler}
            />
          </div>
          <div className="lg:col-span-1 space-y-6 lg:pt-20">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">QR Code</CardTitle>
                <CardDescription>
                  {isFreePlan
                    ? 'Upgrade to activate and share your QR code.' 
                    : 'Share this QR code for easy access.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {permalink && (
                  isFreePlan ? (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <DialogTrigger asChild>
                        <Button>Ascend to premium</Button>
                      </DialogTrigger>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <QRCodeDisplay url={permalink} />
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <DialogContent className="max-w-6xl p-0 bg-card">
          <DialogHeader className="p-6 pb-4 border-b bg-primary text-primary-foreground">
            <DialogTitle className="text-3xl font-headline text-center">Our Plans</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <PricingTable memorialId={memorialId} deceasedName={memorialData.deceasedName} />
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                <AlertDialogDescription>
                    You have unsaved changes. Would you like to save them before leaving?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)}>Stay on Page</AlertDialogCancel>
                <Button variant="outline" onClick={handleDiscardAndLeave}>
                    Discard & Leave
                </Button>
                <AlertDialogAction onClick={handleSaveAndLeave}>
                    Save & Leave
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


export default function EditMemorialPage({ params }: EditMemorialPageProps) {
  const { memorialId } = React.use(params);
  return <EditMemorialPageClient memorialId={memorialId} />;
}

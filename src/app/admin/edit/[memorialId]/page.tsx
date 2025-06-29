
"use client"; // Needs to be client component for auth checks and data fetching

import { MemorialForm } from '@/components/admin/MemorialForm';
import { QRCodeDisplay } from '@/components/admin/QRCodeDisplay';
import { getMemorialById } from '@/lib/data'; // Public fetch
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react'; // Removed Globe, Link2
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState, use } from 'react';
import type { MemorialData } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


interface EditMemorialPageProps {
  params: { // The type of 'params' prop remains the resolved shape
    memorialId: string;
  };
}

export default function EditMemorialPage({ params }: EditMemorialPageProps) {
  const { memorialId } = use(params);

  const [memorialData, setMemorialData] = useState<MemorialData | null | undefined>(undefined); // undefined for loading, null for not found
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();


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
                <Link href="/admin">Return to Memorials</Link>
            </Button>
        </div>
      </>
    );
  }
  
  const permalink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/memorial/${memorialId}`;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-headline mb-8">Edit Memorial: {memorialData.deceasedName}</h1>
        <MemorialForm initialData={memorialData} memorialId={memorialId} />
      </div>
      <div className="lg:col-span-1 space-y-6 lg:pt-20">
        {/* Permalink Card Removed */}
        <Card>
           <CardHeader>
            <CardTitle className="font-headline text-xl">QR Code</CardTitle>
             <CardDescription>Share this QR code for easy access.</CardDescription>
          </CardHeader>
          <CardContent>
            <QRCodeDisplay url={permalink} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


"use client"; 

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; 
import { PlusCircle, Edit3, ExternalLink, Loader2, Trash2, QrCode } from 'lucide-react'; 
import { getAllMemorialsForUser, deleteMemorial } from '@/lib/data'; 
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { format } from 'date-fns';
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
import { useToast } from '@/hooks/use-toast';

type UserMemorial = {
  id: string;
  deceasedName: string;
  birthDate: string;
  deathDate: string;
  lifeSummary: string;
  profilePhotoUrl?: string;
  viewCount?: number;
  lastVisited?: string;
};

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const { user, loading: authLoading, userStatus } = useAuth();
  const [memorials, setMemorials] = useState<UserMemorial[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter(); 
  const [pageBaseUrl, setPageBaseUrl] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [memorialToDelete, setMemorialToDelete] = useState<UserMemorial | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageBaseUrl(window.location.origin);
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      setPageBaseUrl(process.env.NEXT_PUBLIC_BASE_URL);
    } else {
      setPageBaseUrl('http://localhost:9002'); 
    }
  }, []);

  useEffect(() => {
    async function fetchMemorials() {
      if (user && !authLoading) {
        console.log(`[AdminDashboardPage] useEffect running for user ${user.uid}. Fetching memorials.`);
        setIsLoadingData(true);
        try {
          const userMemorialsData = await getAllMemorialsForUser(user.uid);
          console.log(`[AdminDashboardPage] Received memorials data from getAllMemorialsForUser:`, userMemorialsData);
          setMemorials(userMemorialsData);
        } catch (error) {
          console.error("[AdminDashboardPage] Failed to fetch memorials:", error);
          toast({ title: "Error", description: "Could not load your memorials.", variant: "destructive" });
        } finally {
          setIsLoadingData(false);
        }
      } else if (!authLoading) {
        console.log("[AdminDashboardPage] useEffect: No user or auth still loading. Clearing memorials.");
        setMemorials([]);
        setIsLoadingData(false);
      }
    }
    fetchMemorials();
  }, [user, authLoading, toast]); // Removed searchParams from dependency array

  const formatDateRange = (birthDateStr: string, deathDateStr: string) => {
    try {
      const birth = format(new Date(birthDateStr), 'dd MMM yyyy');
      const death = format(new Date(deathDateStr), 'dd MMM yyyy');
      return `${birth} – ${death}`;
    } catch (e) {
      return `${birthDateStr} – ${deathDateStr}`;
    }
  };

  const handleDeleteClick = (memorial: UserMemorial) => {
    setMemorialToDelete(memorial);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (memorialToDelete && user) {
      try {
        await deleteMemorial(memorialToDelete.id, user.uid);
        setMemorials(prevMemorials => prevMemorials.filter(m => m.id !== memorialToDelete.id));
        toast({ title: "Deleted", description: `Memorial for ${memorialToDelete.deceasedName} has been deleted.` });
      } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to delete memorial.", variant: "destructive" });
      }
    }
    setShowDeleteDialog(false);
    setMemorialToDelete(null);
  };

  if (authLoading || isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Memorials...</p>
      </div>
    );
  }
  
  if (!user) { 
    return (
      <div className="text-center py-12">
        <p>Please log in to view your dashboard.</p>
         <Button asChild className="mt-4">
            <Link href="/login">Log In</Link>
         </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Your Memorials</h1>
        <Button asChild>
          <Link href="/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Memorial
          </Link>
        </Button>
      </div>

      {console.log("[AdminDashboardPage] Rendering. Number of memorials in state:", memorials.length)}
      {memorials.length === 0 && !isLoadingData ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-2xl">No Memorials Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              Start by creating a new memorial page for a loved one.
            </p>
          </CardContent>
          <div className="flex justify-center pt-4"> 
             <Button asChild className="mt-4">
              <Link href="/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Memorial
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {memorials.map((memorial) => (
            <Card key={memorial.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-primary text-primary-foreground pb-4 pt-5 px-4 text-center flex flex-col items-center">
                {memorial.profilePhotoUrl && (
                  <div className="relative w-1/2 aspect-square mx-auto mb-4">
                    <Image
                      src={memorial.profilePhotoUrl}
                      alt={`Profile photo of ${memorial.deceasedName}`}
                      fill
                      className="object-cover rounded-lg filter grayscale"
                      data-ai-hint="profile person"
                    />
                  </div>
                )}
                <CardTitle className="font-headline text-xl leading-tight truncate w-full">
                  {memorial.deceasedName}
                </CardTitle>
                <p className="text-xs text-primary-foreground/80 font-body">
                  {formatDateRange(memorial.birthDate, memorial.deathDate)}
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-primary-foreground/80 font-body mt-2">
                  <QrCode className="h-4 w-4" />
                  <span>{memorial.viewCount || 0} views</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                <p className="text-sm text-muted-foreground italic">
                  {memorial.lifeSummary}
                </p>
              </CardContent>
              <CardFooter className="flex justify-around items-center p-3 border-t"> 
                <Button variant="ghost" size="icon" asChild title={`Edit ${memorial.deceasedName}`}>
                  <Link href={`/edit/${memorial.id}`}>
                    <Edit3 className="h-5 w-5" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild title={`View ${memorial.deceasedName}`}>
                  <Link href={`/memorial/${memorial.id}`} target="_blank">
                    <ExternalLink className="h-5 w-5" /> 
                    <span className="sr-only">View</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" title={`Delete ${memorial.deceasedName}`} onClick={() => handleDeleteClick(memorial)}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the memorial for {memorialToDelete?.deceasedName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {userStatus === 'FREE' && (
        <div className="flex justify-center pt-6 mt-6 border-t">
          <Button asChild size="lg">
              <Link href="/#pricing-section">
                  Upgrade Now to Share!
              </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

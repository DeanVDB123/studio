
"use client"; 

import Link from 'next/link';
import Image from 'next/image'; // Import next/image
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { QRCodeDisplay } from '@/components/admin/QRCodeDisplay';
import { PlusCircle, Edit3, ExternalLink, Loader2 } from 'lucide-react'; 
import { getAllMemorialsForUser } from '@/lib/data'; 
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { format } from 'date-fns';

// Define a type for the memorials displayed on this page
type UserMemorial = {
  id: string;
  deceasedName: string;
  birthDate: string;
  deathDate: string;
  profilePhotoUrl?: string; // Added for profile photo
};

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [memorials, setMemorials] = useState<UserMemorial[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter(); 
  const [pageBaseUrl, setPageBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageBaseUrl(window.location.origin);
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      setPageBaseUrl(process.env.NEXT_PUBLIC_BASE_URL);
    } else {
      setPageBaseUrl('http://localhost:9002'); // Fallback
    }
  }, []);

  useEffect(() => {
    async function fetchMemorials() {
      if (user && !authLoading) {
        setIsLoadingData(true);
        try {
          const userMemorials = await getAllMemorialsForUser(user.uid);
          setMemorials(userMemorials);
        } catch (error) {
          console.error("Failed to fetch memorials:", error);
        } finally {
          setIsLoadingData(false);
        }
      } else if (!authLoading) {
        setMemorials([]);
        setIsLoadingData(false);
      }
    }
    fetchMemorials();
  }, [user, authLoading]);

  const formatDateRange = (birthDateStr: string, deathDateStr: string) => {
    try {
      const birth = format(new Date(birthDateStr), 'dd MMM yyyy');
      const death = format(new Date(deathDateStr), 'dd MMM yyyy');
      return `${birth} – ${death}`;
    } catch (e) {
      // Fallback for invalid dates
      return `${birthDateStr} – ${deathDateStr}`;
    }
  };


  if (authLoading || isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Dashboard...</p>
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
        <h1 className="text-3xl font-headline">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Memorial
          </Link>
        </Button>
      </div>

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
              <Link href="/admin/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Memorial
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {memorials.map((memorial) => (
            <Card key={memorial.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4 pt-5 text-center flex flex-col items-center">
                <div className="w-20 h-24 mb-3 rounded-full overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
                  <Image
                    src={memorial.profilePhotoUrl || `https://placehold.co/80x96.png`}
                    alt={`Profile photo of ${memorial.deceasedName}`}
                    width={80}
                    height={96}
                    className="object-cover w-full h-full filter grayscale"
                    data-ai-hint="profile person"
                  />
                </div>
                <CardTitle className="font-headline text-xl leading-tight truncate">
                  {memorial.deceasedName}
                </CardTitle>
                <p className="text-xs text-muted-foreground font-body">
                  {formatDateRange(memorial.birthDate, memorial.deathDate)}
                </p>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center pt-2 pb-4">
                <QRCodeDisplay url={`${pageBaseUrl}/memorial/${memorial.id}`} size={128} />
              </CardContent>
              <div className="flex justify-around items-center p-3 border-t"> 
                <Button variant="ghost" size="icon" asChild title={`Edit ${memorial.deceasedName}`}>
                  <Link href={`/admin/edit/${memorial.id}`}>
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
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

    

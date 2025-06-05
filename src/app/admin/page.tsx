
"use client"; // Make this a client component to use useAuth and fetch user-specific data

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit3, ExternalLink, Loader2 } from 'lucide-react';
import { getAllMemorialsForUser } from '@/lib/data'; // Updated function name
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

// Define a type for the memorials displayed on this page
type UserMemorial = {
  id: string;
  deceasedName: string;
};

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [memorials, setMemorials] = useState<UserMemorial[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    // Refresh the route's data. This helps in ensuring that after an action (like creating a memorial)
    // and redirecting back to this page, the data fetched is the latest.
    router.refresh();

    async function fetchMemorials() {
      if (user && !authLoading) {
        setIsLoadingData(true);
        try {
          const userMemorials = await getAllMemorialsForUser(user.uid);
          setMemorials(userMemorials);
        } catch (error) {
          console.error("Failed to fetch memorials:", error);
          // Optionally, set an error state and display it
        } finally {
          setIsLoadingData(false);
        }
      } else if (!authLoading) {
        // No user, or auth still loading
        setMemorials([]);
        setIsLoadingData(false);
      }
    }
    fetchMemorials();
  }, [user, authLoading, router]); // Add router to the dependency array

  if (authLoading || isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Dashboard...</p>
      </div>
    );
  }
  
  if (!user) {
     // This case should ideally be handled by AuthGuard redirecting to /login
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

      {memorials.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-2xl">No Memorials Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              Start by creating a new memorial page for a loved one.
            </CardDescription>
          </CardContent>
          <CardFooter className="justify-center">
             <Button asChild className="mt-4">
              <Link href="/admin/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Memorial
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {memorials.map((memorial) => (
            <Card key={memorial.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-xl">{memorial.deceasedName}</CardTitle>
                <CardDescription>ID: {memorial.id}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Manage this memorial page.</p>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/edit/${memorial.id}`}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/memorial/${memorial.id}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Page
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

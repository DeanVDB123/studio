
"use client"; // Make this a client component to use useAuth and fetch user-specific data

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QRCodeDisplay } from '@/components/admin/QRCodeDisplay';
import { PlusCircle, Edit3, ExternalLink, Loader2, QrCode } from 'lucide-react';
import { getAllMemorialsForUser } from '@/lib/data'; 
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 

// Define a type for the memorials displayed on this page
type UserMemorial = {
  id: string;
  deceasedName: string;
};

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [memorials, setMemorials] = useState<UserMemorial[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter(); 
  const [selectedMemorialForQr, setSelectedMemorialForQr] = useState<UserMemorial | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
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

  const handleQrCodeClick = (memorial: UserMemorial) => {
    setSelectedMemorialForQr(memorial);
    setIsQrModalOpen(true);
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
            <Card key={memorial.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-headline text-xl leading-tight truncate flex-grow_">
                    {memorial.deceasedName}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleQrCodeClick(memorial)} 
                    aria-label="Show QR Code"
                    className="flex-shrink-0 h-7 w-7"
                  >
                    <QrCode className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </Button>
                </div>
                <CardDescription className="text-xs text-muted-foreground break-all">ID: {memorial.id}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-2">
                <p className="text-sm text-muted-foreground">Manage this memorial page.</p>
              </CardContent>
              <CardFooter className="flex justify-between gap-2 pt-4">
                <Button variant="default" size="sm" asChild className="flex-1">
                  <Link href={`/admin/edit/${memorial.id}`}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/memorial/${memorial.id}`} target="_blank">
                    View <ExternalLink className="ml-2 h-4 w-4" /> 
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedMemorialForQr && (
        <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>QR Code for {selectedMemorialForQr.deceasedName}</DialogTitle>
            </DialogHeader>
            <div className="py-4 flex justify-center">
              <QRCodeDisplay url={`${pageBaseUrl}/memorial/${selectedMemorialForQr.id}`} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

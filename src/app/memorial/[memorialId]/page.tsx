
import { getMemorialById } from '@/lib/data';
import { MemorialPageHeader } from '@/components/memorial/MemorialPageHeader';
import { BiographySection } from '@/components/memorial/BiographySection';
import { PhotoGallerySection } from '@/components/memorial/PhotoGallerySection';
import { TributesSection } from '@/components/memorial/TributesSection';
import { StoriesSection } from '@/components/memorial/StoriesSection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Feather } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MemorialPageProps {
  params: {
    memorialId: string;
  };
}

export async function generateMetadata({ params }: MemorialPageProps) {
  const memorial = await getMemorialById(params.memorialId);
  if (!memorial) {
    return { title: 'Memorial Not Found | HonouredLives' };
  }
  return {
    title: `${memorial.deceasedName} | HonouredLives`,
    description: `A memorial page for ${memorial.deceasedName}. ${memorial.lifeSummary || ''}`,
  };
}

export default async function MemorialPage({ params }: MemorialPageProps) {
  const memorial = await getMemorialById(params.memorialId);

  if (!memorial) {
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

  const profilePhotoUrl = memorial.photos && memorial.photos.length > 0 ? memorial.photos[0].url : undefined;

  return (
    <div className="bg-background min-h-screen font-body">
      <MemorialPageHeader
        deceasedName={memorial.deceasedName}
        birthDate={memorial.birthDate}
        deathDate={memorial.deathDate}
        lifeSummary={memorial.lifeSummary}
        profilePhotoUrl={profilePhotoUrl} // Pass the profile photo URL
      />
      <main className="container mx-auto py-8 px-4 md:px-6 lg:px-8 space-y-12">
        <BiographySection biography={memorial.biography} />
        <PhotoGallerySection photos={memorial.photos} />
        <TributesSection tributes={memorial.tributes} />
        <StoriesSection stories={memorial.stories} />
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} HonouredLives. All rights reserved.</p>
        <p className="text-sm">Created with love and remembrance.</p>
      </footer>
    </div>
  );
}

export const dynamic = 'force-dynamic'; // Ensure data is fresh for public pages too for demo

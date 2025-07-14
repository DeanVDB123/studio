
'use client';

import { MemorialPageHeader } from '@/components/memorial/MemorialPageHeader';
import { BiographySection } from '@/components/memorial/BiographySection';
import { PhotoGallerySection } from '@/components/memorial/PhotoGallerySection';
import { TributesSection } from '@/components/memorial/TributesSection';
import { StoriesSection } from '@/components/memorial/StoriesSection';
import type { MemorialData } from '@/lib/types';

interface TemplateProps {
  memorialData: MemorialData;
  backLinkHref: string;
}

export function ClassicTemplate({ memorialData, backLinkHref }: TemplateProps) {
  const profilePhotoUrl = memorialData.photos && memorialData.photos.length > 0 ? memorialData.photos[0].url : undefined;

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
      <main className="container mx-auto py-8 px-4 md:px-6 lg:px-8 space-y-16">
        <BiographySection biography={memorialData.biography} template="classic" />
        <PhotoGallerySection photos={memorialData.photos} template="classic" />
        <TributesSection tributes={memorialData.tributes} template="classic" />
        <StoriesSection stories={memorialData.stories} template="classic" />
      </main>
      <footer className="py-8 text-center bg-primary text-primary-foreground/80">
        <p>&copy; {new Date().getFullYear()} HonouredLives. All rights reserved.</p>
        <p className="text-sm mt-1">Created with love and remembrance.</p>
      </footer>
    </div>
  );
}

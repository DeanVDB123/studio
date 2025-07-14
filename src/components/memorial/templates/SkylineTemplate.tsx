
'use client';

import { SkylineHeader } from '@/components/memorial/SkylineHeader';
import type { MemorialData } from '@/lib/types';
import Image from 'next/image';

interface TemplateProps {
  memorialData: MemorialData;
  backLinkHref: string;
}

export function SkylineTemplate({ memorialData, backLinkHref }: TemplateProps) {
  const profilePhotoUrl = memorialData.photos && memorialData.photos.length > 0 ? memorialData.photos[0].url : undefined;
  
  // Use a dramatic sky image as the background for the entire page
  const backgroundImageUrl = '/sky-dramatic.jpg';

  return (
    <div className="bg-background min-h-screen font-body relative">
      <div className="fixed inset-0 z-0">
        <Image
          src={backgroundImageUrl}
          alt="Dramatic sky background"
          layout="fill"
          objectFit="cover"
          className="filter brightness-75"
          data-ai-hint="dramatic sky"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10">
        <SkylineHeader
          deceasedName={memorialData.deceasedName}
          birthDate={memorialData.birthDate}
          deathDate={memorialData.deathDate}
          lifeSummary={memorialData.lifeSummary}
          profilePhotoUrl={profilePhotoUrl}
          backLinkHref={backLinkHref}
        />
        <main className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-card shadow-2xl rounded-lg p-6 md:p-10 space-y-12">
            
            {/* Biography Section */}
            <section className="animate-in fade-in duration-500">
                <h2 className="font-headline text-3xl text-primary mb-4 pb-2 border-b border-primary/20">Life Story</h2>
                <div className="prose prose-lg max-w-none font-body text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: memorialData.biography.replace(/\n/g, '<br />') }} />
            </section>
            
            {/* Photo Gallery with Masonry effect */}
            {memorialData.photos && memorialData.photos.length > 0 && (
                <section className="animate-in fade-in duration-500 delay-100">
                    <h2 className="font-headline text-3xl text-primary mb-6 pb-2 border-b border-primary/20">Photo Memories</h2>
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {memorialData.photos.map((photo, index) => (
                            <div key={photo.id || index} className="group relative break-inside-avoid overflow-hidden rounded-lg shadow-md">
                                <Image
                                    src={photo.url}
                                    alt={photo.caption || `Memory ${index + 1}`}
                                    width={500}
                                    height={500}
                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    data-ai-hint="person memory"
                                />
                                {photo.caption && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {photo.caption}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Tributes & Stories Section */}
            {(memorialData.tributes.length > 0 || memorialData.stories.length > 0) && (
                <section className="animate-in fade-in duration-500 delay-200">
                    <h2 className="font-headline text-3xl text-primary mb-6 pb-2 border-b border-primary/20">Tributes & Stories</h2>
                    <div className="space-y-6">
                        {memorialData.tributes.map((tribute, index) => (
                            <blockquote key={`tribute-${index}`} className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg shadow-sm">
                                <p className="italic text-foreground/80 font-body" dangerouslySetInnerHTML={{ __html: `&ldquo;${tribute.replace(/\n/g, '<br />')}&rdquo;` }} />
                            </blockquote>
                        ))}
                        {memorialData.stories.map((story, index) => (
                            <div key={`story-${index}`} className="p-4 bg-muted/50 border border-border rounded-lg shadow-sm">
                                <p className="text-foreground/90 font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: story.replace(/\n/g, '<br />') }} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

          </div>
        </main>
        <footer className="py-8 text-center text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} HonouredLives. All rights reserved.</p>
          <p className="text-sm mt-1">Created with love and remembrance.</p>
        </footer>
      </div>
    </div>
  );
}


'use client';

import { RusticHeader } from '@/components/memorial/RusticHeader';
import type { MemorialData } from '@/lib/types';
import Image from 'next/image';
import { Camera, Heart, MessageSquareText } from 'lucide-react';

interface TemplateProps {
  memorialData: MemorialData;
  backLinkHref: string;
}

export function RusticTemplate({ memorialData, backLinkHref }: TemplateProps) {
  const profilePhotoUrl = memorialData.photos && memorialData.photos.length > 0 ? memorialData.photos[0].url : undefined;

  return (
    <div className="bg-background min-h-screen font-body">
      <RusticHeader
        deceasedName={memorialData.deceasedName}
        birthDate={memorialData.birthDate}
        deathDate={memorialData.deathDate}
        lifeSummary={memorialData.lifeSummary}
        profilePhotoUrl={profilePhotoUrl}
        backLinkHref={backLinkHref}
        biography={memorialData.biography}
      />
      
      <main className="container mx-auto py-8 px-4 md:px-6 lg:px-8 space-y-12">
        {/* Photo Gallery */}
        {memorialData.photos && memorialData.photos.length > 0 && (
            <section className="animate-in fade-in duration-500 delay-100">
                <div className="flex items-center mb-6 pb-2 border-b border-primary/20">
                    <Camera className="mr-3 h-7 w-7 text-primary" />
                    <h2 className="font-headline text-3xl text-primary">Photo Memories</h2>
                </div>
                <div className="columns-2 md:columns-3 lg:columns-4 gap-0">
                    {memorialData.photos.map((photo, index) => (
                        <div key={photo.id || index} className="group relative break-inside-avoid overflow-hidden shadow-md mb-0">
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

        {/* Tributes Section */}
        {memorialData.tributes && memorialData.tributes.length > 0 && (
            <section className="animate-in fade-in duration-500 delay-200">
                <div className="flex items-center mb-6 pb-2 border-b border-primary/20">
                    <Heart className="mr-3 h-7 w-7 text-primary" />
                    <h2 className="font-headline text-3xl text-primary">Loving Tributes</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {memorialData.tributes.map((tribute, index) => (
                        <blockquote key={index} className="speech-bubble">
                             <p className="italic text-foreground/80 font-body leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: `&ldquo;${tribute.replace(/\n/g, '<br />')}&rdquo;` }} />
                        </blockquote>
                    ))}
                </div>
            </section>
        )}

        {/* Stories Section */}
        {memorialData.stories && memorialData.stories.length > 0 && (
            <section className="animate-in fade-in duration-500 delay-300">
                <div className="flex items-center mb-6 pb-2 border-b border-primary/20">
                  <MessageSquareText className="mr-3 h-7 w-7 text-primary" />
                  <h2 className="font-headline text-3xl text-primary">Cherished Stories</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {memorialData.stories.map((story, index) => (
                    <div key={index} className="p-6 bg-muted/50 border border-border rounded-lg shadow-sm">
                      <p className="text-foreground/90 font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: story.replace(/\n/g, '<br />') }} />
                    </div>
                  ))}
                </div>
            </section>
        )}
      </main>

      <footer className="py-8 text-center bg-primary text-primary-foreground/80 mt-12">
        <p>&copy; {new Date().getFullYear()} HonouredLives. All rights reserved.</p>
        <p className="text-sm mt-1">Created with love and remembrance.</p>
      </footer>
    </div>
  );
}

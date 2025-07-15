
'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

interface RusticHeaderProps {
  deceasedName: string;
  birthDate: string;
  deathDate: string;
  lifeSummary?: string;
  profilePhotoUrl?: string;
  backLinkHref: string;
  biography: string;
}

export function RusticHeader({ deceasedName, birthDate, deathDate, lifeSummary, profilePhotoUrl, backLinkHref, biography }: RusticHeaderProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return format(date, 'dd MMMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <header className="bg-primary text-primary-foreground border-b-2 border-accent">
      <div className="absolute top-4 left-4 z-10">
        <Link href={backLinkHref}>
          <Image
            src="/hlb.png"
            alt="HonouredLives Logo"
            width={80}
            height={45}
            className="h-auto"
            data-ai-hint="logo company"
          />
        </Link>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left Column */}
          <div className="md:col-span-1 flex flex-col items-center text-center animate-in fade-in duration-500">
            {profilePhotoUrl && (
              <div className="relative w-48 h-48 rounded-md overflow-hidden shadow-lg mb-4 border-2 border-primary-foreground/20">
                <Image
                  src={profilePhotoUrl}
                  alt={`Profile photo of ${deceasedName}`}
                  layout="fill"
                  className="object-cover filter grayscale"
                  data-ai-hint="profile person"
                />
              </div>
            )}
            <h1 className="text-4xl font-headline text-primary-foreground">{deceasedName}</h1>
            <p className="text-lg text-primary-foreground/80 mt-1">
              {formatDate(birthDate)} &ndash; {formatDate(deathDate)}
            </p>
            {lifeSummary && (
              <p className="mt-4 text-md text-primary-foreground/90 italic">
                {lifeSummary}
              </p>
            )}
          </div>

          {/* Right Column (Biography) */}
          <div className="md:col-span-2 animate-in fade-in-up duration-500 delay-100">
            <h2 className="font-headline text-3xl text-primary-foreground mb-4 pb-2 border-b border-primary-foreground/20">Biography</h2>
            <div 
              className="prose prose-lg max-w-none font-body text-primary-foreground/90 leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: biography.replace(/\n/g, '<br />') }} 
            />
          </div>
        </div>
      </div>
    </header>
  );
}

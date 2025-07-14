
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SkylineHeaderProps {
  deceasedName: string;
  birthDate: string;
  deathDate: string;
  lifeSummary?: string;
  profilePhotoUrl?: string;
  backLinkHref: string;
}

export function SkylineHeader({ deceasedName, birthDate, deathDate, lifeSummary, profilePhotoUrl, backLinkHref }: SkylineHeaderProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return format(date, 'dd MMMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <header className="relative flex flex-col items-center justify-center text-center text-white min-h-[60vh] md:min-h-[70vh] py-12 px-4">
      <div className="absolute top-4 left-4 z-20">
        <Link href={backLinkHref}>
          <Image
            src="/hlb.png"
            alt="HonouredLives Logo"
            width={100}
            height={56}
            className="h-auto"
            data-ai-hint="logo company"
          />
        </Link>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {profilePhotoUrl && (
          <div className="mb-6">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white/80">
              <Image
                src={profilePhotoUrl}
                alt={`Profile photo of ${deceasedName}`}
                width={192}
                height={192}
                className="object-cover w-full h-full filter grayscale"
                data-ai-hint="profile person"
              />
            </div>
          </div>
        )}

        <h1 className={cn(
            "text-5xl md:text-7xl font-headline text-white",
            "text-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        )}>
            {deceasedName}
        </h1>

        <p className="text-xl md:text-2xl text-white/90 font-light mt-4 text-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
          {formatDate(birthDate)} &ndash; {formatDate(deathDate)}
        </p>

        {lifeSummary && (
          <p className="mt-6 text-lg md:text-xl font-body text-white/90 italic max-w-2xl mx-auto text-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            {lifeSummary}
          </p>
        )}
      </div>
    </header>
  );
}


import { AppLogo } from '@/components/shared/AppLogo';
import { format } from 'date-fns';

interface MemorialPageHeaderProps {
  deceasedName: string;
  birthDate: string;
  deathDate: string;
}

export function MemorialPageHeader({ deceasedName, birthDate, deathDate }: MemorialPageHeaderProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString; // fallback if date is invalid
    }
  };

  return (
    <header className="py-12 bg-gradient-to-b from-primary/20 to-background text-center border-b border-primary/30 shadow-sm">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-headline text-primary-foreground mb-2">{deceasedName}</h1>
        <p className="text-xl text-foreground/80 font-body">
          {formatDate(birthDate)} &ndash; {formatDate(deathDate)}
        </p>
        <p className="mt-4 text-2xl font-headline text-accent-foreground italic">Forever in our hearts</p>
      </div>
    </header>
  );
}

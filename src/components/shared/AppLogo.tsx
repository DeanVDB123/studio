
import Link from 'next/link';

interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className }: AppLogoProps) {
  return (
    <Link href="/" className={`font-headline text-2xl font-bold text-primary ${className}`}>
      <img src="/hl.png" alt="HonouredLives Logo" className="h-10 w-auto"></img>
    </Link>
  );
}

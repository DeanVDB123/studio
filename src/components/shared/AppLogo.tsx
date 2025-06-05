
import Link from 'next/link';

interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className }: AppLogoProps) {
  return (
    <Link href="/admin" className={`font-headline text-2xl font-bold text-primary ${className}`}>
      HonoringLives
    </Link>
  );
}

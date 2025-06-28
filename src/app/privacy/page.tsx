
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PrivacyContent } from '@/components/auth/PrivacyContent';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-logo-background text-white py-5 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <Link href="/signup">
            <Image
              src="/hl.png"
              alt="HonouredLives Logo"
              width={142}
              height={80}
              className="h-20 w-auto"
              data-ai-hint="logo company"
              priority
            />
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-center">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <PrivacyContent />
            <div className="text-center pt-4 border-t mt-8">
              <Button asChild>
                <Link href="/signup">Return to sing up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-logo-background text-white/80 py-8 text-center">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} HonouredLives. All rights reserved. Crafted with care to preserve legacy.</p>
        </div>
      </footer>
    </div>
  );
}

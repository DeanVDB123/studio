
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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
          <CardContent className="space-y-6 text-foreground/90">
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="space-y-2">
                <h2 className="font-headline text-xl">1. Information We Collect</h2>
                <p>We collect information that you provide directly to us when you create an account, create or share a memorial, or communicate with us. This may include personal information such as your name, email address, and any content you upload (photos, stories, tributes).</p>
                <p>We also collect technical information automatically when you use our services, such as your IP address, browser type, and usage details.</p>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-xl">2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Provide, maintain, and improve our services.</li>
                    <li>Personalize your experience.</li>
                    <li>Communicate with you about your account and our services.</li>
                    <li>Protect the security and integrity of our platform.</li>
                    <li>Comply with legal obligations.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-xl">3. Sharing Your Information</h2>
                <p>We do not sell your personal information. We may share information in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>With your consent or at your direction (e.g., when you share a memorial page).</li>
                    <li>With third-party vendors and service providers who need access to such information to carry out work on our behalf.</li>
                    <li>If required by law or to respond to legal process.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-xl">4. Data Security</h2>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction.</p>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-xl">5. Your Choices</h2>
                <p>You may update, correct or delete information about you at any time by logging into your account. If you wish to delete your account, please contact us, but note that we may retain certain information as required by law or for legitimate business purposes.</p>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-xl">6. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us.</p>
            </div>

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

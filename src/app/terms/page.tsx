
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-logo-background text-white py-5 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <Link href="/">
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
            <CardTitle className="text-3xl font-headline text-center">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90">
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="space-y-2">
                <h2 className="font-headline text-xl">1. Introduction</h2>
                <p>Welcome to HonouredLives! These terms and conditions outline the rules and regulations for the use of HonouredLives's Website. By accessing this website we assume you accept these terms and conditions. Do not continue to use HonouredLives if you do not agree to take all of the terms and conditions stated on this page.</p>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-xl">2. Intellectual Property Rights</h2>
                <p>Other than the content you own, under these Terms, HonouredLives and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-xl">3. User Content</h2>
                <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant HonouredLives a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media. Your Content must be your own and must not be invading any third-party’s rights. HonouredLives reserves the right to remove any of Your Content from this Website at any time without notice.</p>
            </div>
            
            <div className="space-y-2">
                <h2 className="font-headline text-xl">4. Restrictions</h2>
                <p>You are specifically restricted from all of the following:</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>publishing any Website material in any other media;</li>
                    <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                    <li>publicly performing and/or showing any Website material;</li>
                    <li>using this Website in any way that is or may be damaging to this Website;</li>
                    <li>using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-xl">5. No warranties</h2>
                <p>This Website is provided “as is,” with all faults, and HonouredLives express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>
            </div>

            <div className="space-y-2">
                <h2 className="font-headline text-xl">6. Governing Law & Jurisdiction</h2>
                <p>These Terms will be governed by and interpreted in accordance with the laws of the relevant jurisdiction, and you submit to the non-exclusive jurisdiction of the state and federal courts located in that jurisdiction for the resolution of any disputes.</p>
            </div>
            
            <div className="text-center pt-4 border-t mt-8">
              <Button asChild>
                <Link href="/signup">Return to sign up</Link>
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

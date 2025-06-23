
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'HonouredLives - Welcome',
  description: 'Remember, Celebrate, and Honor A Life. Create a beautiful and lasting online memorial for your loved ones.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-logo-background text-white py-5 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex-shrink-0 mb-4 sm:mb-0">
            <Image
              src="/hl.png"
              alt="HonouredLives Logo"
              width={142}
              height={80}
              className="h-20 w-auto"
              data-ai-hint="logo company"
              priority
            />
          </div>
          <nav>
            <ul className="flex space-x-4 sm:space-x-6 text-sm">
              <li><Link href="#about-section" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#steps-section" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="#why-choose-section" className="hover:text-primary transition-colors">Why Us</Link></li>
              <li><Link href="#stories-section" className="hover:text-primary transition-colors">Stories</Link></li>
              <li><Link href="/login" className="hover:text-success transition-colors">Get Started</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/20 to-background py-16 sm:py-24 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-8">
              <Image
                src="/handsholding.jpg"
                alt="A serene and thoughtful image representing remembrance"
                width={800}
                height={300}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
                data-ai-hint="serene landscape"
                priority
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-headline text-primary-foreground mb-6">
              HonouredLives
            </h1>
            <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-xl border border-border">
              <p className="text-lg text-card-foreground mb-4">
                Commemorate the journey, preserve the legacy, and share the story of those who shaped your world.
              </p>
              <p className="text-md text-card-foreground/90">
                Scan the QR code at your loved one’s resting place to revisit their story, reflect on cherished memories, and keep their legacy close—wherever you are. Share their tribute with others, spark conversations, and ensure that their memory continues to inspire generations to come.
              </p>
            </div>
            <Button asChild size="lg" className="mt-8">
              <Link href="#steps-section">Learn How</Link>
            </Button>
          </div>
        </section>

        {/* About HonouredLives Section */}
        <section id="about-section" className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-card p-8 rounded-lg shadow-md border border-border">
              <h2 className="text-3xl font-headline text-card-foreground mb-4">About HonouredLives</h2>
              <p className="text-lg text-card-foreground/90">
                HonouredLives is dedicated to helping families preserve memories and celebrate legacies through innovative digital tributes.
                Our platform offers an easy, heartfelt way to keep stories alive and share them with future generations.
              </p>
            </div>
          </div>
        </section>

        {/* Create a Memorial in 3 Simple Steps Section */}
        <section id="steps-section" className="py-12 sm:py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-headline text-foreground mb-2">Create a Memorial in 3 Simple Steps</h2>
              <p className="text-lg text-muted-foreground">An easy way to honour and preserve a legacy.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Step 1</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>Sign in and create a profile to begin, then create a new memorial for your loved one.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Step 2</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>Enter their details and upload photos, memories, and meaningful stories.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Step 3</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>Share their memorial page via the permalink or QR code and return anytime to reflect and remember.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose HonouredLives Section */}
        <section id="why-choose-section" className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-headline text-foreground mb-2">Why Choose HonouredLives</h2>
              <p className="text-lg text-muted-foreground">Experience a meaningful way to celebrate and remember.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Personalized Tributes</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>Create unique profiles that reflect the life and legacy of your loved ones.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Easy Sharing</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>Share memories easily through QR codes placed at resting places or online.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Community Support</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>Connect with others who share your commitment to honoring heritage.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tell Their Story Section */}
        <section id="stories-section" className="py-12 sm:py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-headline text-foreground mb-2">Tell Their Story</h2>
              <p className="text-lg text-muted-foreground">A timeless way to honor and remember</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="flex flex-col">
                <Image
                  src="/teacher.webp"
                  alt="Illustrative image for Emily Grace Taylor's story"
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover rounded-t-lg"
                  data-ai-hint="teacher classroom"
                />
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Emily Grace Taylor – Beloved Teacher</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>A beloved teacher whose passion for learning lit up every classroom. Her compassion and warmth continue to inspire generations.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <Image
                  src="/oldman.avif"
                  alt="Illustrative image for James Okoro's story"
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover rounded-t-lg"
                  data-ai-hint="community volunteer"
                />
                <CardHeader>
                  <CardTitle className="font-headline text-lg">James "Jimmy" Okoro – Community Hero</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>A gentle soul and community hero, Jimmy touched lives with his selflessness and tireless dedication to others.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <Image
                  src="/motherdaughter.webp"
                  alt="Illustrative image for Nokuthula Maseko's story"
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover rounded-t-lg"
                  data-ai-hint="storyteller elder"
                />
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Nokuthula Maseko – Resilient Storyteller</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>A mother, storyteller, and beacon of resilience—her words and wisdom live on through the lives she touched in her village and beyond.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Join Us Today Section */}
        <section className="py-16 sm:py-20 text-center bg-gradient-to-t from-primary/20 to-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline text-primary-foreground mb-3">Join Us Today</h2>
            <p className="text-lg text-foreground/80 mb-8 max-w-xl mx-auto">
              Be part of a heartfelt movement to preserve memories. Create a lasting digital tribute.
            </p>
            <Button asChild size="lg" variant="default">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card text-card-foreground/80 py-8 text-center">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} HonouredLives. All rights reserved. Crafted with care to preserve legacy.</p>
        </div>
      </footer>
    </div>
  );
}

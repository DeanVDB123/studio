
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StoryCard } from '@/components/shared/StoryCard';
import { PricingTable } from '@/components/shared/PricingTable';
import { UserPlus, FilePenLine, Share2, Sparkles, QrCode, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HonouredLives',
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
              <li><Link href="#about-section" className="hover:text-secondary transition-colors">About</Link></li>
              <li><Link href="#steps-section" className="hover:text-secondary transition-colors">How It Works</Link></li>
              <li><Link href="#why-choose-section" className="hover:text-secondary transition-colors">Why Us</Link></li>
              <li><Link href="#stories-section" className="hover:text-secondary transition-colors">Stories</Link></li>
              <li><Link href="#pricing-section" className="hover:text-secondary transition-colors">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-secondary transition-colors">Try it</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 w-full">
          {/* Text Content Block */}
          <div className="md:col-span-1 bg-background text-foreground flex items-center justify-center p-8 sm:p-12 lg:p-16 order-2 md:order-1">
            <div className="max-w-md text-left">
              <h2 className="text-4xl font-headline text-primary mb-4">Our Goal</h2>
              <p className="text-lg text-card-foreground mb-4">
                Commemorate the journey, preserve the legacy, and share the story of those who shaped your world.
              </p>
              <p className="text-md text-muted-foreground">
                Scan the QR code at your loved one’s resting place to revisit their story, reflect on cherished memories, and keep their legacy close—wherever you are. Share their tribute with others, spark conversations, and ensure that their memory continues to inspire generations to come.
              </p>
            </div>
          </div>
          {/* Image Block */}
          <div className="md:col-span-2 relative h-96 md:h-auto order-1 md:order-2">
            <Image
              src="/handsholding.jpg"
              alt="A serene and thoughtful image representing remembrance"
              layout="fill"
              className="object-cover"
              data-ai-hint="serene landscape"
              priority
            />
          </div>
        </section>

        {/* About HonouredLives Section */}
        <section id="about-section" className="bg-card py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-headline text-foreground mb-4">About HonouredLives</h2>
              <p className="text-lg text-muted-foreground">
                HonouredLives is a compassionate digital platform devoted to helping people preserve cherished memories and celebrate the legacies of their loved ones. We believe every life deserves to be remembered with dignity and meaning. Through innovative memorial pages, multimedia storytelling, and user-friendly tools, we make it simple to create heartfelt tributes that endure. Whether you're sharing a life story, photos, messages, or milestones, HonouredLives ensures these precious memories are kept alive—easily accessible for generations to come. Our mission is to honour the past, support the present, and inspire remembrance for the future.
              </p>
            </div>
          </div>
        </section>

        {/* Create a Memorial in 3 Simple Steps Section */}
        <section id="steps-section" className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline text-foreground mb-2">Create a Memorial in 3 Simple Steps</h2>
              <p className="text-lg text-muted-foreground">An easy way to honour and preserve a loved one.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <Card className="flex flex-col items-center p-6 bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                 <CardHeader className="p-0 mb-4">
                   <div className="bg-primary/10 p-4 rounded-full">
                       <UserPlus className="h-8 w-8 text-primary" />
                   </div>
                </CardHeader>
                <CardTitle className="font-headline text-xl mb-2">Step 1</CardTitle>
                <CardContent className="p-0 flex-grow text-muted-foreground">
                  <p>Sign in and create a profile to begin.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center p-6 bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                 <CardHeader className="p-0 mb-4">
                   <div className="bg-primary/10 p-4 rounded-full">
                       <FilePenLine className="h-8 w-8 text-primary" />
                   </div>
                </CardHeader>
                <CardTitle className="font-headline text-xl mb-2">Step 2</CardTitle>
                <CardContent className="p-0 flex-grow text-muted-foreground">
                  <p>Create a new memorial, enter details, and upload photos, memories, and meaningful stories.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center p-6 bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0 mb-4">
                   <div className="bg-primary/10 p-4 rounded-full">
                       <Share2 className="h-8 w-8 text-primary" />
                   </div>
                </CardHeader>
                <CardTitle className="font-headline text-xl mb-2">Step 3</CardTitle>
                <CardContent className="p-0 flex-grow text-muted-foreground">
                  <p>Share their memorial page and return anytime to reflect and remember.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose HonouredLives Section */}
        <section id="why-choose-section" className="py-16 sm:py-20 bg-card border-y">
           <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline text-foreground mb-2">Why Choose HonouredLives</h2>
              <p className="text-lg text-muted-foreground">Experience a meaningful way to celebrate and remember.</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                <div className="bg-secondary/20 p-4 rounded-full flex-shrink-0">
                  <Sparkles className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-headline text-xl mb-2">Personalized Tributes</h3>
                  <p className="text-muted-foreground">Craft beautiful, custom memorial pages that truly reflect the personality, values, and legacy of your loved ones. From life stories and milestones to photos and personal messages—every tribute is as unique as the life it honours.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                <div className="bg-secondary/20 p-4 rounded-full flex-shrink-0">
                  <QrCode className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-headline text-xl mb-2">Easy Sharing</h3>
                  <p className="text-muted-foreground">Our QR code technology bridges the past and present, allowing you to place codes at physical resting sites or share them digitally. Friends and family can instantly access memories, stories, and photos with just a scan—anytime, anywhere.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                <div className="bg-secondary/20 p-4 rounded-full flex-shrink-0">
                  <Users className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-headline text-xl mb-2">Community Support</h3>
                  <p className="text-muted-foreground">You’re not alone in remembering. Join a caring network of families and individuals who share your desire to preserve stories and honour heritage. Through shared experiences and supportive tools, we help keep legacies alive—together.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tell Their Story Section */}
        <section id="stories-section" className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-headline text-foreground mb-2">Tell Their Story</h2>
              <p className="text-lg text-muted-foreground">A timeless way to honor and remember</p>
            </div>
            <div className="grid md:grid-cols-3 md:items-start gap-8">
              <StoryCard
                className="border-4 border-primary"
                imageUrl="/techer.png"
                imageAlt="Illustrative image for Emily Grace Taylor's story"
                imageHint="teacher classroom"
                name="Emily Grace Taylor – Beloved Teacher"
                timeline="12 Mar 1992 – 19 Nov 2024"
                qrCodeUrl="https://studio--forevermark-ft522.us-central1.hosted.app/memorial/3670b18f-b965-4d3f-a13e-50a3299f6da5"
                story="A beloved teacher whose passion for learning lit up every classroom, Emily Grace Taylor was a beacon of light and knowledge to all who knew her. From her earliest days, Emily was drawn to books, stories, and the joy of discovery—qualities she carried into her teaching career with remarkable grace. Her compassion, warmth, and boundless energy turned lessons into life-changing experiences and classrooms into safe, welcoming spaces. Emily believed in every child’s potential and gave tirelessly to nurture it. Though her time was far too short, her influence continues to inspire generations."
              />
              <StoryCard
                className="border-4 border-primary"
                imageUrl="/james.png"
                imageAlt="Illustrative image for James Okoro's story"
                imageHint="community volunteer"
                name='James "Jimmy" Okoro – Community Hero'
                timeline="17 Mar 1960 – 07 Aug 2020"
                qrCodeUrl="https://studio--forevermark-ft522.us-central1.hosted.app/memorial/dcf677d0-f689-4485-8849-e63dcf550c1d"
                story="A gentle soul and community hero, Jimmy touched lives with his selflessness and tireless dedication to others. Known for his warm heart and unwavering commitment to helping those in need, he devoted his time to uplifting his community through volunteer work, mentorship, and quiet acts of kindness. Whether organizing local events or offering a listening ear, Jimmy made everyone feel seen, heard, and valued. His legacy lives on in the countless lives he impacted and the enduring spirit of compassion he leaves behind."
              />
              <StoryCard
                className="border-4 border-primary"
                imageUrl="/mother.png"
                imageAlt="Illustrative image for Nokuthula Maseko's story"
                imageHint="storyteller elder"
                name="Nokuthula Maseko – Resilient Storyteller"
                timeline="04 Oct 1971 – 18 Feb 2024"
                qrCodeUrl="https://studio--forevermark-ft522.us-central1.hosted.app/memorial/4f38044b-495b-4e80-a8e3-b894c7516382"
                story="A mother, storyteller, and beacon of resilience, Nokuthula Maseko carried the soul of her people in every word she spoke. Born and raised in a small village, she grew into a woman who faced hardship with quiet strength and unwavering dignity. Her gift for storytelling was not just an art—it was a lifeline, a way to preserve culture, pass on wisdom, and bring comfort during times of struggle. Whether seated by a fire under the stars or gathered with children in the shade of an acacia tree, Nokuthula wove tales that nurtured, healed, and empowered. Her stories live on in the hearts of those she touched, and her voice echoes in every lesson she left behind."
              />
            </div>
          </div>
        </section>

        <PricingTable />

        {/* Join Us Today Section */}
        <section className="py-16 sm:py-20 text-center bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline text-primary mb-3">Join Us Today</h2>
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
      <footer className="bg-logo-background text-white/80 py-8 text-center">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} HonouredLives. All rights reserved. Crafted with care to preserve legacy.</p>
        </div>
      </footer>
    </div>
  );
}


import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HonouredLives - Welcome',
  description: 'Remember, Celebrate, and Honor A Life. Create a beautiful and lasting online memorial for your loved ones.',
};

export default function HomePage() {
  return (
    <div
      className="relative flex flex-col min-h-screen bg-cover bg-center bg-fixed text-gray-800"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-800/80 text-white py-5 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex-shrink-0 mb-4 sm:mb-0">
            <Image
              src="/logo.png"
              alt="HonouredLives Logo"
              width={150}
              height={50}
              className="h-12 w-auto"
              data-ai-hint="logo company"
              priority
            />
          </div>
          <nav>
            <ul className="flex space-x-4 sm:space-x-6">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center text-center px-4 pt-24 pb-20 sm:pt-32"> {/* Adjusted padding for fixed header/footer */}
        <div className="bg-black/50 p-8 rounded-lg shadow-xl max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline text-white mb-6">
            Remember, Celebrate, and Honor A Life
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8">
            Create a beautiful and lasting online memorial for your loved ones. Share memories, stories, and photos in a serene and respectful space.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#FF6347] hover:bg-[#E55330] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-800/90 text-white py-5 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} HonouredLives. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

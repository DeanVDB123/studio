
import { Leaf, Sprout, TreeDeciduous, Heart, Check } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

export function PricingTable() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t-4 border-l-4 border-logo-background overflow-hidden">
      {/* SPIRIT TIER */}
      <div className="flex flex-col border-b-4 border-r-4 border-logo-background">
        <div className="bg-logo-background text-primary-foreground p-6 text-center">
          <div className="flex items-center justify-center gap-2 h-8">
            <Leaf className="h-6 w-6 text-green-400" />
            <h3 className="text-2xl font-headline tracking-wider">SPIRIT</h3>
          </div>
        </div>
        <div className="p-6 bg-card flex-grow flex flex-col">
          <ul className="space-y-4 text-card-foreground/90 flex-grow text-left">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>Unlimited memorials.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>Can't share created memorials.</span>
            </li>
          </ul>
          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full" disabled>
              Free
            </Button>
          </div>
        </div>
      </div>

      {/* ESSENCE TIER */}
      <div className="flex flex-col border-b-4 border-r-4 border-logo-background">
        <div className="bg-logo-background text-primary-foreground p-6 text-center">
          <div className="flex items-center justify-center gap-2 h-8">
            <Sprout className="h-6 w-6 text-green-400" />
            <h3 className="text-2xl font-headline tracking-wider">ESSENCE</h3>
          </div>
        </div>
        <div className="p-6 bg-card flex-grow flex flex-col">
          <ul className="space-y-4 text-card-foreground/90 flex-grow text-left">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>Unlimited memorials.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>Memorials are hosted and shareable for the first 5 years.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>Personalized QR code plaque to place at a physical resting place.</span>
            </li>
          </ul>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="w-full">
              <a href="mailto:honouredlives@gmail.com?subject=Inquiry about the ESSENCE plan">
                Contact us
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* LEGACY TIER */}
      <div className="flex flex-col border-b-4 border-r-4 border-logo-background">
        <div className="bg-logo-background text-primary-foreground p-6 text-center">
          <div className="flex items-center justify-center gap-2 h-8">
            <TreeDeciduous className="h-6 w-6 text-green-400" />
            <h3 className="text-2xl font-headline tracking-wider">LEGACY</h3>
          </div>
        </div>
        <div className="p-6 bg-card flex-grow flex flex-col">
          <ul className="space-y-4 text-card-foreground/90 flex-grow text-left">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>All features from ESSENCE plan.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>Memorials are hosted and shareable for the first 10 years.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>Priority support.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>Optional custom design template.</span>
            </li>
          </ul>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="w-full">
              <a href="mailto:honouredlives@gmail.com?subject=Inquiry about the LEGACY plan">
                Contact us
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* ETERNAL TIER */}
      <div className="flex flex-col border-b-4 border-r-4 border-logo-background">
        <div className="bg-logo-background text-primary-foreground p-6 text-center">
          <div className="flex items-center justify-center gap-2 h-8">
            <Heart className="h-6 w-6 text-yellow-400" />
            <h3 className="text-2xl font-headline tracking-wider">ETERNAL</h3>
          </div>
        </div>
        <div className="p-6 bg-card flex-grow flex flex-col">
          <ul className="space-y-4 text-card-foreground/90 flex-grow text-left">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>All features from LEGACY plan.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>Memorials are hosted and shareable for eternity.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>No renewals, no expiry.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>"Eternal" badge displayed on page.</span>
            </li>
          </ul>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="w-full">
              <a href="mailto:honouredlives@gmail.com?subject=Inquiry about the ETERNAL plan">
                Contact us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

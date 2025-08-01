
import { Leaf, Sprout, TreeDeciduous, Heart, Check } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PricingTableProps {
  memorialId?: string;
  deceasedName?: string;
}

const getPaymentLink = (plan: string, memorialId?: string, deceasedName?: string) => {
    if (!memorialId || !deceasedName) {
        // If we don't have memorial details, just go to the signup page.
        return '/signup';
    }
    // Use a cleaner path and pass the name as a query parameter
    return `/payment/${plan.toUpperCase()}/${memorialId}?name=${encodeURIComponent(deceasedName)}`;
}

export function PricingTable({ memorialId, deceasedName }: PricingTableProps) {
  const isUpgradeFlow = !!memorialId;

  return (
    <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 border-t-4 border-l-4 border-logo-background overflow-hidden",
        isUpgradeFlow ? "lg:grid-cols-3" : "lg:grid-cols-4"
    )}>
      {/* SPIRIT Plan - Conditionally rendered */}
      {!isUpgradeFlow && (
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
                <span>Private access to your memorials.</span>
                </li>
            </ul>
            <div className="mt-6 text-center">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/signup">
                    Sign up to choose
                  </Link>
                </Button>
            </div>
            </div>
        </div>
      )}

      {/* ESSENCE Plan */}
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
              <span>Memorials are hosted and shareable for the first 2 years.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>Personalized QR code plaque to place at a physical resting place.</span>
            </li>
          </ul>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="w-full">
              <Link href={getPaymentLink('ESSENCE', memorialId, deceasedName)}>
                Choose Plan
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* LEGACY Plan */}
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
              <span>Custom plaque design.</span>
            </li>
          </ul>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="w-full">
              <Link href={getPaymentLink('LEGACY', memorialId, deceasedName)}>
                Choose Plan
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ETERNAL Plan */}
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
              <span>Bespoke design for memorial page.</span>
            </li>
          </ul>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="w-full">
               <Link href={getPaymentLink('ETERNAL', memorialId, deceasedName)}>
                Choose Plan
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

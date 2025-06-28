
import { Leaf, Sprout, TreeDeciduous, Heart, Check } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

const tiers = [
  {
    name: 'SPIRIT',
    icon: <><Leaf className="h-6 w-6 text-green-400" /></>,
    features: [
      'Unlimited memorials.',
      "Can't share created memorials.",
    ],
  },
  {
    name: 'ESSENCE',
    icon: <Sprout className="h-6 w-6 text-green-400" />,
    features: [
      'Unlimited memorials.',
      'Memorials are hosted and shareable for the first 5 years.',
      'Personalized QR code plaque to place at a physical resting place.',
    ],
  },
  {
    name: 'LEGACY',
    icon: <TreeDeciduous className="h-6 w-6 text-green-400" />,
    features: [
      'All features from ESSENCE plan.',
      'Memorials are hosted and shareable for the first 10 years.',
      'Priority support.',
      'Optional custom design template.',
    ],
  },
  {
    name: 'ETERNAL',
    icon: <><Heart className="h-6 w-6 text-yellow-400" /></>,
    features: [
      'All features from LEGACY plan.',
      'Memorials are hosted and shareable for eternity.',
      'No renewals, no expiry.',
      '"Eternal" badge displayed on page.',
    ],
  },
];

export function PricingTable() {
  return (
    <section id="pricing-section" className="py-12 sm:py-16 bg-white border-y">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-headline text-foreground mb-2">Our Plans</h2>
          <p className="text-lg text-muted-foreground">A plan for every need, ensuring memories are preserved and cherished.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t-4 border-l-4 border-logo-background overflow-hidden">
          {tiers.map((tier) => (
            <div key={tier.name} className="flex flex-col border-b-4 border-r-4 border-logo-background">
              <div className="bg-logo-background text-primary-foreground p-6 text-center">
                <div className="flex items-center justify-center gap-2 h-8">
                  {tier.icon}
                  <h3 className="text-2xl font-headline tracking-wider">{tier.name}</h3>
                </div>
              </div>
              <div className="p-6 bg-card flex-grow flex flex-col">
                <ul className="space-y-4 text-card-foreground/90 flex-grow text-left">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 text-center">
                  {tier.name === 'SPIRIT' ? (
                    <Button variant="outline" className="w-full" disabled>
                      Free
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full">
                      <a href={`mailto:honouredlives@gmail.com?subject=Inquiry about the ${tier.name} plan`}>
                        Contact us
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

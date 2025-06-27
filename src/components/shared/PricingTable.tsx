
import { Leaf, Sprout, TreeDeciduous, Heart, Check } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

const tiers = [
  {
    name: 'FREE',
    price: 'FREEMIUM',
    icon: <><Leaf className="h-6 w-6 text-green-400" /></>,
    features: [
      'Unlimited memorials.',
      "Can't share created memorials.",
    ],
  },
  {
    name: 'ESSENCE',
    price: 'R 2,999',
    priceDescription: 'Once-off',
    icon: <Sprout className="h-6 w-6 text-green-400" />,
    features: [
      'Unlimited memorials.',
      'Memorials are hosted and shareable for 5 years.',
      'Custom QR code plaque to place at a physical resting place.',
    ],
  },
  {
    name: 'LEGACY',
    price: 'R 4,999',
    priceDescription: 'Once-off',
    icon: <TreeDeciduous className="h-6 w-6 text-green-400" />,
    features: [
      'All features from ESSENCE plan.',
      'Memorials are hosted and shareable for 10 years.',
      'Priority support.',
      'Optional custom design template.',
    ],
  },
  {
    name: 'ETERNAL',
    price: 'R 11,999',
    priceDescription: 'Once-off',
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
    <section id="pricing-section" className="py-12 sm:py-16 bg-card border-y">
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
              <div className="bg-secondary text-secondary-foreground p-4 text-center flex flex-col justify-center h-20">
                <div>
                  <p className="text-2xl font-bold font-headline">{tier.price}</p>
                  {tier.priceDescription && <p className="text-xs uppercase tracking-widest">{tier.priceDescription}</p>}
                </div>
              </div>
              <div className="p-6 bg-card flex-grow flex flex-col">
                <ul className="space-y-4 text-card-foreground/90 flex-grow text-center">
                  {tier.features.map((feature, i) => (
                    <li key={i}>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {tier.name !== 'FREE' && (
                  <div className="mt-6 text-center">
                    <Button asChild variant="outline" className="w-full">
                      <a href={`mailto:honouredlives@gmail.com?subject=Inquiry about the ${tier.name} plan`}>
                        Contact us
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

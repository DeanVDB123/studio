'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check localStorage only on the client side
    const consent = localStorage.getItem('cookie_consent');
    if (consent === null) {
       // Use a short delay to prevent layout shifts and ensure the main content loads first.
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'given');
    setShowConsent(false);
  };
  
  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-10 duration-500">
      <Card className="rounded-none border-t border-b-0 border-l-0 border-r-0 shadow-lg">
        <CardHeader>
          <CardTitle>We Value Your Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your experience and analyze site traffic. By clicking "Accept", you agree to our use of cookies as described in our{' '}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/privacy" target="_blank">
                Privacy Policy
              </Link>
            </Button>
            .
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button onClick={handleDecline} variant="outline">Decline</Button>
          <Button onClick={handleAccept}>Accept</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

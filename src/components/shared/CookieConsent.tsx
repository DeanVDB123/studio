'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent');
      // Only show the banner if consent has not been explicitly given.
      if (consent !== 'given') {
        setShowConsent(true);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      // Fallback: Show consent banner if localStorage is not available.
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie_consent', 'given');
    } catch (error) {
      console.error("Could not save cookie consent choice:", error);
    }
    setShowConsent(false);
  };
  
  const handleDecline = () => {
    // We don't store the 'declined' state, so it will reappear next time.
    setShowConsent(false);
    window.location.href = 'https://kitswys.com/';
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

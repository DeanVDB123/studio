

"use client";

import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { PaystackButton } from '@/components/shared/PaystackButton';
import { useEffect, useState } from 'react';

const planDetails: Record<string, { name: string; price: number }> = {
  ESSENCE: { name: 'Essence Plan', price: 25000 }, // Price in kobo (e.g., 25000 = R250.00)
  LEGACY: { name: 'Legacy Plan', price: 75000 },
  ETERNAL: { name: 'Eternal Plan', price: 150000 },
};

export default function PaymentsPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  
  const [clientReady, setClientReady] = useState(false);
  useEffect(() => setClientReady(true), []);

  const details = params.details as string[] || [];
  const plan = details[0]?.toUpperCase();
  const memorialId = details[1];

  const deceasedName = searchParams.get('name');

  const selectedPlan = plan && planDetails[plan] ? planDetails[plan] : null;

  if (authLoading || !clientReady) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Payment Details...</p>
      </div>
    );
  }

  if (!user) {
    // This should ideally be handled by a layout or middleware, but as a fallback:
    router.push('/login');
    return null;
  }
  
  if (!selectedPlan || !memorialId || !deceasedName) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <Card className="w-full max-w-lg shadow-lg text-center">
          <CardHeader>
             <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-headline text-destructive">
              Invalid Payment Link
            </CardTitle>
            <CardDescription>
              The payment link is missing some required details. Please go back and select a plan again.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/memorials">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            Complete Your Purchase
          </CardTitle>
          <CardDescription>
            You are purchasing the <span className="font-bold text-primary">{selectedPlan.name}</span> for the memorial of <span className="font-bold text-primary">{deceasedName}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="text-center p-6 border rounded-lg bg-muted/50 flex justify-between items-center">
            <p className="text-lg font-medium text-muted-foreground">
              Total Amount:
            </p>
             <p className="text-2xl font-bold text-foreground">
              R{(selectedPlan.price / 100).toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <PaystackButton 
            email={user.email!}
            amount={selectedPlan.price}
            plan={plan}
            memorialId={memorialId}
            deceasedName={deceasedName}
          />
           <Button asChild variant="ghost" className="text-muted-foreground">
              <Link href="/memorials">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

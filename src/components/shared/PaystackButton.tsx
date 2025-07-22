
'use client';

import React, { useState, useCallback } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaystackButtonProps {
  email: string;
  amount: number; // Amount in kobo
  plan: string;
  memorialId: string;
  deceasedName: string;
}

export function PaystackButton({ email, amount, plan, memorialId, deceasedName }: PaystackButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount,
    currency: 'ZAR',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  };

  const handleVerification = useCallback(async (reference: string) => {
    setIsProcessing(true);
    toast({ title: 'Payment Received', description: 'Verifying your transaction...' });
    
    try {
      const response = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference, plan, memorialId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Verification failed. Please contact support.');
      }

      toast({
        title: 'Verification Successful!',
        description: `The plan for ${deceasedName} has been upgraded.`,
      });
      
      router.push(`/memorials`);

    } catch (error: any) {
      console.error('[Paystack] Verification failed:', error);
      toast({
        title: 'Verification Failed',
        description: error.message || 'There was an issue verifying your payment. Please contact support.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  }, [plan, memorialId, deceasedName, toast, router]);


  const onSuccess = (reference: any) => {
    console.log('[Paystack] Success. Reference:', reference);
    handleVerification(reference.reference);
  };

  const onClose = () => {
    console.log('[Paystack] Payment dialog closed.');
    if (!isProcessing) {
        toast({
            title: 'Payment Cancelled',
            description: 'The payment process was cancelled.',
            variant: 'default',
        });
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (!config.publicKey) {
        toast({
            title: 'Configuration Error',
            description: 'Payment gateway is not configured. Please contact support.',
            variant: 'destructive'
        });
        return;
    }
    initializePayment({onSuccess, onClose});
  };

  return (
    <Button
      onClick={handlePayment}
      className="w-full"
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          Proceed to Pay
        </>
      )}
    </Button>
  );
}


'use client';

import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Loader2 } from 'lucide-react';
import { verifyPaystackTransaction } from '@/lib/actions';
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
    currency: 'ZAR', // Explicitly set the currency to ZAR
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  };

  const onSuccess = async (reference: any) => {
    console.log('[Paystack] Success. Reference:', reference);
    setIsProcessing(true); // Keep processing state while verifying
    toast({ title: 'Payment Received', description: 'Verifying your transaction...' });
    
    try {
      await verifyPaystackTransaction({
        reference: reference.reference,
        plan,
        memorialId,
      });

      toast({
        title: 'Verification Successful!',
        description: `The plan for ${deceasedName} has been upgraded.`,
      });
      
      // Redirect to the edit page to see the changes
      router.push(`/edit/${memorialId}`);

    } catch (error: any) {
      console.error('[Paystack] Verification failed:', error);
      toast({
        title: 'Verification Failed',
        description: error.message || 'There was an issue verifying your payment. Please contact support.',
        variant: 'destructive',
      });
      setIsProcessing(false); // Reset button on failure
    }
  };

  const onClose = () => {
    console.log('[Paystack] Payment dialog closed.');
    toast({
      title: 'Payment Cancelled',
      description: 'The payment process was cancelled.',
      variant: 'default',
    });
    setIsProcessing(false); // Reset button state
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <Button
      onClick={() => {
        if (!config.publicKey) {
            toast({
                title: 'Configuration Error',
                description: 'Payment gateway is not configured. Please contact support.',
                variant: 'destructive'
            });
            return;
        }
        setIsProcessing(true);
        // Correctly call initializePayment with the callback functions
        initializePayment(onSuccess, onClose);
      }}
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

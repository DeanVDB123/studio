
"use client";

import { useState, type FormEvent, useEffect, type SVGProps } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TermsContent } from '@/components/auth/TermsContent';
import { PrivacyContent } from '@/components/auth/PrivacyContent';

const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4818h4.8436c-.2086 1.125-.844 2.0782-1.7772 2.7218v2.2582h2.9087c1.7018-1.5668 2.6836-3.8745 2.6836-6.621z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1818l-2.9087-2.2582c-.806.5409-1.8368.8618-3.0477.8618-2.345 0-4.3282-1.5818-5.0359-3.7118H.957v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
        <path d="M3.9641 10.71c-.1818-.5409-.2864-1.1164-.2864-1.71s.1045-1.1691.2864-1.71V4.9582H.957C.3477 6.1732 0 7.5477 0 9c0 1.4523.3477 2.8268.957 4.0418L3.9641 10.71z" fill="#FBBC05"/>
        <path d="M9 3.5782c1.3227 0 2.5182.4545 3.4409 1.3455l2.5818-2.5818C13.4636.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.957 4.9582L3.9641 7.29C4.6718 5.159 6.655 3.5782 9 3.5782z" fill="#EA4335"/>
      </g>
    </svg>
  );

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { signUp, signInWithGoogle, loading: authLoading, error: authError, user } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/memorials');
    }
  }, [user, authLoading, router]);

  if (authLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!agreedToTerms) {
      setFormError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords don't match.");
      return;
    }
    
    try {
      await signUp(auth, email, password);
      router.push('/memorials');
    } catch (err: any) {
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setFormError('This email is already registered. Try logging in.');
            break;
          case 'auth/invalid-email':
            setFormError('Please enter a valid email address.');
            break;
          case 'auth/weak-password':
            setFormError('Password is too weak. It should be at least 6 characters.');
            break;
          default:
            setFormError('Failed to create account. Please try again.');
            console.error("Signup error:", err);
        }
      } else {
         setFormError('An unexpected error occurred. Please try again.');
         console.error("Signup error:", err);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setFormError(null);
    if (!agreedToTerms) {
      setFormError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    try {
      await signInWithGoogle();
      // User state change will trigger useEffect to redirect
      router.push('/memorials');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setFormError('Sign-up process was cancelled.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setFormError('An account already exists with the same email address using a different sign-in method. Please log in instead.');
      }
      else {
        setFormError('Failed to sign up with Google. Please try again.');
        console.error("Google Sign-Up error:", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl overflow-hidden">
        <CardHeader className="text-center flex flex-col items-center bg-primary text-primary-foreground">
          <Link href="/">
            <Image
              src="/hlb.png"
              alt="HonouredLives Logo"
              width={120}
              height={68}
              className="mb-6"
              data-ai-hint="logo company"
            />
          </Link>
          <CardDescription className="text-primary-foreground/90">Join HonouredLives to create lasting memorials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min. 6 characters)"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-normal text-muted-foreground"
                >
                  I agree to the{' '}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto underline text-primary hover:text-primary/80" type="button">
                        Terms of Service
                      </Button>
                    </DialogTrigger>
                     <DialogContent className="max-w-3xl p-0 flex flex-col h-[80vh] sm:h-[90vh] gap-0 bg-primary">
                        <DialogHeader className="text-primary-foreground p-4 flex flex-row items-center space-y-0 flex-shrink-0">
                          <DialogTitle className="text-2xl font-headline text-primary-foreground">Terms of Service</DialogTitle>
                          <div className="flex-grow" />
                          <Image
                            src="/hlb.png"
                            alt="HonouredLives Logo"
                            width={80}
                            height={45}
                            data-ai-hint="logo company"
                            className="mr-10"
                          />
                        </DialogHeader>
                        <div className="p-6 overflow-y-auto flex-grow bg-background">
                          <TermsContent />
                        </div>
                        <div className="p-2 flex-shrink-0">
                        </div>
                      </DialogContent>
                  </Dialog>
                  {' '}and{' '}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto underline text-primary hover:text-primary/80" type="button">
                        Privacy Policy
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl p-0 flex flex-col h-[80vh] sm:h-[90vh] gap-0 bg-primary">
                        <DialogHeader className="text-primary-foreground p-4 flex flex-row items-center space-y-0 flex-shrink-0">
                          <DialogTitle className="text-2xl font-headline text-primary-foreground">Privacy Policy</DialogTitle>
                          <div className="flex-grow" />
                           <Image
                            src="/hlb.png"
                            alt="HonouredLives Logo"
                            width={80}
                            height={45}
                            data-ai-hint="logo company"
                            className="mr-10"
                          />
                        </DialogHeader>
                        <div className="p-6 overflow-y-auto flex-grow bg-background">
                          <PrivacyContent />
                        </div>
                        <div className="p-2 flex-shrink-0">
                        </div>
                      </DialogContent>
                  </Dialog>
                  .
                </label>
              </div>
            </div>

            {formError && <p className="text-sm text-destructive text-center">{formError}</p>}
            {authError && !formError && <p className="text-sm text-destructive text-center">{authError.message}</p>}

            <Button type="submit" className="w-full" disabled={authLoading || !agreedToTerms}>
              {authLoading && !user ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign Up
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full border-primary" onClick={handleGoogleSignUp} disabled={authLoading || !agreedToTerms}>
            {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" asChild className="p-0 h-auto">
               <Link href="/login">Log in</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

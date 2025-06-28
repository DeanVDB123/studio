
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2, Chrome } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TermsContent } from '@/components/auth/TermsContent';
import { PrivacyContent } from '@/components/auth/PrivacyContent';

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
      router.push('/admin');
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
      router.push('/admin');
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
      router.push('/admin');
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
          <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={authLoading || !agreedToTerms}>
            {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />}
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

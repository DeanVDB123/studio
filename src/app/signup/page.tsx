
"use client";

import { useState, type FormEvent, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2, UserPlus } from 'lucide-react';
import { auth } from '@/lib/firebase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, loading: authLoading, error: authError, user } = useAuth();
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Create Account</CardTitle>
          <CardDescription>Join HonoringLives to create lasting memorials.</CardDescription>
        </CardHeader>
        <CardContent>
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
            {formError && <p className="text-sm text-destructive text-center">{formError}</p>}
            {authError && !formError && <p className="text-sm text-destructive text-center">{authError.message}</p>}
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading && !user ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign Up
            </Button>
          </form>
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

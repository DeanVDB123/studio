
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2, LogInIcon, Chrome } from 'lucide-react'; // Added Chrome for Google icon
import { auth } from '@/lib/firebase';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logIn, signInWithGoogle, loading: authLoading, error: authError, user } = useAuth();
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
    try {
      await logIn(auth, email, password);
      router.push('/admin');
    } catch (err: any) {
      if (err.code) {
        switch (err.code) {
          case 'auth/invalid-email':
            setFormError('Invalid email address.');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            setFormError('Invalid email or password.');
            break;
          default:
            setFormError('Failed to log in. Please try again.');
            console.error("Login error:", err);
        }
      } else {
        setFormError('An unexpected error occurred. Please try again.');
        console.error("Login error:", err);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    try {
      await signInWithGoogle();
      // User state change will trigger useEffect to redirect
      router.push('/admin');
    } catch (err: any) {
       if (err.code === 'auth/popup-closed-by-user') {
        setFormError('Sign-in process was cancelled.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setFormError('An account already exists with the same email address using a different sign-in method.');
      } else {
        setFormError('Failed to sign in with Google. Please try again.');
        console.error("Google Sign-In error:", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <LogInIcon className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Log in to manage your memorial pages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                placeholder="••••••••"
                required
              />
            </div>
            {formError && <p className="text-sm text-destructive text-center">{formError}</p>}
            {authError && !formError && <p className="text-sm text-destructive text-center">{authError.message}</p>}
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading && !user ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Log In
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
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={authLoading}>
            {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />}
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-4">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" asChild className="p-0 h-auto">
               <Link href="/signup">Sign up</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    
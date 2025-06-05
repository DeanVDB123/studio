
"use client";

import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signUp: typeof createUserWithEmailAndPassword;
  logIn: typeof signInWithEmailAndPassword;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };
  
  // Functions to wrap Firebase methods to handle errors and loading state
  const signUpWithFeedback = async (...args: Parameters<typeof createUserWithEmailAndPassword>) => {
    setLoading(true);
    setError(null);
    try {
      return await createUserWithEmailAndPassword(...args);
    } catch (err) {
      setError(err as AuthError);
      throw err; // Re-throw for the form to handle
    } finally {
      setLoading(false);
    }
  };

  const logInWithFeedback = async (...args: Parameters<typeof signInWithEmailAndPassword>) => {
    setLoading(true);
    setError(null);
    try {
      return await signInWithEmailAndPassword(...args);
    } catch (err) {
      setError(err as AuthError);
      throw err; // Re-throw for the form to handle
    } finally {
      setLoading(false);
    }
  };


  if (loading && typeof window !== 'undefined') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Authentication...</p>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, error, signUp: signUpWithFeedback, logIn: logInWithFeedback, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

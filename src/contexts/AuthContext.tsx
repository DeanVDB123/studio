
"use client";

import type { User, UserCredential } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase'; // Import googleAuthProvider
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup, // Import signInWithPopup
  getAdditionalUserInfo, // Import getAdditionalUserInfo
  type AuthError,
} from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { logSignupEvent, getUserStatus } from '@/lib/data';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  userStatus: string | null;
  loading: boolean;
  error: AuthError | null;
  signUp: typeof createUserWithEmailAndPassword;
  logIn: typeof signInWithEmailAndPassword;
  signInWithGoogle: () => Promise<UserCredential | void>; // Updated type
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const status = await getUserStatus(currentUser.uid);
        setUserStatus(status);
      } else {
        setUserStatus(null);
      }
      setLoading(false);
    }, (err) => {
      setError(err);
      setUser(null);
      setUserStatus(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null); // Explicitly set user to null
      setUserStatus(null);
      setError(null);
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithFeedback = async (...args: Parameters<typeof createUserWithEmailAndPassword>) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(...args);
      // Log the signup event for new email/password users
      if (userCredential.user) {
        await logSignupEvent({
          userId: userCredential.user.uid,
          email: userCredential.user.email,
        });
      }
      return userCredential;
    } catch (err) {
      setError(err as AuthError);
      throw err;
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      // Check if it's a new user and log the signup event
      const additionalInfo = getAdditionalUserInfo(result);
      if (additionalInfo?.isNewUser && result.user) {
        await logSignupEvent({
          userId: result.user.uid,
          email: result.user.email,
        });
      }
      return result;
    } catch (err) {
      setError(err as AuthError);
      // Check for specific Google Sign-In errors if needed
      if ((err as AuthError).code === 'auth/popup-closed-by-user') {
        console.log('Google Sign-In popup closed by user.');
        // Don't necessarily throw this as an error to display to user,
        // unless you want to inform them.
      } else if ((err as AuthError).code === 'auth/account-exists-with-different-credential') {
         setError(err as AuthError); // Let the component display this
         throw err;
      } else {
        throw err; // Re-throw for the form to handle
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, userStatus, signUp: signUpWithFeedback, logIn: logInWithFeedback, signInWithGoogle, logOut }}>
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

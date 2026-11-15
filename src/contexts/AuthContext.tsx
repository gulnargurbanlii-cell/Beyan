import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInWithGmail, signOutAccount, handleFirestoreError, OperationType } from '../services/firebase';

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  signingIn: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithGmail: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncUserProfile(user: User) {
  const profilePath = `users/${user.uid}/private/profile`;
  const profileRef = doc(db, 'users', user.uid, 'private', 'profile');

  const safeName = (user.displayName || user.email?.split('@')[0] || 'İstifadəçi').slice(0, 120);
  const safeEmail = (user.email || '').slice(0, 254);
  const safePhoto = user.photoURL ? user.photoURL.slice(0, 1000) : undefined;

  if (!safeEmail) return;

  try {
    const snap = await getDoc(profileRef);
    if (!snap.exists()) {
      const payload: Record<string, unknown> = {
        uid: user.uid,
        displayName: safeName,
        email: safeEmail,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      if (safePhoto) {
        payload.photoURL = safePhoto;
      }
      try {
        await setDoc(profileRef, payload);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, profilePath);
      }
    } else {
      const existing = snap.data();
      if (
        existing.displayName !== safeName ||
        existing.email !== safeEmail ||
        (safePhoto && existing.photoURL !== safePhoto)
      ) {
        const updates: Record<string, unknown> = {
          displayName: safeName,
          email: safeEmail,
          updatedAt: serverTimestamp()
        };
        if (safePhoto) {
          updates.photoURL = safePhoto;
        }
        try {
          await updateDoc(profileRef, updates);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, profilePath);
        }
      }
    }
  } catch (err) {
    // Re-throw if already formatted by handleFirestoreError, otherwise wrap GET error
    if (err instanceof Error && err.message.startsWith('{"error":')) {
      throw err;
    }
    handleFirestoreError(err, OperationType.GET, profilePath);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);

      if (firebaseUser) {
        try {
          await syncUserProfile(firebaseUser);
        } catch (err) {
          console.error('User profile sync error:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGmail = useCallback(async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      const signedInUser = await signInWithGmail();
      await syncUserProfile(signedInUser);
    } catch (err: any) {
      console.error('Gmail login failed:', err);
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Giriş pəncərəsi bağlandı. Yenidən cəhd edə bilərsiniz.');
      } else if (code === 'auth/popup-blocked') {
        setAuthError('Brauzer açılan pəncərəni (popup) blokladı. Zəhmət olmasa icazə verin.');
      } else {
        setAuthError('Gmail ilə daxil olmaq mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.');
      }
    } finally {
      setSigningIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthError(null);
    try {
      await signOutAccount();
    } catch (err) {
      console.error('Sign out error:', err);
      setAuthError('Hesabdan çıxış zamanı xəta baş verdi.');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        signingIn,
        authError,
        clearAuthError: () => setAuthError(null),
        loginWithGmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { AuthModal } from "@/components/auth/AuthModal";
import { formatAuthError } from "@/lib/firebase/auth-errors";
import { getFirebaseAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";

type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  configured: boolean;
  openAuth: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export { AuthContext };

async function syncSession(idToken: string): Promise<boolean> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  return res.ok;
}

function mapUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

async function establishSession(auth: Auth, firebaseUser: User): Promise<void> {
  const token = await firebaseUser.getIdToken();
  const synced = await syncSession(token);
  if (!synced) {
    await signOut(auth);
    throw new Error("Could not establish session. Please try again.");
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isFirebaseClientConfigured();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(configured);
  const [authOpen, setAuthOpen] = useState(false);
  const lastSessionSyncRef = useRef(0);

  useEffect(() => {
    if (!configured) return;

    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const synced = await syncSession(token);
        if (synced) {
          setUser(mapUser(firebaseUser));
          lastSessionSyncRef.current = Date.now();
        } else {
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const unsubscribeToken = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      const now = Date.now();
      if (now - lastSessionSyncRef.current < 5 * 60_000) return;
      const token = await firebaseUser.getIdToken();
      const synced = await syncSession(token);
      if (synced) lastSessionSyncRef.current = now;
    });

    return () => {
      unsubscribe();
      unsubscribeToken();
    };
  }, [configured]);

  const finishAuth = useCallback((firebaseUser: User) => {
    setUser(mapUser(firebaseUser));
    setAuthOpen(false);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const auth = getFirebaseAuth();
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await establishSession(auth, cred.user);
        finishAuth(cred.user);
      } catch (err) {
        throw new Error(formatAuthError(err));
      }
    },
    [finishAuth],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const auth = getFirebaseAuth();
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await establishSession(auth, cred.user);
        finishAuth(cred.user);
      } catch (err) {
        throw new Error(formatAuthError(err));
      }
    },
    [finishAuth],
  );

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const cred = await signInWithPopup(auth, provider);
      await establishSession(auth, cred.user);
      finishAuth(cred.user);
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  }, [finishAuth]);

  const signOutUser = useCallback(async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      openAuth: () => setAuthOpen(true),
      signIn,
      signUp,
      signInWithGoogle,
      signOutUser,
    }),
    [user, loading, configured, signIn, signUp, signInWithGoogle, signOutUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {configured && (
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onSignIn={signIn}
          onSignUp={signUp}
          onGoogleSignIn={signInWithGoogle}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

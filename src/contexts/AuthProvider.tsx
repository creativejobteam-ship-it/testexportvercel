
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInDemo: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase Auth failed to initialize (e.g. missing keys), stop here to prevent crash
    if (!auth) {
      console.warn("Auth service not available. Authentication disabled.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInDemo = async () => {
      // Mock User for Demo Mode
      const mockUser = {
        uid: "demo-user-123",
        displayName: "Demo User",
        email: "demo@autocm.app",
        photoURL: "https://picsum.photos/seed/user/40/40",
        emailVerified: true
      } as User;
      
      setUser(mockUser);
  };

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      // Fallback to Demo Login if Firebase is not configured
      console.warn("Firebase not configured. Logging in as Demo User.");
      await signInDemo();
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      
      // Auto-fallback for domain issues in preview environments or misconfiguration
      if (
          error.code === 'auth/unauthorized-domain' || 
          error.code === 'auth/operation-not-allowed' || 
          error.code === 'auth/configuration-not-found'
      ) {
          console.warn(`Firebase Auth Error (${error.code}). Falling back to Demo Mode.`);
          await signInDemo();
          return;
      }
      
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) {
        setUser(null);
        return;
    }
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      // Even if firebase signout fails (e.g. if we are in demo mode but auth object exists), clear local state
      setUser(null);
    }
  };

  const refreshUser = async () => {
      if (auth && auth.currentUser) {
          await auth.currentUser.reload();
          // Force state update by creating a new object reference
          setUser({ ...auth.currentUser }); 
      } else if (user && user.uid === 'demo-user-123') {
          // Demo mode refresh (simulated)
          setUser({ ...user });
      }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInDemo, logout, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

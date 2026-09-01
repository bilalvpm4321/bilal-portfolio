import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isMockAuth: boolean;
}

const defaultAdminUser: any = {
  id: 'admin-bilal-uuid',
  email: 'bilalvpm2@gmail.com',
  role: 'authenticated',
  user_metadata: { full_name: 'Bilal Ahamed PT' },
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultAdminUser);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [isMockAuth, setIsMockAuth] = useState<boolean>(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setUser(defaultAdminUser);
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    // Check active Supabase session if configured
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          setIsAdmin(true);
        } else {
          setUser(defaultAdminUser);
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Auth initialization check:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
        } else {
          setUser(defaultAdminUser);
        }
        setIsAdmin(true);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      setUser(defaultAdminUser);
      setIsAdmin(true);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setIsAdmin(true);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(defaultAdminUser);
    setIsAdmin(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        isMockAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

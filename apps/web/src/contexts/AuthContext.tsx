import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (provider: 'google' | 'apple') => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile from Supabase
  async function loadUserProfile(supabaseUser: SupabaseUser) {
    try {
      // Try to get profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which is okay for new users
        console.error('Error loading profile:', error);
      }

      const userData: User = {
        id: supabaseUser.id,
        name: profile?.name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
      };

      setUser(userData);
      setIsLoading(false);

      // Create profile if it doesn't exist
      if (!profile) {
        await supabase.from('profiles').insert({
          id: supabaseUser.id,
          name: userData.name,
          avatar_url: userData.avatar,
          preferences: {},
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setIsLoading(false);
    }
  }

  // Initialize auth state from Supabase session
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('Auth loading timeout - clearing loading state');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        clearTimeout(timeoutId);
        return;
      }

      if (session?.user) {
        loadUserProfile(session.user).finally(() => {
          if (mounted) {
            clearTimeout(timeoutId);
          }
        });
      } else {
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        clearTimeout(timeoutId);
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        clearTimeout(timeoutId);
        setUser(null);
        setIsLoading(false);
      } else if (session?.user) {
        clearTimeout(timeoutId);
        await loadUserProfile(session.user);
      } else {
        clearTimeout(timeoutId);
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (provider: 'google' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });

      if (error) {
        console.error('Auth error:', error);
        throw error;
      }
      // User will be set via onAuthStateChange listener
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        setIsLoading(false);
        throw error;
      }
      // Clear user state
      setUser(null);
      setIsLoading(false);
      // Clear any cached data
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
      // Force logout even if there's an error
      setUser(null);
      window.location.href = '/';
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      // Update in Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          avatar_url: userData.avatar,
          ...(userData.email && { email: userData.email }),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      // Update local state
      setUser({ ...user, ...userData });
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

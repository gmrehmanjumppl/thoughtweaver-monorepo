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
      console.log('Loading user profile for:', supabaseUser.email);
      
      // Try to get profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      // Handle different error codes
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - profile doesn't exist yet, this is okay
          console.log('Profile not found, will create new one');
        } else if (error.code === '42P01') {
          // Table doesn't exist - migrations haven't been run
          console.warn('Profiles table does not exist. Please run database migrations.');
          // Still set user with Supabase metadata
          const userData: User = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
            email: supabaseUser.email || '',
            avatar: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
          };
          setUser(userData);
          setIsLoading(false);
          return;
        } else {
          // Other errors
          console.error('Error loading profile:', error);
          // Still set user with Supabase metadata so app can function
          const userData: User = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
            email: supabaseUser.email || '',
            avatar: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
          };
          setUser(userData);
          setIsLoading(false);
          return;
        }
      }

      const userData: User = {
        id: supabaseUser.id,
        name: profile?.name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
      };

      console.log('User profile loaded:', userData.email);
      setUser(userData);
      setIsLoading(false);

      // Create profile if it doesn't exist (only if table exists)
      if (!profile && error?.code !== '42P01') {
        try {
          await supabase.from('profiles').insert({
            id: supabaseUser.id,
            name: userData.name,
            avatar_url: userData.avatar,
            preferences: {},
          });
        } catch (insertError) {
          // If insert fails (e.g., table doesn't exist), that's okay
          console.warn('Could not create profile:', insertError);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback: set user with Supabase metadata
      const userData: User = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        avatar: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
      };
      setUser(userData);
      setIsLoading(false);
    }
  }

  // Initialize auth state from Supabase session
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Auth loading timeout - clearing loading state');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    // Check for existing session - use getSession() which handles OAuth redirects
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        clearTimeout(timeoutId);
        return;
      }

      console.log('Initial session check:', session?.user?.email || 'No session');

      if (session?.user) {
        console.log('Found session, loading user profile...');
        loadUserProfile(session.user).finally(() => {
          if (mounted) {
            clearTimeout(timeoutId);
          }
        });
      } else {
        console.log('No session found');
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.email || 'No user');
      
      // Handle all auth events that indicate user is signed in
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
        console.log('User signed in, loading profile...');
        clearTimeout(timeoutId);
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        clearTimeout(timeoutId);
        setUser(null);
        setIsLoading(false);
        // Clear localStorage on sign out
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('auth'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } else if (session?.user) {
        // Handle any other event with a session (e.g., INITIAL_SESSION)
        console.log('Session found in event, loading profile...');
        clearTimeout(timeoutId);
        await loadUserProfile(session.user);
      } else {
        // No session - clear loading
        console.log('No session in event');
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
      console.log(`Attempting ${provider} OAuth login...`);
      console.log('Redirect URL:', window.location.origin);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Auth error:', error);
        throw error;
      }

      console.log('OAuth redirect initiated:', data?.url);
      
      // Note: signInWithOAuth redirects the page, so code after this may not execute
      // User will be set via onAuthStateChange listener after redirect
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      setIsLoading(true);
      
      // Clear user state immediately
      setUser(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // Continue with logout even if signOut fails
      }
      
      // Clear all localStorage items related to Supabase
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear loading state
      setIsLoading(false);
      
      // Use replace instead of href to avoid hash fragments
      // Clear hash if present
      const url = window.location.origin + window.location.pathname;
      window.location.replace(url);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
      setIsLoading(false);
      
      // Clear localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Use replace to avoid hash fragments
      const url = window.location.origin + window.location.pathname;
      window.location.replace(url);
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

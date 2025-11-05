'use client';

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
    console.log('Loading user profile for:', supabaseUser.email);
    console.log('🔍 User metadata:', JSON.stringify(supabaseUser.user_metadata, null, 2));
    
    // CRITICAL: Set user immediately with Supabase metadata first
    // This prevents infinite loading if the profile query hangs
    // Google OAuth stores avatar in user_metadata.avatar_url or user_metadata.picture
    // Also check app_metadata which Google sometimes uses
    const avatarUrl = supabaseUser.user_metadata?.avatar_url || 
                      supabaseUser.user_metadata?.picture || 
                      supabaseUser.user_metadata?.avatar ||
                      supabaseUser.app_metadata?.avatar_url ||
                      supabaseUser.app_metadata?.picture ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`;
    
    console.log('🖼️ Avatar URL:', avatarUrl);
    
    const baseUserData: User = {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.full_name || 
            supabaseUser.user_metadata?.name ||
            supabaseUser.email?.split('@')[0] || 
            'User',
      email: supabaseUser.email || '',
      avatar: avatarUrl,
    };
    
    // Set user immediately so app can render
    setUser(baseUserData);
    setIsLoading(false);
    console.log('✅ User set immediately, loading profile data in background...');
    
    // Load profile data in background (non-blocking)
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (!error && profile) {
        // Update user with profile data if found
        const userData: User = {
          id: supabaseUser.id,
          name: profile.name || baseUserData.name,
          email: supabaseUser.email || '',
          avatar: profile.avatar_url || baseUserData.avatar,
        };
        setUser(userData);
        console.log('✅ User profile updated from database');
      } else if (error?.code === 'PGRST116') {
        // Profile doesn't exist - create it in background
        console.log('Profile not found, creating new one...');
        (async () => {
          try {
            await supabase.from('profiles').insert({
              id: supabaseUser.id,
              name: baseUserData.name,
              avatar_url: baseUserData.avatar,
              preferences: {},
            });
            console.log('Profile created successfully');
          } catch (insertError: any) {
            console.warn('Could not create profile:', insertError);
          }
        })();
      } else if (error?.code === '42P01') {
        console.warn('Profiles table does not exist. Please run database migrations.');
      } else {
        console.warn('Error loading profile:', error);
      }
    } catch (error) {
      // Profile query failed - but we already set user, so continue
      console.warn('Profile query failed (non-critical):', error);
    }
  }

  // Initialize auth state from Supabase session
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;
    let oAuthCallbackProcessed = false;

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted && !oAuthCallbackProcessed) {
        console.warn('Auth loading timeout - clearing loading state');
        setIsLoading(false);
      }
    }, 15000); // Increased to 15 seconds for OAuth callback

    // Check for existing session - use getSession() which handles OAuth redirects
    // For OAuth callbacks, also check the hash fragment
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const isOAuthCallback = hash.includes('access_token') || hash.includes('type=recovery');
    
    // CRITICAL: Set up onAuthStateChange listener FIRST, before processing OAuth callback
    // This ensures we catch the SIGNED_IN event when Supabase processes the hash
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      // Check if we're still in OAuth callback (hash might still be present)
      const currentHash = typeof window !== 'undefined' ? window.location.hash : '';
      const stillInOAuthCallback = currentHash.includes('access_token') || currentHash.includes('type=recovery');
      
      console.log('Auth state changed:', event, session?.user?.email || 'No user');
      
      // Handle all auth events that indicate user is signed in
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
        console.log('✅ User signed in, loading profile...', event);
        oAuthCallbackProcessed = true;
        clearTimeout(timeoutId);
        await loadUserProfile(session.user);
        
        // Clear hash fragment after successful login
        if (typeof window !== 'undefined' && window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else if (event === 'SIGNED_OUT') {
        // Only clear user if we're not in the middle of an OAuth callback
        if (!stillInOAuthCallback && !isOAuthCallback) {
          console.log('User signed out');
          clearTimeout(timeoutId);
          setUser(null);
          setIsLoading(false);
          // Clear localStorage on sign out
          if (typeof window !== 'undefined') {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && (key.includes('supabase') || key.includes('auth'))) {
                keysToRemove.push(key);
              }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
          }
        } else {
          console.log('SIGNED_OUT event during OAuth callback - ignoring (Supabase is processing token)');
        }
      } else if (session?.user) {
        // Handle any other event with a session (e.g., INITIAL_SESSION)
        console.log('Session found in event, loading profile...', event);
        clearTimeout(timeoutId);
        await loadUserProfile(session.user);
        // Ensure loading is cleared after profile loads
        if (mounted) {
          setIsLoading(false);
        }
      } else if (event === 'INITIAL_SESSION' && !session && !stillInOAuthCallback && !isOAuthCallback) {
        // Initial session check with no session - clear loading (but not during OAuth callback)
        console.log('No session in initial check');
        clearTimeout(timeoutId);
        setIsLoading(false);
      } else if (event === 'INITIAL_SESSION' && !session && (stillInOAuthCallback || isOAuthCallback)) {
        // During OAuth callback, INITIAL_SESSION might fire before token is processed
        console.log('INITIAL_SESSION during OAuth callback - waiting for SIGNED_IN event...');
        // Don't clear loading - wait for SIGNED_IN event
      }
    });
    
    // NOW process OAuth callback or check existing session
    if (isOAuthCallback) {
      console.log('OAuth callback detected - waiting for Supabase to process token...');
      oAuthCallbackProcessed = true;
      
      // CRITICAL: With detectSessionInUrl: true, Supabase will automatically process the hash
      // when it initializes. We should NOT call getSession() immediately - instead,
      // wait for Supabase to process the hash internally, then the SIGNED_IN event will fire
      // via onAuthStateChange listener we just set up.
      
      // Wait a moment for Supabase client to fully initialize and process the hash
      // The onAuthStateChange listener will catch the SIGNED_IN event
      setTimeout(() => {
        // After waiting, check if session was created
        supabase.auth.getSession().then(({ data: { session }, error }) => {
          if (!mounted) return;
          
          if (error) {
            console.error('Error getting session after OAuth:', error);
            // Still wait for onAuthStateChange - it might fire after processing
            setTimeout(() => {
              if (mounted && !user) {
                console.error('❌ OAuth callback failed after waiting');
                setIsLoading(false);
              }
            }, 5000);
            return;
          }

          console.log('Session check after OAuth wait:', session?.user?.email || 'No session');

          if (session?.user) {
            console.log('✅ Found session after OAuth callback, loading user profile...');
            loadUserProfile(session.user).finally(() => {
              if (mounted) {
                clearTimeout(timeoutId);
                // Clear hash fragment after successful login
                if (typeof window !== 'undefined' && window.location.hash) {
                  window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }
              }
            });
          } else {
            console.log('⚠️ No session yet - onAuthStateChange SIGNED_IN event should fire...');
            // Session will be processed asynchronously - onAuthStateChange listener will catch it
          }
        });
      }, 1000); // Wait 1 second for Supabase to process the hash internally
    } else {
      // Normal session check
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
          // Load profile and ensure loading is cleared even if onAuthStateChange fires
          loadUserProfile(session.user).finally(() => {
            if (mounted) {
              clearTimeout(timeoutId);
              setIsLoading(false); // Ensure loading is cleared
            }
          });
        } else {
          console.log('No session found');
          setIsLoading(false);
          clearTimeout(timeoutId);
        }
      });
    }

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (provider: 'google' | 'apple') => {
    try {
      console.log(`Attempting ${provider} OAuth login...`);
      
      // Use the full current URL as redirect - Supabase will append hash fragment
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
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
      if (typeof window !== 'undefined') {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('auth'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
      
      // Clear loading state
      setIsLoading(false);
      
      // Use replace instead of href to avoid hash fragments
      // Clear hash if present
      if (typeof window !== 'undefined') {
        const url = window.location.origin + window.location.pathname;
        window.location.replace(url);
      }
      
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
      setIsLoading(false);
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('auth'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
      
      // Use replace to avoid hash fragments
      if (typeof window !== 'undefined') {
        const url = window.location.origin + window.location.pathname;
        window.location.replace(url);
      }
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

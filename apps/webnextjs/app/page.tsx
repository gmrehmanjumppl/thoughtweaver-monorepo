'use client';

import { useEffect } from 'react';
import { useAuth, useNavigation } from '@/contexts';
import { SignupPage } from '@/components/auth/SignupPage';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/components/home/HomePage';
import { ConversationView } from '@/components/conversation/ConversationView';
import { ContextPage } from '@/components/context/ContextPage';
import { WorkflowBuilder } from '@/components/workflow/WorkflowBuilder';
import { WorkflowEditor } from '@/components/workflow/WorkflowEditor';
import { PreferencesPage } from '@/components/preferences/PreferencesPage';
import { BillingPage } from '@/components/billing/BillingPage';
import { SelectLLMsPage } from '@/components/llms/SelectLLMsPage';
import { TeamPage } from '@/components/team/TeamPage';
import { AccountPage } from '@/components/account/AccountPage';
import { AssistantCreator } from '@/components/assistant/AssistantCreator';
import { AIAssistantsPage } from '@/components/assistant/AIAssistantsPage';
import { AIAssistantEditor } from '@/components/assistant/AIAssistantEditor';
import { ProjectsPage } from '@/components/projects/ProjectsPage';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { currentPage, navigate } = useNavigation();

  // Clear hash fragment from URL after Supabase processes it (Supabase OAuth adds #)
  useEffect(() => {
    const hash = window.location.hash;
    
    // If hash contains access_token, wait longer for Supabase to process OAuth callback
    if (hash.includes('access_token')) {
      console.log('OAuth callback detected, waiting for session restoration...');
      // Don't clear hash immediately - let Supabase process it first
      // The hash will be cleared by Supabase after it processes the token
      const timer = setTimeout(() => {
        if (window.location.hash) {
          console.log('Clearing OAuth hash fragment after processing');
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }, 3000); // Wait 3 seconds for Supabase to process OAuth callback
      
      return () => clearTimeout(timer);
    } else if (hash) {
      // Immediately clear non-auth hash fragments (like after logout)
      console.log('Clearing hash fragment:', hash);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  // Navigate to home when user becomes authenticated
  useEffect(() => {
    // Wait a bit longer if we just came from OAuth callback
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const isOAuthCallback = hash.includes('access_token') || hash.includes('type=recovery');
    
    if (isAuthenticated && user) {
      // Force navigation to home if on signup page or no page set
      if (currentPage === 'signup' || currentPage === null || !currentPage) {
        console.log('Navigating to home after authentication');
        navigate('home');
      }
    } else if (!isAuthenticated && !isLoading && !isOAuthCallback) {
      // Only navigate to signup if NOT in the middle of OAuth callback
      // Give OAuth callback time to process (wait up to 5 seconds)
      const oAuthTimer = setTimeout(() => {
        if (!isAuthenticated && !isLoading && currentPage !== 'signup') {
          console.log('Navigating to signup (not authenticated, OAuth timeout)');
          navigate('signup');
        }
      }, isOAuthCallback ? 5000 : 0);
      
      if (!isOAuthCallback) {
        navigate('signup');
      }
      
      return () => clearTimeout(oAuthTimer);
    }
  }, [isAuthenticated, user, isLoading, currentPage, navigate]);

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show signup page if not authenticated
  if (!isAuthenticated) {
    return <SignupPage />;
  }

  // Render authenticated app with routing
  return (
    <AppLayout>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'conversation' && <ConversationView />}
      {currentPage === 'context' && <ContextPage />}
      {currentPage === 'workflow' && <WorkflowBuilder />}
      {currentPage?.startsWith('workflow-editor-') && (
        <WorkflowEditor workflowId={currentPage.replace('workflow-editor-', '')} />
      )}
      {currentPage === 'preferences' && <PreferencesPage />}
      {currentPage === 'billing' && <BillingPage />}
      {currentPage === 'llms' && <SelectLLMsPage />}
      {currentPage === 'team' && <TeamPage />}
      {currentPage === 'account' && <AccountPage />}
      {currentPage === 'assistant-creator' && <AssistantCreator />}
      {currentPage === 'ai-assistants' && <AIAssistantsPage />}
      {currentPage?.startsWith('ai-assistant-editor-') && (
        <AIAssistantEditor assistantId={currentPage.replace('ai-assistant-editor-', '')} />
      )}
      {currentPage === 'projects' && <ProjectsPage />}
    </AppLayout>
  );
}

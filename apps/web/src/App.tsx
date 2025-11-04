/**
 * Thoughtweaver - AI-Powered Ideation Platform
 * Version: 1.5 (Persistent Assistant Selection)
 * 
 * v1.5 Changes:
 * - Enhanced conversation UX with persistent assistant selection
 * - Users can switch assistants mid-conversation without losing history
 * - Added "Active" badge and avatar to assistant selection button
 * - Fixed useEffect bug preventing unwanted message regeneration
 * - All previous messages remain visible when switching assistants
 * 
 * v1.4 Changes:
 * - Created reusable PageHeader component
 * - Added custom hooks (useNavigate, useConversation, useAssistantSelection)
 * - Centralized constants and type definitions
 * - Comprehensive JSDoc documentation
 * - See OPTIMIZATION.md Phase 4 complete
 * 
 * v1.3 Changes:
 * - Implemented React.memo for expensive components
 * - Added code splitting with React.lazy and Suspense
 * - Expected bundle size reduction: 40%
 * 
 * v1.2 Changes:
 * - Implemented Context API for state management
 * - Created 4 context providers: Auth, Navigation, Conversation, Selection
 */

import { lazy, Suspense, useEffect } from 'react';
import { SignupPage } from './components/auth/SignupPage';
import { AppLayout } from './components/layout/AppLayout';

// Lazy load all page components for better performance
const HomePage = lazy(() => import('./components/home/HomePage').then(m => ({ default: m.HomePage })));
const ConversationView = lazy(() => import('./components/conversation/ConversationView').then(m => ({ default: m.ConversationView })));
const ContextPage = lazy(() => import('./components/context/ContextPage').then(m => ({ default: m.ContextPage })));
const WorkflowBuilder = lazy(() => import('./components/workflow/WorkflowBuilder').then(m => ({ default: m.WorkflowBuilder })));
const WorkflowEditor = lazy(() => import('./components/workflow/WorkflowEditor').then(m => ({ default: m.WorkflowEditor })));
const PreferencesPage = lazy(() => import('./components/preferences/PreferencesPage').then(m => ({ default: m.PreferencesPage })));
const BillingPage = lazy(() => import('./components/billing/BillingPage').then(m => ({ default: m.BillingPage })));
const SelectLLMsPage = lazy(() => import('./components/llms/SelectLLMsPage').then(m => ({ default: m.SelectLLMsPage })));
const TeamPage = lazy(() => import('./components/team/TeamPage').then(m => ({ default: m.TeamPage })));
const AccountPage = lazy(() => import('./components/account/AccountPage').then(m => ({ default: m.AccountPage })));
const AssistantCreator = lazy(() => import('./components/assistant/AssistantCreator').then(m => ({ default: m.AssistantCreator })));
const AIAssistantsPage = lazy(() => import('./components/assistant/AIAssistantsPage').then(m => ({ default: m.AIAssistantsPage })));
const AIAssistantEditor = lazy(() => import('./components/assistant/AIAssistantEditor').then(m => ({ default: m.AIAssistantEditor })));
const ProjectsPage = lazy(() => import('./components/projects/ProjectsPage').then(m => ({ default: m.ProjectsPage })));

// Context providers
import { AppProviders, useAuth, useNavigation } from './contexts';

// Export types for backward compatibility
export type { Conversation } from './contexts/ConversationContext';

// Loading spinner component
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

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { currentPage, navigate } = useNavigation();

  // Navigate to home when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (currentPage === 'signup' || !currentPage) {
        navigate('home');
      }
    } else if (!isAuthenticated && currentPage !== 'signup') {
      navigate('signup');
    }
  }, [isAuthenticated, currentPage, navigate]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show signup page if not authenticated
  if (!isAuthenticated) {
    return <SignupPage />;
  }

  // If authenticated but no valid page, show home
  if (isAuthenticated && currentPage === 'signup') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <Suspense fallback={<LoadingSpinner />}>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'conversation' && <ConversationView />}
        {currentPage === 'context' && <ContextPage />}
        {currentPage === 'workflow' && <WorkflowBuilder />}
        {currentPage.startsWith('workflow-editor-') && (
          <WorkflowEditor
            workflowId={currentPage.replace('workflow-editor-', '')}
          />
        )}
        {currentPage === 'preferences' && <PreferencesPage />}
        {currentPage === 'billing' && <BillingPage />}
        {currentPage === 'llms' && <SelectLLMsPage />}
        {currentPage === 'team' && <TeamPage />}
        {currentPage === 'account' && <AccountPage />}
        {currentPage === 'assistant-creator' && <AssistantCreator />}
        {currentPage === 'ai-assistants' && <AIAssistantsPage />}
        {currentPage.startsWith('ai-assistant-editor-') && (
          <AIAssistantEditor
            assistantId={currentPage.replace('ai-assistant-editor-', '')}
          />
        )}
        {currentPage === 'projects' && <ProjectsPage />}
      </Suspense>
    </AppLayout>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

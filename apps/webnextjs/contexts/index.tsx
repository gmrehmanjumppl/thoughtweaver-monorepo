'use client';

/**
 * Context Providers - v1.2 Architecture Refactoring
 * 
 * Centralized state management using React Context API
 * Eliminates prop drilling and improves component testability
 */

import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { NavigationProvider } from './NavigationContext';
import { ConversationProvider } from './ConversationContext';
import { SelectionProvider } from './SelectionContext';
import { ContextCardProvider } from './ContextCardContext';

// Export all contexts and hooks
export { useAuth } from './AuthContext';
export { useNavigation } from './NavigationContext';
export { useConversation } from './ConversationContext';
export { useSelection } from './SelectionContext';
export { useContextCards } from './ContextCardContext';

// Export types
export type { User } from './AuthContext';
export type { Page } from './NavigationContext';
export type { Conversation } from './ConversationContext';
export type { ContextCard } from './ContextCardContext';

/**
 * Combined provider that wraps all context providers
 * Usage: Wrap your app with <AppProviders> in App.tsx
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NavigationProvider>
        <ContextCardProvider>
          <SelectionProvider>
            <ConversationProvider>
              {children}
            </ConversationProvider>
          </SelectionProvider>
        </ContextCardProvider>
      </NavigationProvider>
    </AuthProvider>
  );
}

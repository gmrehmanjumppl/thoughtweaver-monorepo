/**
 * ContextCard Context
 * 
 * Manages context cards that can be referenced across conversations
 */

import { createContext, useContext, useState, ReactNode } from 'react';

export interface ContextCard {
  id: string;
  name: string;
  content: string;
  shared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ContextCardContextType {
  contexts: ContextCard[];
  selectedContextIds: string[];
  setSelectedContextIds: (ids: string[]) => void;
  addContext: (context: ContextCard) => void;
  updateContext: (id: string, updates: Partial<ContextCard>) => void;
  deleteContext: (id: string) => void;
  getContextById: (id: string) => ContextCard | undefined;
}

const ContextCardContext = createContext<ContextCardContextType | undefined>(undefined);

export function ContextCardProvider({ children }: { children: ReactNode }) {
  // Start with no contexts
  const [contexts, setContexts] = useState<ContextCard[]>([]);

  // Default to no context selected
  const [selectedContextIds, setSelectedContextIds] = useState<string[]>([]);

  const addContext = (context: ContextCard) => {
    setContexts(prev => [...prev, context]);
  };

  const updateContext = (id: string, updates: Partial<ContextCard>) => {
    setContexts(prev => prev.map(ctx => 
      ctx.id === id ? { ...ctx, ...updates, updatedAt: new Date() } : ctx
    ));
  };

  const deleteContext = (id: string) => {
    setContexts(prev => prev.filter(ctx => ctx.id !== id));
    setSelectedContextIds(prev => prev.filter(contextId => contextId !== id));
  };

  const getContextById = (id: string) => {
    return contexts.find(ctx => ctx.id === id);
  };

  return (
    <ContextCardContext.Provider
      value={{
        contexts,
        selectedContextIds,
        setSelectedContextIds,
        addContext,
        updateContext,
        deleteContext,
        getContextById,
      }}
    >
      {children}
    </ContextCardContext.Provider>
  );
}

export function useContextCards() {
  const context = useContext(ContextCardContext);
  if (context === undefined) {
    throw new Error('useContextCards must be used within a ContextCardProvider');
  }
  return context;
}

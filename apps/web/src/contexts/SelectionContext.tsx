import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { assistants as defaultAssistants } from '../components/assistant/assistantData';

interface SelectionContextType {
  selectedWorkflow: string;
  selectedAssistants: string[];
  selectedLLM: string;
  assistantOrder: string[];
  hiddenAssistants: string[];
  workflowOrder: string[];
  
  setSelectedWorkflow: (workflow: string) => void;
  setSelectedAssistants: (assistants: string[]) => void;
  toggleAssistant: (assistantId: string) => void;
  setSelectedLLM: (llm: string) => void;
  setAssistantOrder: (order: string[]) => void;
  toggleHiddenAssistant: (assistantId: string) => void;
  isAssistantHidden: (assistantId: string) => boolean;
  isAssistantSelected: (assistantId: string) => boolean;
  setWorkflowOrder: (order: string[]) => void;
  resetSelections: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

const DEFAULT_WORKFLOW = 'build-as-we-go';
const DEFAULT_ASSISTANTS = ['all-rounder'];
const DEFAULT_LLM = 'claude-sonnet-4.5';

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedWorkflow, setSelectedWorkflow] = useState(DEFAULT_WORKFLOW);
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>(DEFAULT_ASSISTANTS);
  const [selectedLLM, setSelectedLLM] = useState(DEFAULT_LLM);
  
  // Load assistant order from localStorage or use default
  const [assistantOrder, setAssistantOrderState] = useState<string[]>(() => {
    const saved = localStorage.getItem('assistantOrder');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultAssistants.map(a => a.id);
      }
    }
    return defaultAssistants.map(a => a.id);
  });

  // Load hidden assistants from localStorage
  const [hiddenAssistants, setHiddenAssistantsState] = useState<string[]>(() => {
    const saved = localStorage.getItem('hiddenAssistants');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Load workflow order from localStorage or use default (excluding AI-assisted workflow)
  const [workflowOrder, setWorkflowOrderState] = useState<string[]>(() => {
    const saved = localStorage.getItem('workflowOrder');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['strategic-ideation', 'critical-decision-making', 'rapid-problem-solving', 'content-creation-refinement', 'research-synthesis', 'board-of-advisors'];
      }
    }
    return ['strategic-ideation', 'critical-decision-making', 'rapid-problem-solving', 'content-creation-refinement', 'research-synthesis', 'board-of-advisors'];
  });

  // Persist assistant order to localStorage
  useEffect(() => {
    localStorage.setItem('assistantOrder', JSON.stringify(assistantOrder));
  }, [assistantOrder]);

  // Persist hidden assistants to localStorage
  useEffect(() => {
    localStorage.setItem('hiddenAssistants', JSON.stringify(hiddenAssistants));
  }, [hiddenAssistants]);

  // Persist workflow order to localStorage
  useEffect(() => {
    localStorage.setItem('workflowOrder', JSON.stringify(workflowOrder));
  }, [workflowOrder]);

  const setAssistantOrder = (order: string[]) => {
    setAssistantOrderState(order);
  };

  const setWorkflowOrder = (order: string[]) => {
    setWorkflowOrderState(order);
  };

  const toggleAssistant = (assistantId: string) => {
    setSelectedAssistants(prev => {
      if (prev.includes(assistantId)) {
        // Don't allow removing the last assistant
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== assistantId);
      } else {
        return [...prev, assistantId];
      }
    });
  };

  const toggleHiddenAssistant = (assistantId: string) => {
    setHiddenAssistantsState(prev => {
      if (prev.includes(assistantId)) {
        return prev.filter(id => id !== assistantId);
      } else {
        return [...prev, assistantId];
      }
    });
  };

  const isAssistantHidden = (assistantId: string) => {
    return hiddenAssistants.includes(assistantId);
  };

  const isAssistantSelected = (assistantId: string) => {
    return selectedAssistants.includes(assistantId);
  };

  const resetSelections = () => {
    setSelectedWorkflow(DEFAULT_WORKFLOW);
    setSelectedAssistants(DEFAULT_ASSISTANTS);
    setSelectedLLM(DEFAULT_LLM);
  };

  const value = {
    selectedWorkflow,
    selectedAssistants,
    selectedLLM,
    assistantOrder,
    hiddenAssistants,
    workflowOrder,
    setSelectedWorkflow,
    setSelectedAssistants,
    toggleAssistant,
    setSelectedLLM,
    setAssistantOrder,
    toggleHiddenAssistant,
    isAssistantHidden,
    isAssistantSelected,
    setWorkflowOrder,
    resetSelections,
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project } from '../components/projects/ProjectsPage';
import { conversationsApi } from '../lib/api/conversations.api';
import { useAuth } from './AuthContext';
import type { ApiConversation } from '@thoughtweaver/types';

export interface Conversation {
  id: string;
  title: string;
  prompt: string;
  workflow: string;
  assistants: string[];
  timestamp: Date;
  selectedLlm?: string;
  contextId?: string;
}

interface ConversationContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  currentPrompt: string;
  projects: Project[];
  isLoading: boolean;
  
  // Conversation actions
  createConversation: (prompt: string, workflow: string, assistants: string[], llm?: string, contextId?: string) => Promise<Conversation>;
  viewConversation: (conversationId: string) => void;
  updateConversationTitle: (conversationId: string, newTitle: string) => Promise<void>;
  setCurrentPrompt: (prompt: string) => void;
  getActiveConversation: () => Conversation | undefined;
  deleteConversation: (conversationId: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  
  // Project actions
  createProject: (name: string, description: string) => void;
  deleteProject: (projectId: string) => void;
  addConversationToProject: (conversationId: string, projectId: string) => void;
  removeConversationFromProject: (conversationId: string, projectId: string) => void;
  createConversationInProject: (projectId: string, workflow: string, assistants: string[]) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

// Helper function to generate a title from the prompt
const generateTitle = (prompt: string): string => {
  const cleanedPrompt = prompt.replace(/CONTEXT:\s*/gi, '').replace(/CHALLENGE:\s*/gi, '');
  const firstLine = cleanedPrompt.split('\n').find(line => line.trim().length > 0) || cleanedPrompt;
  const title = firstLine.substring(0, 60).trim();
  return title.length < firstLine.length ? title + '...' : title;
};

// Convert API conversation to local format
const mapApiConversation = (apiConv: ApiConversation): Conversation => ({
  id: apiConv.id,
  title: apiConv.title,
  prompt: apiConv.prompt,
  workflow: apiConv.workflow_id || '',
  assistants: apiConv.selected_assistants || [],
  timestamp: new Date(apiConv.created_at),
  selectedLlm: apiConv.selected_llm,
  contextId: apiConv.context_id,
});

export function ConversationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations from API
  const loadConversations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const apiConversations = await conversationsApi.getAll();
      const mappedConversations = apiConversations.map(mapApiConversation);
      setConversations(mappedConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load conversations when user is available
  // Use user?.id to prevent duplicate calls when user object reference changes
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id]); // Only depend on user ID, not entire user object

  const createConversation = async (
    prompt: string,
    workflow: string,
    assistants: string[],
    llm?: string,
    contextId?: string,
  ): Promise<Conversation> => {
    try {
      const title = generateTitle(prompt);
      const apiConversation = await conversationsApi.create({
        title,
        prompt,
        workflowId: workflow,
        selectedAssistants: assistants,
        selectedLlm: llm,
        contextId,
      });

      const newConversation = mapApiConversation(apiConversation);
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
      setCurrentPrompt(prompt);
      
      return newConversation;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  };

  const viewConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setActiveConversationId(conversationId);
      setCurrentPrompt(conversation.prompt);
    }
  };

  const updateConversationTitle = async (conversationId: string, newTitle: string) => {
    try {
      await conversationsApi.update(conversationId, { title: newTitle });
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, title: newTitle }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to update conversation title:', error);
      throw error;
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await conversationsApi.delete(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setCurrentPrompt('');
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      throw error;
    }
  };

  const getActiveConversation = () => {
    return conversations.find(c => c.id === activeConversationId);
  };

  // Project management
  const createProject = (name: string, description: string) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      conversationIds: [],
      createdAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const addConversationToProject = (conversationId: string, projectId: string) => {
    setProjects(prev =>
      prev.map(proj =>
        proj.id === projectId
          ? { ...proj, conversationIds: [...proj.conversationIds, conversationId] }
          : proj
      )
    );
  };

  const removeConversationFromProject = (conversationId: string, projectId: string) => {
    setProjects(prev =>
      prev.map(proj =>
        proj.id === projectId
          ? { ...proj, conversationIds: proj.conversationIds.filter(id => id !== conversationId) }
          : proj
      )
    );
  };

  const createConversationInProject = async (projectId: string, workflow: string, assistants: string[]) => {
    const prompt = `New conversation in project`;
    const newConversation = await createConversation(prompt, workflow, assistants);
    addConversationToProject(newConversation.id, projectId);
  };

  const value = {
    conversations,
    activeConversationId,
    currentPrompt,
    projects,
    isLoading,
    createConversation,
    viewConversation,
    updateConversationTitle,
    setCurrentPrompt,
    getActiveConversation,
    deleteConversation,
    refreshConversations: loadConversations,
    createProject,
    deleteProject,
    addConversationToProject,
    removeConversationFromProject,
    createConversationInProject,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
}

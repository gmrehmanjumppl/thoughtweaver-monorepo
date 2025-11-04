import { useState, useRef, useEffect, memo, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { SidebarTrigger } from '../ui/sidebar';
import { Progress } from '../ui/progress';
import { AVAILABLE_LLM_MODELS } from '../../constants';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  Lightbulb,
  Target,
  Zap,
  TrendingUp,
  Pencil,
  UserPlus,
  Share2,
  Paperclip,
  Mic,
  Send,
  Check,
  Cpu,
  Users,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Save,
  Sparkles,
  Search,
  AlertCircle,
  RefreshCw,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
} from 'lucide-react';
import { ContextView } from './ContextView';
import { AdaptiveWorkflowPanel } from './AdaptiveWorkflowPanel';
import allRounderAvatar from 'figma:asset/66df02ed14e51fbca9624ccbf86d6c66471695a9.png';
import creativeAvatar from 'figma:asset/554fa3f225599e9d74085e980bec2674888447d2.png';
import analyticalAvatar from 'figma:asset/dd66067f40eb374e0f675639f890289fb607d8f0.png';
import devilAdvocateAvatar from 'figma:asset/2e1615857ca91e0983178c6d9454a9bc816ba468.png';
import optimistAvatar from 'figma:asset/b20d2ead8618218f3f745bbfe7fbfca414f24e8e.png';
import { assistants as allAssistants } from '../assistant/assistantData';
import { useAuth, useNavigation, useConversation, useSelection } from '../../contexts';
import { PRESET_WORKFLOWS, WorkflowStepDefinition } from '../../constants/workflows';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  assistantId?: string;
  timestamp: Date;
  llmModel?: string;
}

interface MessageGroup {
  timestamp: Date;
  messages: Message[];
}

// Workflow Types
interface WorkflowRole {
  id: string;
  name: string;
  type: 'ai' | 'human';
  icon: any;
  description: string;
  suggestedAssistants: string[];
}

interface WorkflowStep {
  id: string;
  roleId: string;
  status: 'completed' | 'active' | 'suggested' | 'pending';
  assistantIds: string[];
  timestamp?: Date;
}

interface WorkflowSuggestion {
  id: string;
  roleId: string;
  message: string;
  recommendedAssistants: string[];
  trigger: string;
}

// Define Workflow Roles
const WORKFLOW_ROLES: WorkflowRole[] = [
  {
    id: 'frame',
    name: 'Frame',
    type: 'human',
    icon: Target,
    description: 'Define the problem and context clearly',
    suggestedAssistants: ['problem-statement-guide', 'all-rounder', 'visionary-strategist']
  },
  {
    id: 'ideate',
    name: 'Ideate',
    type: 'ai',
    icon: Lightbulb,
    description: 'Generate creative ideas and possibilities',
    suggestedAssistants: ['all-rounder', 'creative-innovator', 'visionary-strategist']
  },
  {
    id: 'challenge',
    name: 'Challenge',
    type: 'ai',
    icon: AlertCircle,
    description: 'Stress-test ideas and find potential issues',
    suggestedAssistants: ['devils-advocate', 'incisive-analyst', 'legal-analyst']
  },
  {
    id: 'analyze',
    name: 'Analyze',
    type: 'ai',
    icon: BarChart3,
    description: 'Deep dive into data and patterns',
    suggestedAssistants: ['data-analyst', 'incisive-analyst', 'diligent-researcher']
  },
  {
    id: 'refine',
    name: 'Refine',
    type: 'ai',
    icon: RefreshCw,
    description: 'Polish and improve the solution',
    suggestedAssistants: ['incisive-idea-improver', 'methodical-proofreader', 'writing-coach']
  },
  {
    id: 'present',
    name: 'Present',
    type: 'ai',
    icon: FileText,
    description: 'Package findings for communication',
    suggestedAssistants: ['speech-writer', 'persuasive-copywriter', 'public-relations-expert']
  },
  {
    id: 'find',
    name: 'Find',
    type: 'ai',
    icon: Search,
    description: 'Research and gather information',
    suggestedAssistants: ['diligent-researcher', 'science-communicator', 'seo-expert']
  },
  {
    id: 'check',
    name: 'Check',
    type: 'ai',
    icon: Shield,
    description: 'Verify accuracy and quality',
    suggestedAssistants: ['methodical-proofreader', 'legal-analyst', 'research-article-reviewer']
  },
];

// Use assistants from assistantData
const assistants = allAssistants.map(a => ({
  id: a.id,
  name: a.name,
  color: a.color,
  avatar: a.avatar
}));

// Memoized Message Component for Performance
const ConversationMessage = memo(({ 
  message, 
  getAssistant,
  userAvatar,
  userName,
  onReload,
  onRate
}: { 
  message: Message;
  getAssistant: (id: string) => any;
  userAvatar?: string;
  userName?: string;
  onReload?: (messageId: string) => void;
  onRate?: (messageId: string, rating: 'up' | 'down') => void;
}) => {
  const [rating, setRating] = useState<'up' | 'down' | null>(null);

  // System messages (workflow activation notifications)
  if (message.role === 'system') {
    return (
      <div className="flex justify-center">
        <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 max-w-md">
          <p className="text-sm text-purple-900 text-center">{message.content}</p>
        </div>
      </div>
    );
  }

  const handleRate = (ratingValue: 'up' | 'down') => {
    setRating(ratingValue);
    onRate?.(message.id, ratingValue);
  };

  return (
    <div
      className={`flex gap-4 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="flex flex-col items-center gap-1">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={getAssistant(message.assistantId!).avatar} />
            <AvatarFallback className={getAssistant(message.assistantId!).color}>
              {getAssistant(message.assistantId!).name[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500 text-center max-w-[80px] truncate">
            {getAssistant(message.assistantId!).name}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2 max-w-[70%]">
        <div
          className={`rounded-2xl px-4 py-3 ${
            message.role === 'user'
              ? 'bg-purple-500 text-white'
              : 'bg-white border border-gray-200'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {/* Action buttons for assistant messages */}
        {message.role === 'assistant' && (
          <div className="flex gap-2 px-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onReload?.(message.id)}
              title="Reload response"
            >
              <RotateCw className="w-3.5 h-3.5 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${rating === 'up' ? 'text-green-600' : ''}`}
              onClick={() => handleRate('up')}
              title="Good response"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${rating === 'down' ? 'text-red-600' : ''}`}
              onClick={() => handleRate('down')}
              title="Bad response"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {message.role === 'user' && (
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={userAvatar} />
          <AvatarFallback>{userName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});

// Adaptive Workflow Panel Component - Now in separate file: AdaptiveWorkflowPanel.tsx

export function ConversationView() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { currentPrompt, getActiveConversation, updateConversationTitle } = useConversation();
  const { selectedAssistants, selectedWorkflow, setSelectedWorkflow } = useSelection();
  
  const activeConversation = getActiveConversation();
  const initialTitle = activeConversation?.title;
  const [currentWorkflow, setCurrentWorkflow] = useState(activeConversation?.workflow || selectedWorkflow);
  const workflow = currentWorkflow;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState<string>(selectedAssistants[0] || 'all-rounder');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [conversationTitle, setConversationTitle] = useState(initialTitle || `${workflow.charAt(0).toUpperCase() + workflow.slice(1)} Session`);
  const [tempTitle, setTempTitle] = useState(conversationTitle);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [assistantDialogOpen, setAssistantDialogOpen] = useState(false);
  const [llmDialogOpen, setLlmDialogOpen] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState('claude-3-sonnet');
  
  // Workflow state
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [currentSuggestion, setCurrentSuggestion] = useState<WorkflowSuggestion | null>(null);
  const [saveWorkflowDialogOpen, setSaveWorkflowDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [selectedWorkflowAssistant, setSelectedWorkflowAssistant] = useState<string | null>(null);
  const [predefinedWorkflowStep, setPredefinedWorkflowStep] = useState(0);
  const [predefinedWorkflowStarted, setPredefinedWorkflowStarted] = useState(false);

  // Get assistant helper
  const getAssistant = (id: string) => assistants.find(a => a.id === id) || assistants[0];

  // Get pre-defined workflow if applicable  
  const presetWorkflow = PRESET_WORKFLOWS.find(w => w.id === workflow);
  const hasPresetSteps = presetWorkflow && presetWorkflow.steps.length > 0;

  const handleStartPredefinedWorkflow = () => {
    setPredefinedWorkflowStarted(true);
  };

  const handleNextWorkflowStep = () => {
    if (presetWorkflow && predefinedWorkflowStep < presetWorkflow.steps.length - 1) {
      setPredefinedWorkflowStep(prev => prev + 1);
    }
  };

  const saveWorkflow = () => {
    console.log('Saving workflow:', workflowName, workflowSteps);
    setSaveWorkflowDialogOpen(false);
    setWorkflowName('');
  };

  const selectAssistant = (assistantId: string) => {
    setActiveAssistant(assistantId);
  };

  const detectWorkflowOpportunity = (userMsgCount: number, lastUserMessage: string): WorkflowSuggestion | null => {
    const lowerMessage = lastUserMessage.toLowerCase();
    
    if (userMsgCount === 2 && !workflowSteps.some(s => s.roleId === 'ideate')) {
      return {
        id: `suggestion-${Date.now()}`,
        roleId: 'ideate',
        message: "Let's generate creative ideas and explore possibilities for your challenge.",
        recommendedAssistants: ['creative-innovator', 'visionary-strategist', 'all-rounder'],
        trigger: 'message-count'
      };
    }

    if (lowerMessage.includes('problem') || lowerMessage.includes('challenge')) {
      return {
        id: `suggestion-${Date.now()}`,
        roleId: 'analyze',
        message: "I notice you're working on a problem. Let's analyze this in depth.",
        recommendedAssistants: ['incisive-analyst', 'data-analyst', 'diligent-researcher'],
        trigger: 'keyword'
      };
    }
    
    return null;
  };

  const activateSuggestion = (suggestion: WorkflowSuggestion, assistantId: string) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      roleId: suggestion.roleId,
      status: 'active',
      assistantIds: [assistantId],
      timestamp: new Date()
    };
    
    setWorkflowSteps(prev => [...prev.map(s => ({ ...s, status: 'completed' as const })), newStep]);
    setCurrentSuggestion(null);
    setSelectedWorkflowAssistant(null);
    
    setActiveAssistant(assistantId);
  };

  const handleActivateSuggestion = (suggestion: WorkflowSuggestion, assistantId: string | null) => {
    if (assistantId) {
      activateSuggestion(suggestion, assistantId);
    }
  };

  const handleSkipSuggestion = () => {
    setCurrentSuggestion(null);
    setSelectedWorkflowAssistant(null);
  };

  const handleSelectWorkflowAssistant = (assistantId: string) => {
    setSelectedWorkflowAssistant(assistantId);
  };

  const handleSaveWorkflow = () => {
    setSaveWorkflowDialogOpen(true);
  };

  const handleSwitchWorkflow = (newWorkflowId: string) => {
    setCurrentWorkflow(newWorkflowId);
    setSelectedWorkflow(newWorkflowId);
    setPredefinedWorkflowStep(0);
    setPredefinedWorkflowStarted(false);
    
    // Add a system message to notify user of workflow change
    const systemMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'system',
      content: `Switched to ${PRESET_WORKFLOWS.find(w => w.id === newWorkflowId)?.name} workflow`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUserMessageCount(prev => prev + 1);

    const opportunity = detectWorkflowOpportunity(userMessageCount + 1, userMessage.content);
    if (opportunity && !currentSuggestion) {
      setCurrentSuggestion(opportunity);
      if (opportunity.recommendedAssistants.length > 0) {
        setSelectedWorkflowAssistant(opportunity.recommendedAssistants[0]);
      }
    }

    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `This is a simulated response from ${getAssistant(activeAssistant).name}. In a real app, this would be powered by the selected LLM (${selectedLLM}).`,
        assistantId: activeAssistant,
        timestamp: new Date(),
        llmModel: selectedLLM
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleReloadMessage = (messageId: string) => {
    console.log('Reloading message:', messageId);
  };

  const handleRateMessage = (messageId: string, rating: 'up' | 'down') => {
    console.log(`Message ${messageId} rated:`, rating);
  };

  useEffect(() => {
    if (currentPrompt && messages.length === 0) {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: currentPrompt,
        timestamp: new Date()
      };

      setMessages([userMessage]);
      setUserMessageCount(1);
      setIsTyping(true);

      setTimeout(() => {
        const aiMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `Great! Let's work on this together. I'll help you ${workflow === 'brainstorm' ? 'brainstorm ideas' : workflow === 'problem-solving' ? 'solve this problem' : 'analyze this'}.`,
          assistantId: activeAssistant,
          timestamp: new Date(),
          llmModel: selectedLLM
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);
    }
  }, [currentPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const groupedMessages = useMemo(() => {
    const groups: MessageGroup[] = [];
    messages.forEach(msg => {
      const lastGroup = groups[groups.length - 1];
      const timeDiff = lastGroup 
        ? (msg.timestamp.getTime() - lastGroup.timestamp.getTime()) / 1000 / 60
        : 999;

      if (timeDiff > 5 || !lastGroup) {
        groups.push({
          timestamp: msg.timestamp,
          messages: [msg]
        });
      } else {
        lastGroup.messages.push(msg);
      }
    });
    return groups;
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">{/* Main Content - Scrollable conversation area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center - Conversation */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div>
                  {isEditingTitle ? (
                    <Input
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={() => {
                        setConversationTitle(tempTitle);
                        updateConversationTitle(tempTitle);
                        setIsEditingTitle(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setConversationTitle(tempTitle);
                          updateConversationTitle(tempTitle);
                          setIsEditingTitle(false);
                        }
                      }}
                      className="h-8"
                      autoFocus
                    />
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-gray-900">{conversationTitle}</h1>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setIsEditingTitle(true)}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date().toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-6 space-y-8">
              {groupedMessages.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-4">
                  <div className="flex justify-center">
                    <span className="text-xs text-gray-500">
                      {group.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {group.messages.map(message => (
                    <ConversationMessage
                      key={message.id}
                      message={message}
                      getAssistant={getAssistant}
                      userAvatar={user?.avatar}
                      userName={user?.name}
                      onReload={handleReloadMessage}
                      onRate={handleRateMessage}
                    />
                  ))}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={getAssistant(activeAssistant).avatar} />
                      <AvatarFallback className={getAssistant(activeAssistant).color}>
                        {getAssistant(activeAssistant).name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500 text-center max-w-[80px] truncate">
                      {getAssistant(activeAssistant).name}
                    </span>
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Fixed Input Area */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white">
            <div className="max-w-4xl mx-auto px-6 py-4">
              {/* Assistant and LLM Buttons */}
              <div className="flex items-center gap-3 mb-3">
                <Dialog open={assistantDialogOpen} onOpenChange={setAssistantDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={getAssistant(activeAssistant).avatar} />
                        <AvatarFallback className={getAssistant(activeAssistant).color}>
                          {getAssistant(activeAssistant).name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{getAssistant(activeAssistant).name}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[70vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Select Assistant</DialogTitle>
                      <DialogDescription>
                        Choose which AI assistant should respond to your next message.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 mt-4 overflow-y-auto pr-2">
                      {assistants.map(assistant => (
                        <button
                          key={assistant.id}
                          onClick={() => {
                            selectAssistant(assistant.id);
                            setAssistantDialogOpen(false);
                          }}
                          className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left w-full ${
                            activeAssistant === assistant.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={assistant.avatar} />
                            <AvatarFallback className={assistant.color}>
                              {assistant.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{assistant.name}</span>
                              {activeAssistant === assistant.id && (
                                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{assistant.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={llmDialogOpen} onOpenChange={setLlmDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Cpu className="w-4 h-4" />
                      <span>{AVAILABLE_LLM_MODELS.find(m => m.id === selectedLLM)?.name || 'Select LLM'}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Select LLM Model</DialogTitle>
                      <DialogDescription>
                        Choose which language model powers your assistant's responses.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                      {AVAILABLE_LLM_MODELS.map(model => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedLLM(model.id);
                            setLlmDialogOpen(false);
                          }}
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left w-full ${
                            selectedLLM === model.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{model.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {model.provider}
                              </Badge>
                              {selectedLLM === model.id && (
                                <CheckCircle2 className="w-4 h-4 text-purple-600 ml-auto" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{model.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Input Box */}
              <div className="relative">
                <Textarea
                  placeholder="Ask a question, or add more context"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="pr-24 resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSendMessage();
                    }
                  }}
                />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar - Adaptive Workflow Assistant - Always visible, fixed */}
        <div className="hidden lg:flex lg:flex-col w-80 border-l border-gray-200 bg-white overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <AdaptiveWorkflowPanel
              workflowSteps={workflowSteps}
              currentSuggestion={currentSuggestion}
              onActivateSuggestion={handleActivateSuggestion}
              onSkipSuggestion={handleSkipSuggestion}
              onSaveWorkflow={handleSaveWorkflow}
              getAssistant={getAssistant}
              selectedAssistantId={selectedWorkflowAssistant}
              onSelectAssistant={handleSelectWorkflowAssistant}
              workflowId={workflow}
              onStartWorkflow={handleStartPredefinedWorkflow}
              currentStepIndex={predefinedWorkflowStep}
              onSwitchWorkflow={handleSwitchWorkflow}
              userMessageCount={userMessageCount}
            />
          </div>
        </div>
      </div>

      {/* Save Workflow Dialog */}
      <Dialog open={saveWorkflowDialogOpen} onOpenChange={setSaveWorkflowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Workflow</DialogTitle>
            <DialogDescription>
              Give your workflow a name to save it for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Workflow Name</label>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="e.g., Product Launch Strategy"
                className="mt-1"
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Workflow Steps ({workflowSteps.length})</h4>
              <div className="space-y-2">
                {workflowSteps.map((step, idx) => {
                  const role = WORKFLOW_ROLES.find(r => r.id === step.roleId);
                  return (
                    <div key={step.id} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">{idx + 1}.</span>
                      <span className="text-gray-900">{role?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveWorkflowDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveWorkflow} disabled={!workflowName.trim()}>
              Save Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

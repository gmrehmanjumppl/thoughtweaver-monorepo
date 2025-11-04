import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { AVAILABLE_LLM_MODELS } from '../../constants';
import { 
  ArrowLeft,
  Plus,
  GripVertical,
  X,
  Save,
  ArrowRight,
  Sparkles,
  User,
  Users,
  Lightbulb,
  Target,
  Zap,
  FileText,
  Search,
  Cpu,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useAuth, useNavigation, useSelection } from '../../contexts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { assistants } from '../assistant/assistantData';

interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  role?: string; // New: predefined role
  roleType: 'ai' | 'human';
  description: string;
  assistantId?: string;
  llmModel?: string;
  promptTemplate?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isPreset: boolean;
  steps: WorkflowStep[];
}

const iconMap = {
  Lightbulb,
  Target,
  Zap,
  FileText,
  Search,
  Sparkles,
  Users,
};

const colorOptions = [
  { value: 'Purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'Blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'Amber', label: 'Amber', class: 'bg-amber-500' },
  { value: 'Emerald', label: 'Emerald', class: 'bg-emerald-500' },
  { value: 'Cyan', label: 'Cyan', class: 'bg-cyan-500' },
];

const iconOptions = [
  { value: 'Lightbulb', label: 'Lightbulb', Icon: Lightbulb },
  { value: 'Target', label: 'Target', Icon: Target },
  { value: 'Zap', label: 'Zap', Icon: Zap },
  { value: 'FileText', label: 'File Text', Icon: FileText },
  { value: 'Search', label: 'Search', Icon: Search },
  { value: 'Sparkles', label: 'Sparkles', Icon: Sparkles },
  { value: 'Users', label: 'Users', Icon: Users },
];

// Predefined roles with templates
const roleTemplates = [
  {
    id: 'frame',
    name: 'Frame',
    description: 'Define problem, objectives, constraints',
    promptTemplate: 'What problem are we trying to solve? What are the objectives and constraints?',
    defaultAssistant: undefined,
    defaultModel: undefined,
  },
  {
    id: 'ideate',
    name: 'Ideate',
    description: 'Generate creative and innovative solutions',
    promptTemplate: 'Generate innovative ideas for [problem]. Consider multiple approaches and unconventional solutions.',
    defaultAssistant: 'creative-innovator',
    defaultModel: 'claude-3-sonnet',
  },
  {
    id: 'assess',
    name: 'Assess',
    description: 'Evaluate feasibility and alignment',
    promptTemplate: 'Review the generated ideas. Which ones are feasible? Which align with our objectives?',
    defaultAssistant: undefined,
    defaultModel: undefined,
  },
  {
    id: 'refine',
    name: 'Refine',
    description: 'Polish and improve selected concepts',
    promptTemplate: 'Refine the selected ideas. Improve clarity, strengthen value proposition, and address potential concerns.',
    defaultAssistant: 'writing-coach',
    defaultModel: 'gpt-4',
  },
  {
    id: 'synthesize',
    name: 'Synthesize',
    description: 'Select and integrate best concepts',
    promptTemplate: 'Combine the best elements from multiple ideas into a cohesive solution.',
    defaultAssistant: undefined,
    defaultModel: undefined,
  },
  {
    id: 'analyze',
    name: 'Analyze',
    description: 'Deep dive into data and patterns',
    promptTemplate: 'Analyze the provided information. Identify key patterns, insights, and relationships.',
    defaultAssistant: 'logic-analyst',
    defaultModel: 'claude-3-opus',
  },
  {
    id: 'critique',
    name: 'Critique',
    description: 'Identify weaknesses and risks',
    promptTemplate: 'Critically evaluate this idea. What are the potential weaknesses, risks, and blind spots?',
    defaultAssistant: 'devils-advocate',
    defaultModel: 'gpt-4',
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Gather relevant information and context',
    promptTemplate: 'Research relevant information about [topic]. Provide key facts, context, and background.',
    defaultAssistant: 'research-assistant',
    defaultModel: 'gemini-pro',
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm',
    description: 'Generate diverse ideas quickly',
    promptTemplate: 'Brainstorm as many ideas as possible for [topic]. Focus on quantity and variety over quality.',
    defaultAssistant: 'creative-innovator',
    defaultModel: 'claude-3-sonnet',
  },
  {
    id: 'decide',
    name: 'Decide',
    description: 'Make final selection or judgment',
    promptTemplate: 'Review all options and make a decision. What is the best path forward?',
    defaultAssistant: undefined,
    defaultModel: undefined,
  },
  {
    id: 'plan',
    name: 'Plan',
    description: 'Create actionable steps and timeline',
    promptTemplate: 'Create a detailed action plan for implementing this solution. Include steps, timeline, and resources.',
    defaultAssistant: 'strategic-advisor',
    defaultModel: 'claude-3-sonnet',
  },
  {
    id: 'review',
    name: 'Review',
    description: 'Evaluate progress and quality',
    promptTemplate: 'Review the work completed so far. What is working well? What needs improvement?',
    defaultAssistant: undefined,
    defaultModel: undefined,
  },
  {
    id: 'optimize',
    name: 'Optimize',
    description: 'Improve efficiency and effectiveness',
    promptTemplate: 'Optimize this solution for better efficiency, cost, or effectiveness. Suggest specific improvements.',
    defaultAssistant: 'logic-analyst',
    defaultModel: 'claude-3-opus',
  },
  {
    id: 'summarize',
    name: 'Summarize',
    description: 'Distill key points and conclusions',
    promptTemplate: 'Summarize the key points, decisions, and next steps from this discussion.',
    defaultAssistant: 'writing-coach',
    defaultModel: 'gpt-4',
  },
  {
    id: 'moderate',
    name: 'Moderate',
    description: 'Guide and facilitate the discussion',
    promptTemplate: 'Moderate the discussion by introducing topics, synthesizing viewpoints, and keeping the conversation productive.',
    defaultAssistant: 'all-rounder',
    defaultModel: 'claude-3-sonnet',
  },
];

// Default workflows data (same as WorkflowBuilder.tsx)
const defaultWorkflows: Workflow[] = [
  {
    id: 'build-as-we-go',
    name: 'AI-assisted workflow',
    description: 'Explore ideas naturally without a predefined structure',
    icon: 'Sparkles',
    color: 'Purple',
    isPreset: true,
    steps: [],
  },
  {
    id: 'strategic-ideation',
    name: 'Strategic Ideation',
    description: 'Generate and refine innovative solutions through structured creative thinking',
    icon: 'Lightbulb',
    color: 'Purple',
    isPreset: true,
    steps: [
      {
        id: 'si-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Define problem, objectives, constraints',
        assistantId: undefined,
        llmModel: undefined,
      },
      {
        id: 'si-2',
        order: 2,
        name: 'Ideate',
        roleType: 'ai',
        description: 'Generate creative and innovative solutions',
        assistantId: 'creative-innovator',
        llmModel: 'claude-3-sonnet',
        promptTemplate: 'Generate innovative ideas for [problem]. Consider multiple approaches and unconventional solutions.',
      },
      {
        id: 'si-3',
        order: 3,
        name: 'Assess',
        roleType: 'human',
        description: 'Evaluate feasibility and alignment',
        assistantId: undefined,
        llmModel: undefined,
      },
      {
        id: 'si-4',
        order: 4,
        name: 'Refine',
        roleType: 'ai',
        description: 'Polish and improve selected concepts',
        assistantId: 'writing-coach',
        llmModel: 'gpt-4',
        promptTemplate: 'Refine the selected ideas. Improve clarity, strengthen value proposition, and address potential concerns.',
      },
      {
        id: 'si-5',
        order: 5,
        name: 'Synthesise',
        roleType: 'human',
        description: 'Select and integrate best concepts',
        assistantId: undefined,
        llmModel: undefined,
      },
    ],
  },
  {
    id: 'board-of-advisors',
    name: 'Board of Advisors',
    description: 'Present questions to a panel of expert assistants for diverse perspectives',
    icon: 'Users',
    color: 'Emerald',
    isPreset: true,
    steps: [
      {
        id: 'boa-1',
        order: 1,
        name: 'Moderate',
        roleType: 'ai',
        description: 'Introduce the topic and frame the discussion',
        assistantId: 'all-rounder',
        llmModel: 'claude-3-sonnet',
        promptTemplate: 'Welcome the board and introduce the topic: [topic]. Frame the key questions to be discussed.',
      },
      {
        id: 'boa-2',
        order: 2,
        name: 'Question 1',
        roleType: 'human',
        description: 'Present first question to the board',
        assistantId: undefined,
        llmModel: undefined,
      },
      {
        id: 'boa-3',
        order: 3,
        name: 'Strategist Perspective',
        roleType: 'ai',
        description: 'Strategic viewpoint on the question',
        assistantId: 'visionary-strategist',
        llmModel: 'claude-3-opus',
        promptTemplate: 'Provide a strategic perspective on this question, considering long-term implications and opportunities.',
      },
      {
        id: 'boa-4',
        order: 4,
        name: 'Critical Analysis',
        roleType: 'ai',
        description: 'Challenge assumptions and identify risks',
        assistantId: 'devils-advocate',
        llmModel: 'gpt-4',
        promptTemplate: 'Challenge the assumptions in the question. What risks or alternative viewpoints should be considered?',
      },
      {
        id: 'boa-5',
        order: 5,
        name: 'Creative Solutions',
        roleType: 'ai',
        description: 'Generate innovative approaches',
        assistantId: 'creative-innovator',
        llmModel: 'claude-3-sonnet',
        promptTemplate: 'Suggest creative and unconventional solutions or approaches to this question.',
      },
      {
        id: 'boa-6',
        order: 6,
        name: 'Moderate',
        roleType: 'ai',
        description: 'Synthesize insights from advisors',
        assistantId: 'all-rounder',
        llmModel: 'claude-3-sonnet',
        promptTemplate: 'Summarize the key insights from the advisors and identify common themes or points of disagreement.',
      },
      {
        id: 'boa-7',
        order: 7,
        name: 'Question 2',
        roleType: 'human',
        description: 'Present second question to the board',
        assistantId: undefined,
        llmModel: undefined,
      },
      {
        id: 'boa-8',
        order: 8,
        name: 'Data-Driven View',
        roleType: 'ai',
        description: 'Analytical perspective with data focus',
        assistantId: 'data-analyst',
        llmModel: 'claude-3-opus',
        promptTemplate: 'Analyze this question from a data-driven perspective. What metrics or evidence should inform the decision?',
      },
      {
        id: 'boa-9',
        order: 9,
        name: 'Product Perspective',
        roleType: 'ai',
        description: 'Product and user-focused viewpoint',
        assistantId: 'product-manager',
        llmModel: 'gpt-4',
        promptTemplate: 'Consider this question from a product and user experience perspective. What would best serve the end users?',
      },
      {
        id: 'boa-10',
        order: 10,
        name: 'Moderate',
        roleType: 'ai',
        description: 'Final synthesis and recommendations',
        assistantId: 'all-rounder',
        llmModel: 'claude-3-sonnet',
        promptTemplate: 'Provide a final synthesis of all perspectives shared. Offer balanced recommendations based on the board discussion.',
      },
    ],
  },
  {
    id: 'critical-decision-making',
    name: 'Critical Decision Making',
    description: 'Evaluate options and make informed decisions with comprehensive analysis',
    icon: 'Target',
    color: 'Blue',
    isPreset: true,
    steps: [
      {
        id: 'cdm-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Define decision criteria',
        assistantId: undefined,
        llmModel: undefined,
      },
      {
        id: 'cdm-2',
        order: 2,
        name: 'Generate',
        roleType: 'ai',
        description: 'Identify all possible options',
        assistantId: 'all-rounder',
        llmModel: 'claude-3-sonnet',
        promptTemplate: 'Generate comprehensive list of options for [decision]. Include conventional and alternative approaches.',
      },
      {
        id: 'cdm-3',
        order: 3,
        name: 'Analyze',
        roleType: 'ai',
        description: 'Evaluate each option systematically',
        assistantId: 'data-analyst',
        llmModel: 'claude-3-opus',
        promptTemplate: 'Analyze each option considering: feasibility, costs, risks, benefits, and long-term implications.',
      },
      {
        id: 'cdm-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Question assumptions and identify risks',
        assistantId: 'devils-advocate',
        llmModel: 'gpt-4',
        promptTemplate: 'Challenge the analysis. What assumptions might be wrong? What risks are overlooked?',
      },
      {
        id: 'cdm-5',
        order: 5,
        name: 'Assess',
        roleType: 'human',
        description: 'Make final decision',
        assistantId: undefined,
        llmModel: undefined,
      },
      {
        id: 'cdm-6',
        order: 6,
        name: 'Present',
        roleType: 'ai',
        description: 'Document decision rationale',
        assistantId: 'writing-coach',
        llmModel: 'gpt-4',
        promptTemplate: 'Present the decision and rationale in a clear, compelling format for stakeholders.',
      },
    ],
  },
  {
    id: 'rapid-problem-solving',
    name: 'Rapid Problem Solving',
    description: 'Quickly diagnose and solve problems with tactical precision',
    icon: 'Zap',
    color: 'Amber',
    isPreset: true,
    steps: [
      {
        id: 'rps-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Describe problem and impact',
        assistantId: undefined,
        llmModel: undefined,
      },
      {
        id: 'rps-2',
        order: 2,
        name: 'Analyze',
        roleType: 'ai',
        description: 'Diagnose root causes',
        assistantId: 'data-analyst',
        llmModel: 'claude-3-opus',
        promptTemplate: 'Analyze the problem systematically. Identify root causes, contributing factors, and patterns.',
      },
      {
        id: 'rps-3',
        order: 3,
        name: 'Generate',
        roleType: 'ai',
        description: 'Propose tactical solutions',
        assistantId: 'tech-troubleshooter',
        llmModel: 'claude-3-sonnet',
        promptTemplate: 'Generate practical solutions that address the root causes. Focus on quick wins and sustainable fixes.',
      },
      {
        id: 'rps-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Stress-test proposed solutions',
        assistantId: 'devils-advocate',
        llmModel: 'gpt-4',
        promptTemplate: 'Challenge the proposed solutions. What could go wrong? What are we missing?',
      },
      {
        id: 'rps-5',
        order: 5,
        name: 'Curate',
        roleType: 'human',
        description: 'Select best solution',
        assistantId: undefined,
        llmModel: undefined,
      },
      {
        id: 'rps-6',
        order: 6,
        name: 'Refine',
        roleType: 'ai',
        description: 'Detail implementation plan',
        assistantId: 'all-rounder',
        llmModel: 'claude-3-sonnet',
        promptTemplate: 'Refine the selected solution into a detailed action plan with steps, timeline, and resources needed.',
      },
    ],
  },
  {
    id: 'content-creation-refinement',
    name: 'Content Creation & Refinement',
    description: 'Develop polished written content from concept to final draft',
    icon: 'FileText',
    color: 'Emerald',
    isPreset: true,
    steps: [
      {
        id: 'ccr-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Define audience, purpose, tone',
        assistantId: undefined,
        llmModel: undefined,
      },
      {
        id: 'ccr-2',
        order: 2,
        name: 'Generate',
        roleType: 'ai',
        description: 'Create initial draft',
        assistantId: 'writing-coach',
        llmModel: 'gpt-4',
        promptTemplate: 'Generate [content type] for [audience] about [topic]. Tone: [tone]. Key points: [points].',
      },
      {
        id: 'ccr-3',
        order: 3,
        name: 'Check',
        roleType: 'ai',
        description: 'Verify accuracy and clarity',
        assistantId: 'methodical-proofreader',
        llmModel: 'claude-3-sonnet',
        promptTemplate: 'Review the content for accuracy, clarity, and potential issues. Check facts and claims.',
      },
      {
        id: 'ccr-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Critique messaging and effectiveness',
        assistantId: 'devils-advocate',
        llmModel: 'gpt-4',
        promptTemplate: 'Critique the content. Is the message clear? Will it resonate with the audience? What could be improved?',
      },
      {
        id: 'ccr-5',
        order: 5,
        name: 'Refine',
        roleType: 'ai',
        description: 'Polish and perfect the content',
        assistantId: 'writing-coach',
        llmModel: 'gpt-4',
        promptTemplate: 'Refine the content based on feedback. Improve flow, strengthen arguments, polish language.',
      },
      {
        id: 'ccr-6',
        order: 6,
        name: 'Assess',
        roleType: 'human',
        description: 'Final approval',
        assistantId: undefined,
        llmModel: undefined,
      },
    ],
  },
  {
    id: 'research-synthesis',
    name: 'Research & Synthesis',
    description: 'Deep dive into topics and synthesize insights into actionable understanding',
    icon: 'Search',
    color: 'Cyan',
    isPreset: true,
    steps: [
      {
        id: 'rs-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Define research questions',
        assistantId: undefined,
        llmModel: undefined,
      },
      {
        id: 'rs-2',
        order: 2,
        name: 'Research',
        roleType: 'ai',
        description: 'Gather information systematically',
        assistantId: 'diligent-researcher',
        llmModel: 'gemini-pro',
        promptTemplate: 'Research [topic]. Gather key facts, theories, and perspectives from multiple sources.',
      },
      {
        id: 'rs-3',
        order: 3,
        name: 'Analyze',
        roleType: 'ai',
        description: 'Identify patterns and insights',
        assistantId: 'data-analyst',
        llmModel: 'claude-3-opus',
        promptTemplate: 'Analyze the research. Identify patterns, connections, gaps, and key insights.',
      },
      {
        id: 'rs-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Question conclusions and assumptions',
        assistantId: 'devils-advocate',
        llmModel: 'gpt-4',
        promptTemplate: 'Challenge the analysis. What biases might exist? What alternative interpretations are possible?',
      },
      {
        id: 'rs-5',
        order: 5,
        name: 'Synthesise',
        roleType: 'ai',
        description: 'Create cohesive understanding',
        assistantId: 'all-rounder',
        llmModel: 'claude-3-sonnet',
        promptTemplate: 'Synthesize findings into a clear, actionable understanding. Connect insights and draw conclusions.',
      },
      {
        id: 'rs-6',
        order: 6,
        name: 'Assess',
        roleType: 'human',
        description: 'Review and finalize',
        assistantId: undefined,
        llmModel: undefined,
      },
    ],
  },
];

export function WorkflowEditor({ workflowId }: { workflowId: string }) {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { selectedWorkflow, setSelectedWorkflow } = useSelection();
  
  // Redirect if trying to edit AI-assisted workflow
  useEffect(() => {
    if (workflowId === 'build-as-we-go') {
      navigate('workflow');
    }
  }, [workflowId, navigate]);
  
  // Find existing workflow or create new one
  const existingWorkflow = defaultWorkflows.find(w => w.id === workflowId);
  const isNewWorkflow = workflowId === 'new';
  
  // Track which steps are being edited
  const [editingSteps, setEditingSteps] = useState<Set<string>>(new Set());
  
  // Track whether preview card is opened (closed by default)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stepToDelete, setStepToDelete] = useState<string | null>(null);
  
  // Track temporary edit values for each step
  const [tempStepData, setTempStepData] = useState<{ [key: string]: WorkflowStep }>({});
  
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow>(() => {
    if (isNewWorkflow) {
      return {
        id: `custom-${Date.now()}`,
        name: 'Add Workflow',
        description: 'Custom workflow description',
        icon: 'Lightbulb',
        color: 'Purple',
        isPreset: false,
        steps: [
          {
            id: '1',
            order: 1,
            name: 'Step 1',
            roleType: 'human',
            description: 'First step description',
            assistantId: undefined,
            llmModel: undefined,
            promptTemplate: ''
          }
        ]
      };
    }
    return existingWorkflow || {
      id: `custom-${Date.now()}`,
      name: 'Add Workflow',
      description: 'Custom workflow description',
      icon: 'Lightbulb',
      color: 'Purple',
      isPreset: false,
      steps: []
    };
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const startEditingStep = (step: WorkflowStep) => {
    setTempStepData(prev => ({ ...prev, [step.id]: { ...step } }));
    setEditingSteps(prev => new Set(prev).add(step.id));
  };
  
  const saveStep = (stepId: string) => {
    const tempData = tempStepData[stepId];
    if (tempData) {
      setEditingWorkflow({
        ...editingWorkflow,
        steps: editingWorkflow.steps.map(s => s.id === stepId ? tempData : s)
      });
    }
    setEditingSteps(prev => {
      const newSet = new Set(prev);
      newSet.delete(stepId);
      return newSet;
    });
    setTempStepData(prev => {
      const newData = { ...prev };
      delete newData[stepId];
      return newData;
    });
  };
  
  const cancelEditingStep = (stepId: string) => {
    setEditingSteps(prev => {
      const newSet = new Set(prev);
      newSet.delete(stepId);
      return newSet;
    });
    setTempStepData(prev => {
      const newData = { ...prev };
      delete newData[stepId];
      return newData;
    });
  };

  const addStep = () => {
    const newStepId = Date.now().toString();
    const firstRole = roleTemplates[0];
    const newStep: WorkflowStep = {
      id: newStepId,
      order: editingWorkflow.steps.length + 1,
      role: firstRole.id,
      name: firstRole.name,
      roleType: 'human',
      description: firstRole.description,
      assistantId: firstRole.defaultAssistant,
      llmModel: firstRole.defaultModel,
      promptTemplate: firstRole.promptTemplate
    };
    setEditingWorkflow({
      ...editingWorkflow,
      steps: [...editingWorkflow.steps, newStep]
    });
    // Auto-edit newly added step
    startEditingStep(newStep);
  };

  const confirmDeleteStep = (stepId: string) => {
    setStepToDelete(stepId);
    setDeleteDialogOpen(true);
  };

  const removeStep = () => {
    if (stepToDelete && editingWorkflow.steps.length > 1) {
      const newSteps = editingWorkflow.steps.filter(s => s.id !== stepToDelete);
      // Reorder steps
      const reorderedSteps = newSteps.map((step, idx) => ({ ...step, order: idx + 1 }));
      setEditingWorkflow({
        ...editingWorkflow,
        steps: reorderedSteps
      });
      // Remove from editing steps
      setEditingSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(stepToDelete);
        return newSet;
      });
      setTempStepData(prev => {
        const newData = { ...prev };
        delete newData[stepToDelete];
        return newData;
      });
      setStepToDelete(null);
    }
    setDeleteDialogOpen(false);
  };
  
  const cancelDelete = () => {
    setStepToDelete(null);
    setDeleteDialogOpen(false);
  };

  const updateTempStep = (stepId: string, field: keyof WorkflowStep, value: any) => {
    // Update directly in editingWorkflow instead of temp data
    setEditingWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(s => 
        s.id === stepId ? { ...s, [field]: value } : s
      )
    }));
    
    // Also update temp data for the current editing session
    setTempStepData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        [field]: value
      }
    }));
  };

  const applyRoleTemplate = (stepId: string, roleId: string) => {
    const role = roleTemplates.find(r => r.id === roleId);
    if (!role) return;

    const updates = {
      role: roleId,
      name: role.name,
      description: role.description,
      promptTemplate: role.promptTemplate,
      assistantId: role.defaultAssistant,
      llmModel: role.defaultModel,
    };

    // Update directly in editingWorkflow
    setEditingWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(s => 
        s.id === stepId ? { ...s, ...updates } : s
      )
    }));

    // Also update temp data for the current editing session
    setTempStepData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        ...updates,
      }
    }));
  };



  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSteps = [...editingWorkflow.steps];
    const draggedStep = newSteps[draggedIndex];
    
    // Remove from old position
    newSteps.splice(draggedIndex, 1);
    // Insert at new position
    newSteps.splice(index, 0, draggedStep);
    
    // Reorder all steps
    const reorderedSteps = newSteps.map((step, idx) => ({ ...step, order: idx + 1 }));

    setEditingWorkflow({
      ...editingWorkflow,
      steps: reorderedSteps
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    // In a real app, you would save to a backend or state management
    // For now, we just navigate back
    navigate('workflow');
  };

  const handleRestoreDefaults = () => {
    if (existingWorkflow && existingWorkflow.isPreset) {
      // Deep clone the original workflow to reset everything
      setEditingWorkflow(JSON.parse(JSON.stringify(existingWorkflow)));
      // Clear any editing states
      setEditingSteps(new Set());
      setTempStepData({});
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || Lightbulb;
    return Icon;
  };

  const Icon = getIcon(editingWorkflow.icon);
  const colorMap: Record<string, string> = {
    'Purple': 'bg-purple-500',
    'Blue': 'bg-blue-500',
    'Amber': 'bg-amber-500',
    'Emerald': 'bg-emerald-500',
    'Cyan': 'bg-cyan-500',
  };
  const avatarBg = colorMap[editingWorkflow.color] || 'bg-purple-500';

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('workflow')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2>{isNewWorkflow ? 'Create Workflow' : 'Workflow Editor'}</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('workflow')}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Workflow
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-5xl mx-auto">
          {/* Workflow Details */}
          <Card className="mb-4">
            <Collapsible open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <div className="flex items-start gap-4 p-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className={avatarBg}>
                    <Icon className="w-6 h-6 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="mb-1">{editingWorkflow.name}</h3>
                  <p className="text-sm text-gray-600">{editingWorkflow.description}</p>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <label className="block mb-1.5 text-sm text-gray-700">Workflow Name</label>
                    <Input
                      value={editingWorkflow.name}
                      onChange={(e) => setEditingWorkflow({ ...editingWorkflow, name: e.target.value })}
                      placeholder="e.g., Strategic Decision Making"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm text-gray-700">Description</label>
                    <Textarea
                      value={editingWorkflow.description}
                      onChange={(e) => setEditingWorkflow({ ...editingWorkflow, description: e.target.value })}
                      placeholder="Brief description of what this workflow helps with"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1.5 text-sm text-gray-700">Icon</label>
                      <Select
                        value={editingWorkflow.icon}
                        onValueChange={(value) => setEditingWorkflow({ ...editingWorkflow, icon: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((option) => {
                            const OptionIcon = option.Icon;
                            return (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <OptionIcon className="w-4 h-4" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block mb-1.5 text-sm text-gray-700">Color</label>
                      <Select
                        value={editingWorkflow.color}
                        onValueChange={(value) => setEditingWorkflow({ ...editingWorkflow, color: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded ${option.class}`} />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Save and Close Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Steps Section */}
          <div className="mb-3">
            <h3>Workflow Steps</h3>
            <p className="text-sm text-gray-600 mt-1">Drag steps to reorder them</p>
          </div>

          <div className="space-y-3">
            {editingWorkflow.steps.map((step, index) => {
              const isEditing = editingSteps.has(step.id);
              const currentStep = isEditing ? tempStepData[step.id] : step;
              
              return (
                <div key={step.id}>
                  <Card
                    className={`transition-all ${draggedIndex === index ? 'opacity-50' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {isEditing ? (
                      // Edit Mode
                      <div>
                        <div className="flex items-start gap-3 p-4 pb-3">
                          <div className="cursor-grab active:cursor-grabbing pt-1">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">Step {step.order}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="px-4 pb-4 pt-0 space-y-3 ml-8">
                          <div>
                            <label className="block mb-1.5 text-sm text-gray-700">Step Name</label>
                            <Input
                              value={currentStep.name}
                              onChange={(e) => updateTempStep(step.id, 'name', e.target.value)}
                              placeholder="e.g., Problem Analysis"
                            />
                          </div>

                          {/* Role Selector */}
                          <div>
                            <label className="block mb-1.5 text-sm text-gray-700">Role</label>
                            <Select
                              value={currentStep.role || roleTemplates[0].id}
                              onValueChange={(value) => {
                                applyRoleTemplate(step.id, value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role template" />
                              </SelectTrigger>
                              <SelectContent>
                                {roleTemplates.map((role) => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block mb-1.5 text-sm text-gray-700">Performed By</label>
                            <Select
                              value={currentStep.roleType}
                              onValueChange={(value: 'ai' | 'human') => {
                                updateTempStep(step.id, 'roleType', value);
                                if (value === 'human') {
                                  // Clear assistant and model if switching to human
                                  updateTempStep(step.id, 'assistantId', undefined);
                                  updateTempStep(step.id, 'llmModel', undefined);
                                } else if (value === 'ai' && !currentStep.llmModel) {
                                  // Set default model if switching to AI and no model is set
                                  updateTempStep(step.id, 'llmModel', AVAILABLE_LLM_MODELS[0].id);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="human">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Human
                                  </div>
                                </SelectItem>
                                <SelectItem value="ai">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    AI
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block mb-1.5 text-sm text-gray-700">Description</label>
                            <Input
                              value={currentStep.description}
                              onChange={(e) => updateTempStep(step.id, 'description', e.target.value)}
                              placeholder="What does this step accomplish?"
                            />
                          </div>

                          {/* Prompt Template - for both AI and Human */}
                          <div>
                            <label className="block mb-1.5 text-sm text-gray-700">Prompt Template</label>
                            <Textarea
                              value={currentStep.promptTemplate || ''}
                              onChange={(e) => updateTempStep(step.id, 'promptTemplate', e.target.value)}
                              rows={2}
                              placeholder={
                                currentStep.roleType === 'ai' 
                                  ? 'Enter the prompt that the AI will use for this step' 
                                  : 'Enter instructions or prompts for the human user'
                              }
                            />
                          </div>
                          
                          {/* Assistant Selector - Only show for AI */}
                          {currentStep.roleType === 'ai' && (
                            <div>
                              <label className="block mb-1.5 text-sm text-gray-700">Assistant</label>
                              <Select
                                value={currentStep.assistantId || 'none'}
                                onValueChange={(value) => updateTempStep(step.id, 'assistantId', value === 'none' ? undefined : value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an assistant" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">
                                    <span className="text-gray-500">No assistant</span>
                                  </SelectItem>
                                  {assistants.map((assistant) => (
                                    <SelectItem key={assistant.id} value={assistant.id}>
                                      <div className="flex items-center gap-2">
                                        <Avatar className="w-5 h-5">
                                          <AvatarImage src={assistant.avatar} />
                                          <AvatarFallback>{assistant.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>{assistant.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {/* LLM Model Selector - Only show for AI */}
                          {currentStep.roleType === 'ai' && (
                            <div>
                              <label className="block mb-1.5 text-sm text-gray-700">LLM Model</label>
                              <Select
                                value={currentStep.llmModel || AVAILABLE_LLM_MODELS[0].id}
                                onValueChange={(value) => updateTempStep(step.id, 'llmModel', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                  {AVAILABLE_LLM_MODELS.map((model) => (
                                    <SelectItem key={model.id} value={model.id}>
                                      <div className="flex items-center gap-2">
                                        <Cpu className="w-4 h-4" />
                                        <span>{model.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start gap-3 p-4">
                        <div className="cursor-grab active:cursor-grabbing pt-1">
                          <GripVertical className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Step {step.order}</Badge>
                            <span className="text-sm font-semibold">{step.name}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1 mb-2">{step.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {/* Role Badge */}
                            {step.roleType === 'ai' ? (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 gap-1 text-xs">
                                <Sparkles className="w-3 h-3" />
                                AI
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 gap-1 text-xs">
                                <User className="w-3 h-3" />
                                Human
                              </Badge>
                            )}
                            {/* Assistant Badge */}
                            {step.assistantId && (() => {
                              const assistant = assistants.find(a => a.id === step.assistantId);
                              return assistant ? (
                                <Badge variant="outline" className="gap-1 text-xs">
                                  <Avatar className="w-3 h-3">
                                    <AvatarImage src={assistant.avatar} />
                                    <AvatarFallback>{assistant.name[0]}</AvatarFallback>
                                  </Avatar>
                                  {assistant.name}
                                </Badge>
                              ) : null;
                            })()}
                            {/* Model Badge */}
                            {step.llmModel && (() => {
                              const model = AVAILABLE_LLM_MODELS.find(m => m.id === step.llmModel);
                              return model ? (
                                <Badge variant="outline" className="gap-1 text-xs">
                                  <Cpu className="w-3 h-3" />
                                  {model.name}
                                </Badge>
                              ) : null;
                            })()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditingStep(step)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {editingWorkflow.steps.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => confirmDeleteStep(step.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                  
                  {/* Arrow between steps */}
                  {index < editingWorkflow.steps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Step Button */}
          <div className="flex mt-3">
            <Button onClick={addStep} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add Step
            </Button>
          </div>

          {/* Tips */}
          <Card className="p-4 mt-4 bg-blue-50 border-blue-200">
            <h4 className="mb-2">💡 Tips for creating effective workflows</h4>
            <ul className="text-sm text-gray-700 space-y-0.5 list-disc list-inside">
              <li>Start with problem definition or context gathering</li>
              <li>Include divergent thinking (exploration) before convergent thinking (decision)</li>
              <li>Use clear, specific prompts that guide the AI's response</li>
              <li>Alternate between human and AI steps for best results</li>
              <li>End with actionable next steps or summaries</li>
            </ul>
          </Card>

          {/* Restore to defaults button */}
          {existingWorkflow && existingWorkflow.isPreset && (
            <div className="flex mt-4">
              <Button 
                onClick={handleRestoreDefaults} 
                variant="outline"
              >
                Restore to defaults
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow Step</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this step? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeStep} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

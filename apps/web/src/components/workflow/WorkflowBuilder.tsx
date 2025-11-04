import { useState, memo, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { SidebarTrigger } from '../ui/sidebar';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Plus,
  Edit,
  GripVertical,
  Lightbulb,
  Target,
  Zap,
  FileText,
  Search,
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth, useNavigation, useSelection } from '../../contexts';

interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  roleType: 'ai' | 'human';
  description: string;
  assistants: string[];
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
        assistants: [],
      },
      {
        id: 'si-2',
        order: 2,
        name: 'Ideate',
        roleType: 'ai',
        description: 'Generate creative and innovative solutions',
        assistants: ['creative-innovator', 'visionary-strategist', 'all-rounder'],
        promptTemplate: 'Generate innovative ideas for [problem]. Consider multiple approaches and unconventional solutions.',
      },
      {
        id: 'si-3',
        order: 3,
        name: 'Assess',
        roleType: 'human',
        description: 'Evaluate feasibility and alignment',
        assistants: [],
      },
      {
        id: 'si-4',
        order: 4,
        name: 'Refine',
        roleType: 'ai',
        description: 'Polish and improve selected concepts',
        assistants: ['writing-coach', 'product-manager'],
        promptTemplate: 'Refine the selected ideas. Improve clarity, strengthen value proposition, and address potential concerns.',
      },
      {
        id: 'si-5',
        order: 5,
        name: 'Synthesise',
        roleType: 'human',
        description: 'Select and integrate best concepts',
        assistants: [],
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
        assistants: [],
      },
      {
        id: 'cdm-2',
        order: 2,
        name: 'Generate',
        roleType: 'ai',
        description: 'Identify all possible options',
        assistants: ['all-rounder', 'product-manager'],
        promptTemplate: 'Generate comprehensive list of options for [decision]. Include conventional and alternative approaches.',
      },
      {
        id: 'cdm-3',
        order: 3,
        name: 'Analyze',
        roleType: 'ai',
        description: 'Evaluate each option systematically',
        assistants: ['data-analyst', 'finance-guru', 'tech-troubleshooter'],
        promptTemplate: 'Analyze each option considering: feasibility, costs, risks, benefits, and long-term implications.',
      },
      {
        id: 'cdm-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Question assumptions and identify risks',
        assistants: ['devils-advocate', 'legal-analyst'],
        promptTemplate: 'Challenge the analysis. What assumptions might be wrong? What risks are overlooked?',
      },
      {
        id: 'cdm-5',
        order: 5,
        name: 'Assess',
        roleType: 'human',
        description: 'Make final decision',
        assistants: [],
      },
      {
        id: 'cdm-6',
        order: 6,
        name: 'Present',
        roleType: 'ai',
        description: 'Document decision rationale',
        assistants: ['writing-coach'],
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
        assistants: [],
      },
      {
        id: 'rps-2',
        order: 2,
        name: 'Analyze',
        roleType: 'ai',
        description: 'Diagnose root causes',
        assistants: ['methodical-proofreader', 'data-analyst'],
        promptTemplate: 'Analyze the problem systematically. Identify root causes, contributing factors, and patterns.',
      },
      {
        id: 'rps-3',
        order: 3,
        name: 'Generate',
        roleType: 'ai',
        description: 'Propose tactical solutions',
        assistants: ['tech-troubleshooter', 'product-manager'],
        promptTemplate: 'Generate practical solutions that address the root causes. Focus on quick wins and sustainable fixes.',
      },
      {
        id: 'rps-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Stress-test proposed solutions',
        assistants: ['devils-advocate'],
        promptTemplate: 'Challenge the proposed solutions. What could go wrong? What are we missing?',
      },
      {
        id: 'rps-5',
        order: 5,
        name: 'Curate',
        roleType: 'human',
        description: 'Select best solution',
        assistants: [],
      },
      {
        id: 'rps-6',
        order: 6,
        name: 'Refine',
        roleType: 'ai',
        description: 'Detail implementation plan',
        assistants: ['all-rounder'],
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
        assistants: [],
      },
      {
        id: 'ccr-2',
        order: 2,
        name: 'Generate',
        roleType: 'ai',
        description: 'Create initial draft',
        assistants: ['writing-coach', 'marketing-expert'],
        promptTemplate: 'Generate [content type] for [audience] about [topic]. Tone: [tone]. Key points: [points].',
      },
      {
        id: 'ccr-3',
        order: 3,
        name: 'Check',
        roleType: 'ai',
        description: 'Verify accuracy and clarity',
        assistants: ['science-communicator', 'legal-analyst'],
        promptTemplate: 'Review the content for accuracy, clarity, and potential issues. Check facts and claims.',
      },
      {
        id: 'ccr-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Critique messaging and effectiveness',
        assistants: ['devils-advocate', 'marketing-expert'],
        promptTemplate: 'Critique the content. Is the message clear? Will it resonate with the audience? What could be improved?',
      },
      {
        id: 'ccr-5',
        order: 5,
        name: 'Refine',
        roleType: 'ai',
        description: 'Polish and perfect the content',
        assistants: ['writing-coach', 'methodical-proofreader'],
        promptTemplate: 'Refine the content based on feedback. Improve flow, strengthen arguments, polish language.',
      },
      {
        id: 'ccr-6',
        order: 6,
        name: 'Assess',
        roleType: 'human',
        description: 'Final approval',
        assistants: [],
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
        assistants: [],
      },
      {
        id: 'rs-2',
        order: 2,
        name: 'Research',
        roleType: 'ai',
        description: 'Gather information systematically',
        assistants: ['all-rounder', 'science-communicator'],
        promptTemplate: 'Research [topic]. Gather key facts, theories, and perspectives from multiple sources.',
      },
      {
        id: 'rs-3',
        order: 3,
        name: 'Analyze',
        roleType: 'ai',
        description: 'Identify patterns and insights',
        assistants: ['data-analyst', 'visionary-strategist'],
        promptTemplate: 'Analyze the research. Identify patterns, connections, gaps, and key insights.',
      },
      {
        id: 'rs-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Question conclusions and assumptions',
        assistants: ['devils-advocate', 'science-communicator'],
        promptTemplate: 'Challenge the analysis. What biases might exist? What alternative interpretations are possible?',
      },
      {
        id: 'rs-5',
        order: 5,
        name: 'Synthesise',
        roleType: 'ai',
        description: 'Create cohesive understanding',
        assistants: ['writing-coach', 'all-rounder'],
        promptTemplate: 'Synthesize findings into a clear, actionable understanding. Connect insights and draw conclusions.',
      },
      {
        id: 'rs-6',
        order: 6,
        name: 'Assess',
        roleType: 'human',
        description: 'Review and finalize',
        assistants: [],
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
        assistants: ['all-rounder'],
        promptTemplate: 'Welcome the board and introduce the topic: [topic]. Frame the key questions to be discussed.',
      },
      {
        id: 'boa-2',
        order: 2,
        name: 'Question 1',
        roleType: 'human',
        description: 'Present first question to the board',
        assistants: [],
      },
      {
        id: 'boa-3',
        order: 3,
        name: 'Strategist Perspective',
        roleType: 'ai',
        description: 'Strategic viewpoint on the question',
        assistants: ['visionary-strategist'],
        promptTemplate: 'Provide a strategic perspective on this question, considering long-term implications and opportunities.',
      },
      {
        id: 'boa-4',
        order: 4,
        name: 'Critical Analysis',
        roleType: 'ai',
        description: 'Challenge assumptions and identify risks',
        assistants: ['devils-advocate'],
        promptTemplate: 'Challenge the assumptions in the question. What risks or alternative viewpoints should be considered?',
      },
      {
        id: 'boa-5',
        order: 5,
        name: 'Creative Solutions',
        roleType: 'ai',
        description: 'Generate innovative approaches',
        assistants: ['creative-innovator'],
        promptTemplate: 'Suggest creative and unconventional solutions or approaches to this question.',
      },
      {
        id: 'boa-6',
        order: 6,
        name: 'Moderate',
        roleType: 'ai',
        description: 'Synthesize insights from advisors',
        assistants: ['all-rounder'],
        promptTemplate: 'Summarize the key insights from the advisors and identify common themes or points of disagreement.',
      },
      {
        id: 'boa-7',
        order: 7,
        name: 'Question 2',
        roleType: 'human',
        description: 'Present second question to the board',
        assistants: [],
      },
      {
        id: 'boa-8',
        order: 8,
        name: 'Data-Driven View',
        roleType: 'ai',
        description: 'Analytical perspective with data focus',
        assistants: ['data-analyst'],
        promptTemplate: 'Analyze this question from a data-driven perspective. What metrics or evidence should inform the decision?',
      },
      {
        id: 'boa-9',
        order: 9,
        name: 'Product Perspective',
        roleType: 'ai',
        description: 'Product and user-focused viewpoint',
        assistants: ['product-manager'],
        promptTemplate: 'Consider this question from a product and user experience perspective. What would best serve the end users?',
      },
      {
        id: 'boa-10',
        order: 10,
        name: 'Moderate',
        roleType: 'ai',
        description: 'Final synthesis and recommendations',
        assistants: ['all-rounder'],
        promptTemplate: 'Provide a final synthesis of all perspectives shared. Offer balanced recommendations based on the board discussion.',
      },
    ],
  },
];

// Memoized Draggable Workflow Card Component
const WorkflowCard = memo(({ 
  workflow, 
  index,
  onEdit,
  moveWorkflow,
  onDragEnd
}: { 
  workflow: Workflow;
  index: number;
  onEdit: (id: string) => void;
  moveWorkflow: (dragIndex: number, hoverIndex: number) => void;
  onDragEnd: () => void;
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'workflow-card',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      onDragEnd();
    },
  });

  const [, drop] = useDrop({
    accept: 'workflow-card',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveWorkflow(item.index, index);
        item.index = index;
      }
    },
  });

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || Lightbulb;
    return Icon;
  };

  const Icon = getIcon(workflow.icon);
  
  const colorMap: Record<string, string> = {
    'Purple': 'bg-purple-500',
    'Blue': 'bg-blue-500',
    'Amber': 'bg-amber-500',
    'Emerald': 'bg-emerald-500',
    'Cyan': 'bg-cyan-500',
  };
  
  const avatarBg = colorMap[workflow.color] || 'bg-purple-500';

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={`transition-all ${isDragging ? 'opacity-50 scale-105' : 'opacity-100'}`}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
        {/* Full-width Drag Handle Bar */}
        <div
          ref={drag}
          className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 cursor-move hover:bg-gray-100 transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(workflow.id);
            }}
            className="h-6 w-6 -mr-2"
          >
            <Edit className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Card Content */}
        <div className="px-6 pt-0 pb-6">
          {/* Header with Avatar and Name */}
          <div className="flex items-center gap-4 mb-1">
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarFallback className={avatarBg}>
                <Icon className="w-8 h-8 text-white" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 min-h-[3.5rem]">
                <h3 className="line-clamp-2 flex-1">{workflow.name}</h3>
                {!workflow.isPreset && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0">Custom</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{workflow.description}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

export function WorkflowBuilder() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { workflowOrder, setWorkflowOrder } = useSelection();

  // Get workflows in user's preferred order (excluding AI-assisted workflow)
  const [orderedWorkflows, setOrderedWorkflows] = useState(() => {
    return workflowOrder
      .filter(id => id !== 'build-as-we-go') // Hide AI-assisted workflow
      .map(id => defaultWorkflows.find(w => w.id === id))
      .filter(Boolean) as Workflow[];
  });

  // Sync with context when workflowOrder changes
  useEffect(() => {
    setOrderedWorkflows(
      workflowOrder
        .filter(id => id !== 'build-as-we-go') // Hide AI-assisted workflow
        .map(id => defaultWorkflows.find(w => w.id === id))
        .filter(Boolean) as Workflow[]
    );
  }, [workflowOrder]);

  const moveWorkflow = useCallback((dragIndex: number, hoverIndex: number) => {
    setOrderedWorkflows((prev) => {
      const newOrder = [...prev];
      const draggedWorkflow = newOrder[dragIndex];
      newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, draggedWorkflow);
      return newOrder;
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    // Save the current order to context when drag ends
    const newOrderIds = orderedWorkflows.map(w => w.id);
    setWorkflowOrder(newOrderIds);
  }, [orderedWorkflows, setWorkflowOrder]);

  const handleEdit = (workflowId: string) => {
    navigate(`workflow-editor-${workflowId}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Workflows</h2>
          </div>
          <Button onClick={() => navigate('workflow-editor-new')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Workflow
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Workflow Grid - 3 columns */}
          <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {orderedWorkflows.map((workflow, index) => (
                <WorkflowCard 
                  key={workflow.id} 
                  workflow={workflow}
                  index={index}
                  onEdit={handleEdit}
                  moveWorkflow={moveWorkflow}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          </DndProvider>
        </div>
      </main>
    </div>
  );
}

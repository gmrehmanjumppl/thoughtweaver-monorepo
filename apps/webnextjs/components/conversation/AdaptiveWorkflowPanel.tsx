'use client';

import { useState, memo } from 'react';
import {
  Button,
  Card,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Progress,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@thoughtweaver/ui';
import {
  Sparkles,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Save,
  Lightbulb,
  Zap,
  Target,
  FileText,
  Search,
  BarChart3,
  AlertCircle,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { PRESET_WORKFLOWS } from '../../constants/workflows';

interface WorkflowStep {
  id: string;
  roleId: string;
  status: 'active' | 'completed' | 'pending';
  assistantIds: string[];
}

interface WorkflowSuggestion {
  roleId: string;
  message: string;
  recommendedAssistants: string[];
}

interface WorkflowRole {
  id: string;
  name: string;
  description: string;
  icon: any;
}

// Role definitions that align with the preset workflows
const WORKFLOW_ROLES: WorkflowRole[] = [
  {
    id: 'frame',
    name: 'Frame',
    description: 'Define problem, objectives, and constraints',
    icon: Target,
  },
  {
    id: 'ideate',
    name: 'Ideate',
    description: 'Generate creative and innovative solutions',
    icon: Lightbulb,
  },
  {
    id: 'assess',
    name: 'Assess',
    description: 'Evaluate feasibility and alignment',
    icon: Target,
  },
  {
    id: 'refine',
    name: 'Refine',
    description: 'Polish and improve selected concepts',
    icon: RefreshCw,
  },
  {
    id: 'synthesize',
    name: 'Synthesise',
    description: 'Select and integrate best concepts',
    icon: Sparkles,
  },
  {
    id: 'generate',
    name: 'Generate',
    description: 'Identify all possible options',
    icon: Lightbulb,
  },
  {
    id: 'analyze',
    name: 'Analyze',
    description: 'Examine and evaluate systematically',
    icon: BarChart3,
  },
  {
    id: 'challenge',
    name: 'Challenge',
    description: 'Question assumptions and identify risks',
    icon: AlertCircle,
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Gather information and insights',
    icon: Search,
  },
  {
    id: 'check',
    name: 'Check',
    description: 'Verify accuracy and clarity',
    icon: Shield,
  },
  {
    id: 'curate',
    name: 'Curate',
    description: 'Select best solution',
    icon: Target,
  },
  {
    id: 'present',
    name: 'Present',
    description: 'Package findings for communication',
    icon: FileText,
  },
];

export const AdaptiveWorkflowPanel = memo((({
  workflowSteps,
  currentSuggestion,
  onActivateSuggestion,
  onSkipSuggestion,
  onSaveWorkflow,
  getAssistant,
  selectedAssistantId,
  onSelectAssistant,
  workflowId,
  onStartWorkflow,
  currentStepIndex,
  onSwitchWorkflow,
  userMessageCount
}: {
  workflowSteps: WorkflowStep[];
  currentSuggestion: WorkflowSuggestion | null;
  onActivateSuggestion: (suggestion: WorkflowSuggestion, selectedAssistantId: string | null) => void;
  onSkipSuggestion: () => void;
  onSaveWorkflow: () => void;
  getAssistant: (id: string) => any;
  selectedAssistantId: string | null;
  onSelectAssistant: (assistantId: string) => void;
  workflowId: string;
  onStartWorkflow: () => void;
  currentStepIndex: number;
  onSwitchWorkflow?: (newWorkflowId: string) => void;
  userMessageCount: number;
}) => {
  const [showHistory, setShowHistory] = useState(true);
  const [workflowStarted, setWorkflowStarted] = useState(false);
  const [showStepsPreview, setShowStepsPreview] = useState(true);
  
  // Get pre-defined workflow if applicable
  const presetWorkflow = PRESET_WORKFLOWS.find(w => w.id === workflowId);
  const hasPresetSteps = presetWorkflow && presetWorkflow.steps.length > 0;
  
  // Default suggested workflow for AI-assisted mode
  const suggestedWorkflow = PRESET_WORKFLOWS.find(w => w.id === 'strategic-ideation') || PRESET_WORKFLOWS[1];

  const completedSteps = workflowSteps.filter(s => s.status === 'completed');
  const activeStep = workflowSteps.find(s => s.status === 'active');

  const getRole = (roleId: string) => WORKFLOW_ROLES.find(r => r.id === roleId);
  
  const predictNextSteps = (): WorkflowRole[] => {
    const usedRoleIds = workflowSteps.map(s => s.roleId);
    const availableRoles = WORKFLOW_ROLES.filter(r => !usedRoleIds.includes(r.id));
    return availableRoles.slice(0, 3);
  };
  
  const nextSteps = predictNextSteps();

  const handleStartWorkflow = () => {
    setWorkflowStarted(true);
    onStartWorkflow();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-purple-900">Workflow Assistant</h3>
      </div>

      {/* Show workflow steps only if a predefined workflow with steps is selected */}
      {hasPresetSteps && presetWorkflow && (
        <div className="space-y-4">
          {/* Workflow Header */}
          <Card className="p-4 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-purple-900 mb-1">{presetWorkflow.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{presetWorkflow.description}</p>
                
                {/* Recommended Assistant for Workflow */}
                {presetWorkflow.recommendedAssistant && (() => {
                  const assistant = getAssistant(presetWorkflow.recommendedAssistant);
                  if (!assistant) return null;
                  return (
                    <div className="flex items-center gap-1.5 bg-white px-2 py-1.5 rounded-lg border border-purple-200 text-xs w-fit">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={assistant.avatar} />
                        <AvatarFallback className={assistant.color}>
                          {assistant.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-700">
                        <span className="text-gray-500">with</span> <span className="font-medium">{assistant.name}</span>
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-900 font-medium">
                  Step {currentStepIndex + 1} of {presetWorkflow.steps.length}
                </span>
              </div>
              <Progress value={(currentStepIndex / presetWorkflow.steps.length) * 100} className="h-2" />
            </div>

            {!workflowStarted && (
              <Button
                onClick={handleStartWorkflow}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start workflow
              </Button>
            )}
          </Card>

          {/* Workflow Steps List */}
          <div className="space-y-2">
            {presetWorkflow.steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex && workflowStarted;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    isCurrent
                      ? 'border-purple-300 bg-purple-50/50 shadow-sm'
                      : isCompleted
                      ? 'border-green-200 bg-green-50/30'
                      : 'border-gray-200 bg-gray-50/30'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCurrent
                        ? 'bg-purple-600 text-white'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`text-sm font-medium ${
                          isCurrent ? 'text-purple-900' : isCompleted ? 'text-green-900' : 'text-gray-700'
                        }`}
                      >
                        {step.name}
                      </span>
                      {isCurrent && (
                        <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                          Current
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          step.roleType === 'ai'
                            ? 'border-blue-300 text-blue-700 bg-blue-50'
                            : 'border-gray-300 text-gray-700'
                        }`}
                      >
                        {step.roleType === 'ai' ? 'AI' : 'Human'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{step.description}</p>
                    
                    {/* Show single assistant for AI steps */}
                    {step.assistant && (() => {
                      const assistant = getAssistant(step.assistant);
                      if (!assistant) return null;
                      return (
                        <div className="mt-2">
                          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-gray-200 text-xs w-fit">
                            <Avatar className="w-4 h-4">
                              <AvatarImage src={assistant.avatar} />
                              <AvatarFallback className={assistant.color}>
                                {assistant.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-gray-700 font-medium">{assistant.name}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state before 2nd message */}
      {!hasPresetSteps && userMessageCount < 2 && (
        <Card className="p-4 border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Start your conversation and I'll suggest helpful workflows...
          </p>
        </Card>
      )}

      {/* Workflow Suggestion for AI-assisted mode - only after 2nd message */}
      {!hasPresetSteps && suggestedWorkflow && userMessageCount >= 2 && (
        <div className="space-y-4">
          {/* Suggestion Card */}
          <Card className="p-4 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-purple-900 mb-1">Suggested Workflow</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Based on creative thinking tasks, we recommend <span className="font-medium">{suggestedWorkflow.name}</span>
                </p>
                <p className="text-xs text-gray-600 mb-2">{suggestedWorkflow.description}</p>
                
                {/* Recommended Assistant */}
                {suggestedWorkflow.recommendedAssistant && (() => {
                  const assistant = getAssistant(suggestedWorkflow.recommendedAssistant);
                  if (!assistant) return null;
                  return (
                    <div className="flex items-center gap-1.5 bg-white px-2 py-1.5 rounded-lg border border-purple-200 text-xs w-fit">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={assistant.avatar} />
                        <AvatarFallback className={assistant.color}>
                          {assistant.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-700">
                        <span className="text-gray-500">with</span> <span className="font-medium">{assistant.name}</span>
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
            
            {/* Preview Steps Toggle */}
            <Collapsible open={showStepsPreview} onOpenChange={setShowStepsPreview}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-2 hover:bg-purple-100/50 rounded-lg transition-colors mb-2">
                  <span className="text-sm font-medium text-purple-900">
                    Preview Steps ({suggestedWorkflow.steps.length})
                  </span>
                  {showStepsPreview ? (
                    <ChevronUp className="w-4 h-4 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-purple-600" />
                  )}
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-2 mb-3">
                {suggestedWorkflow.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-2 p-2 bg-white rounded-lg border border-purple-100"
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-medium text-gray-900">{step.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            step.roleType === 'ai'
                              ? 'border-blue-300 text-blue-700 bg-blue-50'
                              : 'border-gray-300 text-gray-700'
                          }`}
                        >
                          {step.roleType === 'ai' ? 'AI' : 'Human'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{step.description}</p>
                      
                      {/* Show single assistant for AI steps */}
                      {step.assistant && (() => {
                        const assistant = getAssistant(step.assistant);
                        if (!assistant) return null;
                        return (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs w-fit">
                            <Avatar className="w-3.5 h-3.5">
                              <AvatarImage src={assistant.avatar} />
                              <AvatarFallback className={assistant.color}>
                                {assistant.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-gray-700 font-medium">{assistant.name}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => onSwitchWorkflow?.(suggestedWorkflow.id)}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Use {suggestedWorkflow.name}
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setShowStepsPreview(false)}
              >
                Continue weaving freely
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}));

AdaptiveWorkflowPanel.displayName = 'AdaptiveWorkflowPanel';

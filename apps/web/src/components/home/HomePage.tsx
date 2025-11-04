/**
 * HomePage Component
 * 
 * Main landing page for Thoughtweaver application.
 * Refactored in Phase 1 to use centralized constants.
 * 
 * @phase Phase 1 Complete - Ready for Phase 2
 * @updated November 1, 2025
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { RadioGroup } from '../ui/radio-group';
import { SidebarTrigger } from '../ui/sidebar';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi 
} from '../ui/carousel';
import { AVAILABLE_LLM_MODELS } from '../../constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { 
  Lightbulb, 
  Sparkles,
  FileText,
  Wand2,
  Cpu,
  Target,
  Zap,
  Search,
  Check,
  MessageSquare,
  Plus,
  Paperclip,
  Mic
} from 'lucide-react';
import { assistants as assistantData } from '../assistant/assistantData';
import { useAuth, useNavigation, useConversation, useSelection } from '../../contexts';

// Phase 1: Using constants from centralized location
import { TEXTAREA_MIN_HEIGHT, MAX_PROMPT_LENGTH } from '../../constants/ui';

// Workflow display configurations
const workflows = [
  { 
    id: 'build-as-we-go', 
    name: 'AI-assisted workflow', 
    description: 'Explore ideas naturally without a predefined structure',
    icon: Sparkles,
    color: 'Purple' as const
  },
  {
    id: 'strategic-ideation',
    name: 'Strategic Ideation',
    description: 'Generate and refine innovative solutions through structured creative thinking',
    icon: Lightbulb,
    color: 'Purple' as const
  },
  {
    id: 'critical-decision-making',
    name: 'Critical Decision Making',
    description: 'Evaluate options and make informed decisions with comprehensive analysis',
    icon: Target,
    color: 'Blue' as const
  },
  {
    id: 'rapid-problem-solving',
    name: 'Rapid Problem Solving',
    description: 'Quickly diagnose and solve problems with tactical precision',
    icon: Zap,
    color: 'Amber' as const
  },
  {
    id: 'content-creation-refinement',
    name: 'Content Creation & Refinement',
    description: 'Develop polished written content from concept to final draft',
    icon: FileText,
    color: 'Emerald' as const
  },
  {
    id: 'research-synthesis',
    name: 'Research & Synthesis',
    description: 'Deep dive into topics and synthesize insights into actionable understanding',
    icon: Search,
    color: 'Cyan' as const
  },
];

// Preset prompt templates
const presetPrompts = [
  {
    label: 'Write my own prompt',
    prompt: 'Prompt in your style'
  },
  {
    label: '🧠 Mental-Model Network',
    prompt: `🧠 Mental-Model Network

Objective:
Extract and structure the deep logic of a topic through its constituent mental models.

Output Form:
Present a compact set (5–8) of distinct models.
For each model include: Name (concise, distinctive), Description (2–3 sentences on what it reveals or organizes), Foundations (short bullets with assumptions, mechanisms, or evidence).
Add bullets describing the nature most important relationships between the mental model
Conclude with a short synthesis on what the structure reveals and how to use it.

Style:
Analytic, precise, non-performative; prose first; one idea per bullet if used.

Intent Logic:
Use when explaining how a system of ideas works or interrelates.`
  },
  {
    label: '🧩 Structural Taxonomy',
    prompt: `🧩 Structural Taxonomy

Objective:
Organize a complex domain into clear, non-overlapping categories that improve understanding or design.

Output Form:
State the organizing principle in one line.
Present 4–7 categories with: Name (functional label), Definition (1–2 sentences), Boundary rule (one bullet clarifying inclusion/exclusion).
Conclude with a short paragraph on how these distinctions aid decisions or architecture.

Style:
Tight, definitional, unembellished; avoid hierarchy unless essential.

Intent Logic:
Use when structuring a domain, typology, or classification for practical use.`
  },
  {
    label: '🧭 Decision Architecture',
    prompt: `🧭 Decision Architecture

Objective:
Map how decisions are or should be made—who decides, when, and using what information logic.

Output Form:
Define the decision space in one line.
List key decision nodes as numbered elements: what is decided, by whom, based on what inputs.
Bullet information and authority flows (dependencies, conflicts, gates).
Conclude with a paragraph on where judgment, bias, or leverage concentrates.

Style:
Clear, procedural, judgment-aware; focus on structure and flow.

Intent Logic:
Use for governance design, operating models, or human–AI division of judgment.`
  },
  {
    label: '🔄 Concept Evolution Map',
    prompt: `🔄 Concept Evolution Map

Objective:
Trace how an idea, technology, or belief evolves through identifiable stages.

Output Form:
Define the concept/domain in one sentence.
Show 4–6 stages: Name + 1–2 sentences on defining features or shifts.
Bullet drivers or triggers for transitions between stages.
End with a brief note on the next likely inflection point and what signals to watch.

Style:
Chronological, explanatory, non-hyped; emphasize mechanisms of change.

Intent Logic:
Use when exploring progression, maturity, or trajectories to inform timing.`
  },
  {
    label: '���� Narrative Framework',
    prompt: `📖 Narrative Framework

Objective:
Build a coherent, paragraph-based explanation that advances understanding and supports decisions.

Output Form:
Open with a compact framing paragraph (intent, context, audience, promised artifact).
Present the narrative artifact early in short sections that build the logic step by step.
Use bullets only to enumerate examples, one idea per line.
Include 2–3 alternatives with succinct trade-offs when choices matter.
End with up to three next decisions, each with a one-sentence selection criterion.

Style:
Crisp, logically sequenced prose; minimal signposting; no theatrics.

Intent Logic:
Use when constructing an argument or explanation that must be read straight through and directly inform judgment.`
  },
  {
    label: '🌳 Decision Tree (Explanatory Nodes)',
    prompt: `🌳 Decision Tree (Explanatory Nodes)

Objective:
Map conditional reasoning from a root decision to differentiated recommendations via explicit criteria.

Output Form:
State the decision and constraints in one line.
Lay out nodes as headers; under each, a short paragraph defining the criterion, how to assess it, and the implied branch; end with a one-line branch rule ("If X, go left; otherwise, go right").
Conclude with 2–3 terminal recommendations tied to specific paths and trade-offs.
List the minimal evidence checks or gates needed to finalize the choice.

Style:
Structured, transparent, outcome-oriented; paragraphs, not flowcharts.

Intent Logic:
Use when a decision depends on a small set of testable criteria and stakeholders must see the path, not just the answer.`
  },
  {
    label: '🔮 Premortem → Backcast Plan',
    prompt: `🔮 Premortem → Backcast Plan

Objective:
Anticipate plausible failure or success causes and convert them into a time-sequenced mitigation and enablement plan.

Output Form:
Define objective and horizon in one line.
Write a tight premortem naming the three most plausible causes (failure or success), in paragraphs.
Backcast into a dated, ordered plan; use bullets only for single critical checkpoints.
Provide 2–3 route variations (e.g., cadence, scope, governance) with clear trade-offs in risk, cost, and learning speed.
State the minimal commitments now (owners, dates, guardrails) to begin.

Style:
Concise, forward-programmed, risk-aware; avoid task sprawl.

Intent Logic:
Use when de-risking significant initiatives and locking in early wins matters more than exhaustive planning.`
  },
  {
    label: '🧮 Hypothesis Ledger (Claims → Evidence → Decision)',
    prompt: `🧮 Hypothesis Ledger (Claims → Evidence → Decision)

Objective:
Concentrate reasoning on pivotal hypotheses, balancing evidence and counter-evidence to drive near-term decisions.

Output Form:
State the strategic question and the ledger format in one line.
List 4–6 hypotheses as headers; for each: brief paragraph of supporting evidence, brief paragraph of challenging evidence, and the immediate decision implication; optionally add one bullet for the single highest-value next test.
Synthesize 2–3 actionable paths conditioned on the ledger, with explicit trade-offs.
Name the minimal decisions and tests to update the ledger, including timing for review.

Style:
Disciplined, empirical, transparent about uncertainty and thresholds.

Intent Logic:
Use for analytical reviews, learning loops, or early-stage strategy where "act now vs learn then act" must be explicit.`
  },
];

export function HomePage() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { createConversation } = useConversation();
  const { 
    selectedWorkflow, 
    setSelectedWorkflow,
    selectedAssistants,
    setSelectedAssistants,
    selectedLLM,
    setSelectedLLM,
    assistantOrder,
    hiddenAssistants
  } = useSelection();
  const [prompt, setPrompt] = useState('Prompt in your style');
  
  // Get assistants in user's preferred order, filtering out hidden ones
  const orderedAssistants = assistantOrder
    .map(id => assistantData.find(a => a.id === id))
    .filter(Boolean)
    .filter(a => !hiddenAssistants.includes(a.id)) as typeof assistantData;
  
  // Add "No assistant" option at the front
  const noneOption = {
    id: 'none',
    name: 'No assistant',
    description: 'Use the LLM model without an assistant',
    avatar: '',
    color: 'bg-gray-200'
  };
  
  const assistantsWithNone = [noneOption, ...orderedAssistants];
  const [lastClickedAssistant, setLastClickedAssistant] = useState<string | null>('all-rounder');
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [llmDialogOpen, setLlmDialogOpen] = useState(false);
  const [selectedPromptPreset, setSelectedPromptPreset] = useState('Write my own prompt');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [prompt]);

  // Enable two-finger swipe on MacBook trackpad
  useEffect(() => {
    if (!carouselApi) return;

    const carouselContainer = carouselApi.rootNode();
    if (!carouselContainer) return;

    const handleWheel = (e: WheelEvent) => {
      // Check if it's a horizontal scroll or two-finger horizontal swipe
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        
        // Get the scroll container (the element with overflow-hidden)
        const scrollContainer = carouselContainer.querySelector('.overflow-hidden');
        if (scrollContainer) {
          const scrollElement = scrollContainer.firstElementChild as HTMLElement;
          if (scrollElement) {
            scrollElement.scrollLeft += e.deltaX;
          }
        }
      }
    };

    carouselContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      carouselContainer.removeEventListener('wheel', handleWheel);
    };
  }, [carouselApi]);

  const toggleAssistant = (assistantId: string) => {
    // If it's "create-assistant", navigate to the assistant creator page
    if (assistantId === 'create') {
      navigate('assistant-creator');
      return;
    }
    
    // If selecting "None", clear all assistants
    if (assistantId === 'none') {
      setLastClickedAssistant('none');
      setSelectedAssistants([]);
      return;
    }
    
    // Set the last clicked assistant to show description
    setLastClickedAssistant(assistantId);
    
    // Single selection: if clicking the same assistant, deselect it; otherwise select the new one
    if (selectedAssistants.includes(assistantId)) {
      setSelectedAssistants([]);
    } else {
      setSelectedAssistants([assistantId]);
    }
  };

  const handleExamplePromptSelect = (value: string) => {
    const selectedPreset = presetPrompts.find(p => p.label === value);
    if (selectedPreset) {
      setPrompt(selectedPreset.prompt);
    }
  };

  const getAssistantDescription = () => {
    if (!lastClickedAssistant) return null;
    if (lastClickedAssistant === 'none') return noneOption.description;
    const assistant = orderedAssistants.find(a => a.id === lastClickedAssistant);
    return assistant?.description || null;
  };

  const toggleLLM = (llmId: string) => {
    if (selectedLLM === llmId) {
      setSelectedLLM('');
    } else {
      setSelectedLLM(llmId);
    }
  };

  const getSelectedLLMNames = () => {
    if (!selectedLLM) return 'Select models';
    return AVAILABLE_LLM_MODELS.find(m => m.id === selectedLLM)?.name || 'Select models';
  };

  const handleSubmit = () => {
    if (prompt.trim()) {
      createConversation(prompt, selectedWorkflow, selectedAssistants);
      navigate('conversation');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-10">
        <div className="flex items-center gap-3 px-4 h-14">
          <SidebarTrigger />
          <h2>Thoughtweaver</h2>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <h2 className="text-4xl mb-6 font-serif text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            What do you want to achieve today?
          </h2>

          {/* Prompt Input */}
          <Card className="p-6">
            <label className="text-black mb-3 block hidden">Ask Thoughtweaver</label>
            
            {/* Buttons Row - Moved Above */}
            <div className="flex gap-4 mb-0 items-end justify-between">
              <div className="flex gap-2">
                {/* Prompt Section with Label */}
                <div className="flex flex-col gap-1">
                  <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Check className="w-4 h-4" />
                        {selectedPromptPreset}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Example Prompts</DialogTitle>
                        <DialogDescription>
                          Select a pre-written prompt template to get started quickly.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-3 py-4">
                        {presetPrompts.map((preset) => (
                          <button
                            key={preset.label}
                            onClick={() => {
                              setPrompt(preset.prompt);
                              setPromptDialogOpen(false);
                              setSelectedPromptPreset(preset.label);
                            }}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                              selectedPromptPreset === preset.label
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium mb-1">{preset.label}</div>
                              <div className="text-sm text-gray-500 line-clamp-2">{preset.prompt}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Workflow Section with Label */}
                <div className="flex flex-col gap-1">
                  <Dialog open={workflowDialogOpen} onOpenChange={setWorkflowDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        {selectedWorkflow ? workflows.find(w => w.id === selectedWorkflow)?.name : 'AI-assisted workflow'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Select Workflow</DialogTitle>
                        <DialogDescription>
                          Choose a workflow to guide your creative thinking process.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-3 py-4 max-h-[60vh] overflow-y-auto">
                        {workflows.map((workflow) => {
                          const Icon = workflow.icon;
                          const colorMap = {
                            Purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500', bgSelected: 'bg-purple-50' },
                            Blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500', bgSelected: 'bg-blue-50' },
                            Amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-500', bgSelected: 'bg-amber-50' },
                            Emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-500', bgSelected: 'bg-emerald-50' },
                            Cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-500', bgSelected: 'bg-cyan-50' },
                          };
                          const colors = colorMap[workflow.color as keyof typeof colorMap] || colorMap.Purple;
                          
                          return (
                            <button
                              key={workflow.id}
                              onClick={() => {
                                setSelectedWorkflow(workflow.id);
                                setWorkflowDialogOpen(false);
                              }}
                              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                                selectedWorkflow === workflow.id
                                  ? `${colors.border} ${colors.bgSelected}`
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${colors.text}`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{workflow.name}</div>
                                <div className="text-sm text-gray-500 mt-1">{workflow.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Improve Prompt Section with Label */}
                <div className="flex flex-col gap-1">
                  <Button className="gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-black">
                    <Wand2 className="w-4 h-4" />
                    Improve my prompt
                  </Button>
                </div>
              </div>

              {/* LLM Model Section with Label - Right Aligned */}
              <div className="flex flex-col gap-1">
                <Dialog open={llmDialogOpen} onOpenChange={setLlmDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Cpu className="w-4 h-4" />
                      {getSelectedLLMNames()}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select LLM Model</DialogTitle>
                      <DialogDescription>
                        Choose the AI model that best fits your needs.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <RadioGroup value={selectedLLM} onValueChange={(value) => {
                        setSelectedLLM(value);
                        setLlmDialogOpen(false);
                      }}>
                        <div className="space-y-3">
                          {AVAILABLE_LLM_MODELS.map((llm) => (
                            <button
                              key={llm.id}
                              onClick={() => {
                                setSelectedLLM(llm.id);
                                setLlmDialogOpen(false);
                              }}
                              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left w-full ${
                                selectedLLM === llm.id
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <Cpu className="w-5 h-5 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{llm.name}</div>
                                <p className="text-sm text-gray-500 mt-1">{llm.provider}</p>
                                <p className="text-sm text-gray-600 mt-1">{llm.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Phase 2: Using centralized UI constants for consistent sizing */}
            <div className="relative -mt-2 bg-gray-100 rounded-lg p-4">
              <Textarea
                placeholder="Describe your context and challenge"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{ minHeight: TEXTAREA_MIN_HEIGHT }}
                maxLength={MAX_PROMPT_LENGTH}
                className="pr-20 resize-none overflow-hidden bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSubmit();
                  }
                }}
                ref={textareaRef}
              />
              <div className="absolute bottom-7 right-7 flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* AI Assistants - Carousel */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-3">
                <label className="text-black">Choose AI Assistant</label>
                <Button
                  onClick={() => navigate('assistant-creator')}
                  className="gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-black"
                >
                  <Plus className="w-4 h-4" />
                  Add Assistant
                </Button>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                {/* Assistant Description */}
                {getAssistantDescription() && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">{getAssistantDescription()}</p>
                  </div>
                )}
                
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                    dragFree: true,
                    containScroll: "trimSnaps",
                  }}
                  className="w-full"
                  style={{ touchAction: 'pan-y' }}
                  setApi={setCarouselApi}
                >
                  <CarouselContent className="-ml-1 md:-ml-2 py-2" style={{ touchAction: 'pan-y' }}>
                    {assistantsWithNone.map((assistant) => {
                      const isSelected = assistant.id === 'none' 
                        ? selectedAssistants.length === 0 && lastClickedAssistant === 'none'
                        : selectedAssistants.includes(assistant.id);
                      const isNone = assistant.id === 'none';
                      
                      return (
                        <CarouselItem key={assistant.id} className="pl-1 md:pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/7 xl:basis-1/8">
                          <button
                            onClick={() => toggleAssistant(assistant.id)}
                            className={`flex flex-col items-center gap-2 w-full group ${isSelected ? 'relative z-10' : ''}`}
                          >
                            <div className={`relative transition-all ${
                              isSelected 
                                ? `ring-4 ${isNone ? 'ring-gray-400' : 'ring-purple-500'} ring-offset-2 rounded-full` 
                                : `group-hover:ring-2 ${isNone ? 'group-hover:ring-gray-300' : 'group-hover:ring-purple-300'} group-hover:ring-offset-2 rounded-full`
                            }`}>
                              <Avatar className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                                <AvatarImage src={assistant.avatar} />
                                <AvatarFallback className={isNone ? 'bg-gray-200 text-gray-500' : assistant.color}>
                                  {assistant.name[0]}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <span className={`text-xs text-center line-clamp-2 transition-colors ${
                              isSelected 
                                ? (isNone ? 'text-gray-600' : 'text-purple-700')
                                : (isNone ? 'text-gray-500 group-hover:text-gray-600' : 'text-gray-700 group-hover:text-purple-600')
                            }`}>
                              {assistant.name}
                            </span>
                          </button>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex left-0 disabled:hidden" />
                  <CarouselNext className="hidden md:flex right-0 disabled:hidden" />
                </Carousel>
                
                {/* Mobile swipe hint */}
                <div className="md:hidden text-center mt-2">
                  <p className="text-xs text-gray-400">Swipe to see more assistants</p>
                </div>
              </div>
              
              {/* Start Weaving Button */}
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!prompt.trim()}
                  className={`gap-2 ${prompt.trim() ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                >
                  <Sparkles className="w-4 h-4" />
                  Start weaving
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Version Info */}
        <div className="py-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <span>Thoughtweaver v1.6.1</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Stable
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

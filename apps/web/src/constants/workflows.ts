export interface WorkflowStepDefinition {
  id: string;
  order: number;
  name: string;
  roleType: 'human' | 'ai';
  description: string;
  assistant?: string; // Single recommended assistant per step
  promptTemplate?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isPreset: boolean;
  recommendedAssistant?: string; // Primary assistant for the entire workflow
  steps: WorkflowStepDefinition[];
}

/**
 * Simple workflow display configuration for the home page
 * 
 * @phase Phase 2 - Extracted from HomePage.tsx for better organization
 */
export interface WorkflowDisplayConfig {
  id: string;
  name: string;
  description: string;
  icon: any; // Lucide icon component
  color: string;
}

export const PRESET_WORKFLOWS: WorkflowDefinition[] = [
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
    recommendedAssistant: 'creative-innovator',
    steps: [
      {
        id: 'si-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Define problem, objectives, constraints',
      },
      {
        id: 'si-2',
        order: 2,
        name: 'Ideate',
        roleType: 'ai',
        description: 'Generate creative and innovative solutions',
        assistant: 'creative-innovator',
        promptTemplate: 'Generate innovative ideas for [problem]. Consider multiple approaches and unconventional solutions.',
      },
      {
        id: 'si-3',
        order: 3,
        name: 'Assess',
        roleType: 'human',
        description: 'Evaluate feasibility and alignment',
      },
      {
        id: 'si-4',
        order: 4,
        name: 'Refine',
        roleType: 'ai',
        description: 'Polish and improve selected concepts',
        assistant: 'incisive-idea-improver',
        promptTemplate: 'Refine the selected ideas. Improve clarity, strengthen value proposition, and address potential concerns.',
      },
      {
        id: 'si-5',
        order: 5,
        name: 'Synthesise',
        roleType: 'human',
        description: 'Select and integrate best concepts',
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
    recommendedAssistant: 'incisive-analyst',
    steps: [
      {
        id: 'cdm-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Define decision criteria',
      },
      {
        id: 'cdm-2',
        order: 2,
        name: 'Generate',
        roleType: 'ai',
        description: 'Identify all possible options',
        assistant: 'all-rounder',
        promptTemplate: 'Generate comprehensive list of options for [decision]. Include conventional and alternative approaches.',
      },
      {
        id: 'cdm-3',
        order: 3,
        name: 'Analyze',
        roleType: 'ai',
        description: 'Evaluate each option systematically',
        assistant: 'incisive-analyst',
        promptTemplate: 'Analyze each option considering: feasibility, costs, risks, benefits, and long-term implications.',
      },
      {
        id: 'cdm-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Question assumptions and identify risks',
        assistant: 'devils-advocate',
        promptTemplate: 'Challenge the analysis. What assumptions might be wrong? What risks are overlooked?',
      },
      {
        id: 'cdm-5',
        order: 5,
        name: 'Assess',
        roleType: 'human',
        description: 'Make final decision',
      },
      {
        id: 'cdm-6',
        order: 6,
        name: 'Present',
        roleType: 'ai',
        description: 'Document decision rationale',
        assistant: 'writing-coach',
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
    recommendedAssistant: 'tech-troubleshooter',
    steps: [
      {
        id: 'rps-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Describe problem and impact',
      },
      {
        id: 'rps-2',
        order: 2,
        name: 'Analyze',
        roleType: 'ai',
        description: 'Diagnose root causes',
        assistant: 'incisive-analyst',
        promptTemplate: 'Analyze the problem systematically. Identify root causes, contributing factors, and patterns.',
      },
      {
        id: 'rps-3',
        order: 3,
        name: 'Generate',
        roleType: 'ai',
        description: 'Propose tactical solutions',
        assistant: 'tech-troubleshooter',
        promptTemplate: 'Generate practical solutions that address the root causes. Focus on quick wins and sustainable fixes.',
      },
      {
        id: 'rps-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Stress-test proposed solutions',
        assistant: 'devils-advocate',
        promptTemplate: 'Challenge the proposed solutions. What could go wrong? What are we missing?',
      },
      {
        id: 'rps-5',
        order: 5,
        name: 'Curate',
        roleType: 'human',
        description: 'Select best solution',
      },
      {
        id: 'rps-6',
        order: 6,
        name: 'Refine',
        roleType: 'ai',
        description: 'Detail implementation plan',
        assistant: 'all-rounder',
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
    recommendedAssistant: 'writing-coach',
    steps: [
      {
        id: 'ccr-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Define audience, purpose, tone',
      },
      {
        id: 'ccr-2',
        order: 2,
        name: 'Generate',
        roleType: 'ai',
        description: 'Create initial draft',
        assistant: 'writing-coach',
        promptTemplate: 'Generate [content type] for [audience] about [topic]. Tone: [tone]. Key points: [points].',
      },
      {
        id: 'ccr-3',
        order: 3,
        name: 'Check',
        roleType: 'ai',
        description: 'Verify accuracy and clarity',
        assistant: 'methodical-proofreader',
        promptTemplate: 'Review the content for accuracy, clarity, and potential issues. Check facts and claims.',
      },
      {
        id: 'ccr-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Critique messaging and effectiveness',
        assistant: 'devils-advocate',
        promptTemplate: 'Critique the content. Is the message clear? Will it resonate with the audience? What could be improved?',
      },
      {
        id: 'ccr-5',
        order: 5,
        name: 'Refine',
        roleType: 'ai',
        description: 'Polish and perfect the content',
        assistant: 'incisive-idea-improver',
        promptTemplate: 'Refine the content based on feedback. Improve flow, strengthen arguments, polish language.',
      },
      {
        id: 'ccr-6',
        order: 6,
        name: 'Assess',
        roleType: 'human',
        description: 'Final approval',
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
    recommendedAssistant: 'diligent-researcher',
    steps: [
      {
        id: 'rs-1',
        order: 1,
        name: 'Frame',
        roleType: 'human',
        description: 'Define research questions',
      },
      {
        id: 'rs-2',
        order: 2,
        name: 'Research',
        roleType: 'ai',
        description: 'Gather information systematically',
        assistant: 'diligent-researcher',
        promptTemplate: 'Research [topic]. Gather key facts, theories, and perspectives from multiple sources.',
      },
      {
        id: 'rs-3',
        order: 3,
        name: 'Analyze',
        roleType: 'ai',
        description: 'Identify patterns and insights',
        assistant: 'data-analyst',
        promptTemplate: 'Analyze the research. Identify patterns, connections, gaps, and key insights.',
      },
      {
        id: 'rs-4',
        order: 4,
        name: 'Challenge',
        roleType: 'ai',
        description: 'Question conclusions and assumptions',
        assistant: 'devils-advocate',
        promptTemplate: 'Challenge the analysis. What biases might exist? What alternative interpretations are possible?',
      },
      {
        id: 'rs-5',
        order: 5,
        name: 'Synthesise',
        roleType: 'ai',
        description: 'Create cohesive understanding',
        assistant: 'all-rounder',
        promptTemplate: 'Synthesize findings into a clear, actionable understanding. Connect insights and draw conclusions.',
      },
      {
        id: 'rs-6',
        order: 6,
        name: 'Assess',
        roleType: 'human',
        description: 'Review and finalize',
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
    recommendedAssistant: 'all-rounder',
    steps: [
      {
        id: 'boa-1',
        order: 1,
        name: 'Moderate',
        roleType: 'moderate',
        description: 'Introduce the topic and frame the discussion',
        assistant: 'all-rounder',
        promptTemplate: 'Welcome the board and introduce the topic: [topic]. Frame the key questions to be discussed.',
      },
      {
        id: 'boa-2',
        order: 2,
        name: 'Question 1',
        roleType: 'human',
        description: 'Present first question to the board',
      },
      {
        id: 'boa-3',
        order: 3,
        name: 'Strategist Perspective',
        roleType: 'ai',
        description: 'Strategic viewpoint on the question',
        assistant: 'visionary-strategist',
        promptTemplate: 'Provide a strategic perspective on this question, considering long-term implications and opportunities.',
      },
      {
        id: 'boa-4',
        order: 4,
        name: 'Critical Analysis',
        roleType: 'ai',
        description: 'Challenge assumptions and identify risks',
        assistant: 'devils-advocate',
        promptTemplate: 'Challenge the assumptions in the question. What risks or alternative viewpoints should be considered?',
      },
      {
        id: 'boa-5',
        order: 5,
        name: 'Creative Solutions',
        roleType: 'ai',
        description: 'Generate innovative approaches',
        assistant: 'creative-innovator',
        promptTemplate: 'Suggest creative and unconventional solutions or approaches to this question.',
      },
      {
        id: 'boa-6',
        order: 6,
        name: 'Moderate',
        roleType: 'moderate',
        description: 'Synthesize insights from advisors',
        assistant: 'all-rounder',
        promptTemplate: 'Summarize the key insights from the advisors and identify common themes or points of disagreement.',
      },
      {
        id: 'boa-7',
        order: 7,
        name: 'Question 2',
        roleType: 'human',
        description: 'Present second question to the board',
      },
      {
        id: 'boa-8',
        order: 8,
        name: 'Data-Driven View',
        roleType: 'ai',
        description: 'Analytical perspective with data focus',
        assistant: 'data-analyst',
        promptTemplate: 'Analyze this question from a data-driven perspective. What metrics or evidence should inform the decision?',
      },
      {
        id: 'boa-9',
        order: 9,
        name: 'Product Perspective',
        roleType: 'ai',
        description: 'Product and user-focused viewpoint',
        assistant: 'product-manager',
        promptTemplate: 'Consider this question from a product and user experience perspective. What would best serve the end users?',
      },
      {
        id: 'boa-10',
        order: 10,
        name: 'Moderate',
        roleType: 'moderate',
        description: 'Final synthesis and recommendations',
        assistant: 'all-rounder',
        promptTemplate: 'Provide a final synthesis of all perspectives shared. Offer balanced recommendations based on the board discussion.',
      },
    ],
  },
];

/**
 * Get simplified workflow display configurations for the home page
 * This extracts just the display info (id, name, description, color) without full workflow steps
 * 
 * @returns Array of workflow display configurations
 * 
 * @phase Phase 2 - Helper function for HomePage refactoring
 */
export function getWorkflowDisplayConfigs(): Array<{
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}> {
  return PRESET_WORKFLOWS.map(w => ({
    id: w.id,
    name: w.name,
    description: w.description,
    icon: w.icon,
    color: w.color
  }));
}

'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Input,
  Textarea,
  Label,
  Switch,
  SidebarTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  SpectrumSlider,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@thoughtweaver/ui';
import { 
  Save,
  ArrowLeft,
  Trash2,
  Sparkles,
  Brain,
  Heart,
  Users,
  Shield,
  EyeOff
} from 'lucide-react';
import { getAssistantById } from './assistantData';
import { useAuth, useNavigation, useSelection } from '../../contexts';

interface AIAssistantEditorProps {
  assistantId?: string;
}

export function AIAssistantEditor({ assistantId }: AIAssistantEditorProps) {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { isAssistantHidden, toggleHiddenAssistant } = useSelection();
  const isNew = assistantId === 'new';
  
  // Load assistant data
  const assistant = !isNew && assistantId ? getAssistantById(assistantId) : null;
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [knowledge, setKnowledge] = useState('');
  const [personalityDescription, setPersonalityDescription] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  
  const [personality, setPersonality] = useState({
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    neuroticism: 50,
  });

  // Initialize form with assistant data
  useEffect(() => {
    if (assistant && assistantId) {
      setName(assistant.name);
      setDescription(assistant.description);
      setSystemPrompt(assistant.systemPrompt || '');
      setPersonality(assistant.personality);
      setIsHidden(isAssistantHidden(assistantId));
    }
  }, [assistant, assistantId, isAssistantHidden]);

  const [avatarSeed] = useState(isNew ? 'NewAssistant' : assistantId || 'Assistant');
  const avatarUrl = assistant?.avatar || 'https://thoughtweaver.ai/avatars/custom-assistant.png';

  const handleTraitChange = (trait: string, value: number[]) => {
    setPersonality(prev => ({
      ...prev,
      [trait]: value[0]
    }));
  };

  const handleSave = () => {
    // Update hidden status
    if (assistantId && isHidden !== isAssistantHidden(assistantId)) {
      toggleHiddenAssistant(assistantId);
    }
    // Save logic here
    navigate('ai-assistants');
  };

  const handleDelete = () => {
    // Delete logic here
    navigate('ai-assistants');
  };

  const generateSystemPrompt = () => {
    if (!name && !description && !knowledge) {
      return;
    }

    const promptParts: string[] = [];
    
    // Introduction
    if (name) {
      promptParts.push(`You are ${name}, an AI assistant specialized in helping users with creative thinking and ideation.`);
    } else {
      promptParts.push(`You are an AI assistant specialized in helping users with creative thinking and ideation.`);
    }

    // Role description
    if (description) {
      promptParts.push(description);
    }

    // Knowledge and expertise
    if (knowledge) {
      promptParts.push(`\n\nYour knowledge and expertise includes: ${knowledge}`);
    }

    // Communication guidelines
    promptParts.push(`\n\nYour approach:\n- Ask thoughtful, probing questions to understand the user's needs\n- Provide clear, actionable insights and suggestions\n- Break down complex ideas into manageable steps\n- Encourage creative exploration while maintaining focus\n- Adapt your communication style to match the user's preferences`);

    // Personality integration
    if (personalityDescription) {
      promptParts.push(`\n\nCommunication style: ${personalityDescription}`);
    }

    setSystemPrompt(promptParts.join(' '));
  };

  const getTraitIcon = (trait: string) => {
    switch (trait) {
      case 'openness': return <Sparkles className="w-4 h-4" />;
      case 'conscientiousness': return <Brain className="w-4 h-4" />;
      case 'extraversion': return <Heart className="w-4 h-4" />;
      case 'agreeableness': return <Shield className="w-4 h-4" />;
      case 'neuroticism': return <Trash2 className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTraitLabels = (trait: string) => {
    switch (trait) {
      case 'openness': return { left: 'Conventional', right: 'Open' };
      case 'conscientiousness': return { left: 'Spontaneous', right: 'Organized' };
      case 'extraversion': return { left: 'Reserved', right: 'Outgoing' };
      case 'agreeableness': return { left: 'Challenging', right: 'Cooperative' };
      case 'neuroticism': return { left: 'Stable', right: 'Sensitive' };
      default: return { left: '', right: '' };
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('ai-assistants')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <SidebarTrigger />
            <h2>{isNew ? 'Create AI Assistant' : 'Edit Assistant'}</h2>
          </div>
          <div className="flex items-center gap-2">
            {!isNew && assistant?.isCustom && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete AI Assistant</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this assistant? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Assistant
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="mb-6">Basic Information</h3>
            
            <div className="flex items-start gap-6 mb-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-purple-500">
                  {name[0] || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="name">Assistant Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Strategic Thinker"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Short Description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the assistant's purpose"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Knowledge & Expertise */}
          <Card className="p-6">
            <h3 className="mb-2">Knowledge & Expertise</h3>
            <p className="text-sm text-gray-600 mb-4">
              Describe the areas of knowledge, domains, and expertise this assistant should have
            </p>
            <Textarea
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
              placeholder="e.g., Expert in market research, consumer behavior analysis, and competitive intelligence. Familiar with quantitative and qualitative research methodologies."
              rows={4}
            />
          </Card>

          {/* System Prompt */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3>System Prompt</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={generateSystemPrompt}
                className="gap-2"
                disabled={!name && !description && !knowledge}
              >
                <Sparkles className="w-4 h-4" />
                Generate
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Define the core instructions and behavior guidelines for this AI assistant. This prompt will be used when the assistant is active in conversations.
            </p>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="e.g., You are a strategic thinking assistant. Your role is to help users think through complex problems by asking probing questions, identifying key assumptions, and suggesting frameworks for analysis. Always maintain a balanced perspective and encourage critical thinking."
              rows={8}
              className="font-mono text-sm"
            />
          </Card>

          {/* Communication Style */}
          <Card className="p-6">
            <h3 className="mb-2">Communication Style</h3>
            <p className="text-sm text-gray-600 mb-4">
              Define how this assistant should communicate and interact with users
            </p>
            <Textarea
              value={personalityDescription}
              onChange={(e) => setPersonalityDescription(e.target.value)}
              placeholder="e.g., Professional and thorough. Asks clarifying questions before making recommendations. Prefers structured approaches and backs up suggestions with reasoning."
              rows={4}
            />
          </Card>

          {/* Personality Traits */}
          <Card className="p-6">
            <h3 className="mb-2">Personality Traits</h3>
            <p className="text-sm text-gray-600 mb-6">
              Fine-tune the assistant's behavioral characteristics
            </p>

            <div className="space-y-6">
              {Object.entries(personality).map(([trait, value]) => {
                const labels = getTraitLabels(trait);
                return (
                  <div key={trait}>
                    <div className="flex items-center gap-2 mb-3">
                      {getTraitIcon(trait)}
                      <Label className="capitalize">{trait}</Label>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500 w-24 text-right">{labels.left}</span>
                      <SpectrumSlider
                        value={[value]}
                        onValueChange={(val) => handleTraitChange(trait, val)}
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500 w-24">{labels.right}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                💡 <strong>Tip:</strong> Adjust these sliders to fine-tune how your assistant approaches problems and communicates
              </p>
            </div>
          </Card>

          {/* Hide Assistant Toggle */}
          {!isNew && (
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <EyeOff className="w-5 h-5 text-gray-600" />
                  <div>
                    <Label htmlFor="hide-assistant" className="cursor-pointer">
                      Hide Assistant
                    </Label>
                    <p className="text-sm text-gray-600">
                      Hidden assistants won't appear on the home page carousel
                    </p>
                  </div>
                </div>
                <Switch
                  id="hide-assistant"
                  checked={isHidden}
                  onCheckedChange={setIsHidden}
                />
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

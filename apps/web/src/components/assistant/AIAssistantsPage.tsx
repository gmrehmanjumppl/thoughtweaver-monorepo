import { useState, memo, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Button,
  Card,
  SidebarTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
} from '@thoughtweaver/ui';
import { 
  Plus,
  Edit,
  GripVertical
} from 'lucide-react';
import { assistants as assistantData, Assistant } from './assistantData';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

import { useAuth, useNavigation, useSelection } from '../../contexts';

// Memoized Draggable Assistant Card Component for Performance
const AssistantCard = memo(({ 
  assistant, 
  index,
  onEdit,
  moveAssistant,
  onDragEnd,
  isHidden
}: { 
  assistant: Assistant;
  index: number;
  onEdit: (id: string) => void;
  moveAssistant: (dragIndex: number, hoverIndex: number) => void;
  onDragEnd: () => void;
  isHidden: boolean;
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'assistant-card',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      onDragEnd();
    },
  });

  const [, drop] = useDrop({
    accept: 'assistant-card',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveAssistant(item.index, index);
        item.index = index;
      }
    },
  });
  // Transform personality data for radar chart
  const personalityChartData = [
    { trait: 'Openness', value: assistant.personality.openness },
    { trait: 'Conscientiousness', value: assistant.personality.conscientiousness },
    { trait: 'Extraversion', value: assistant.personality.extraversion },
    { trait: 'Agreeableness', value: assistant.personality.agreeableness },
    { trait: 'Emotional Stability', value: 100 - assistant.personality.neuroticism },
  ];

  // Get color from Tailwind class
  const colorMap: Record<string, string> = {
    'bg-purple-500': '#a855f7',
    'bg-blue-600': '#2563eb',
    'bg-indigo-600': '#4f46e5',
    'bg-pink-600': '#db2777',
    'bg-green-600': '#16a34a',
    'bg-amber-700': '#b45309',
    'bg-violet-600': '#7c3aed',
    'bg-slate-600': '#475569',
    'bg-emerald-700': '#047857',
    'bg-fuchsia-600': '#c026d3',
    'bg-blue-700': '#1d4ed8',
    'bg-cyan-600': '#0891b2',
    'bg-gray-700': '#374151',
    'bg-teal-700': '#0f766e',
    'bg-lime-700': '#4d7c0f',
    'bg-rose-600': '#e11d48',
    'bg-orange-700': '#c2410c',
    'bg-red-600': '#dc2626',
    'bg-yellow-600': '#ca8a04',
    'bg-green-700': '#15803d',
    'bg-indigo-700': '#4338ca',
    'bg-stone-700': '#44403c',
    'bg-purple-700': '#7e22ce',
    'bg-sky-700': '#0369a1',
    'bg-neutral-700': '#404040',
    'bg-sky-600': '#0284c7',
    'bg-violet-700': '#6d28d9',
    'bg-emerald-600': '#059669',
    'bg-red-700': '#b91c1c',
    'bg-zinc-700': '#3f3f46',
    'bg-blue-800': '#1e40af',
    'bg-lime-600': '#65a30d',
    'bg-gray-800': '#1f2937',
    'bg-teal-600': '#0d9488',
    'bg-purple-800': '#6b21a8',
    'bg-indigo-800': '#3730a3',
    'bg-green-800': '#166534',
    'bg-orange-600': '#ea580c',
    'bg-amber-600': '#d97706',
    'bg-sky-800': '#075985',
    'bg-rose-700': '#be123c',
  };
  const chartColor = colorMap[assistant.color] || '#a855f7';

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={`transition-all ${isDragging ? 'opacity-50 scale-105' : 'opacity-100'}`}
    >
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow relative ${isHidden ? 'opacity-50 grayscale' : ''}`}>
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
              onEdit(assistant.id);
            }}
            className="h-6 w-6 -mr-2"
          >
            <Edit className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Card Content */}
        <div className="px-6 pt-0 pb-6">
          {/* Header with Avatar and Name */}
          <div className="flex items-start gap-4 mb-6 mt-4">
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarImage src={assistant.avatar} />
              <AvatarFallback className={assistant.color}>
                {assistant.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="truncate">{assistant.name}</h3>
                {assistant.isCustom && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0">Custom</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{assistant.description}</p>
            </div>
          </div>

          {/* Personality Radar Chart */}
          <div className="overflow-visible -mx-2">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart cx="50%" cy="50%" outerRadius="55%" data={personalityChartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar 
                  name="Personality" 
                  dataKey="value" 
                  stroke="none"
                  fill={chartColor} 
                  fillOpacity={0.65} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
});

export function AIAssistantsPage() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { assistantOrder, setAssistantOrder, isAssistantHidden } = useSelection();

  // Get assistants in user's preferred order
  const [orderedAssistants, setOrderedAssistants] = useState(() => {
    return assistantOrder
      .map(id => assistantData.find(a => a.id === id))
      .filter(Boolean) as Assistant[];
  });

  // Sync with context when assistantOrder changes
  useEffect(() => {
    setOrderedAssistants(
      assistantOrder
        .map(id => assistantData.find(a => a.id === id))
        .filter(Boolean) as Assistant[]
    );
  }, [assistantOrder]);

  const moveAssistant = useCallback((dragIndex: number, hoverIndex: number) => {
    setOrderedAssistants((prev) => {
      const newOrder = [...prev];
      const draggedAssistant = newOrder[dragIndex];
      newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, draggedAssistant);
      return newOrder;
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    // Save the current order to context when drag ends
    const newOrderIds = orderedAssistants.map(a => a.id);
    setAssistantOrder(newOrderIds);
  }, [orderedAssistants, setAssistantOrder]);

  const handleEdit = (assistantId: string) => {
    navigate(`ai-assistant-editor-${assistantId}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Assistants</h2>
          </div>
          <Button onClick={() => navigate('ai-assistant-editor-new')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Assistant
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Assistant Grid - 3 columns */}
          <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {orderedAssistants.map((assistant, index) => (
                <AssistantCard 
                  key={assistant.id} 
                  assistant={assistant}
                  index={index}
                  onEdit={handleEdit}
                  moveAssistant={moveAssistant}
                  onDragEnd={handleDragEnd}
                  isHidden={isAssistantHidden(assistant.id)}
                />
              ))}
            </div>
          </DndProvider>
        </div>
      </main>
    </div>
  );
}

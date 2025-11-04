import { useState, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Button,
  Card,
  SidebarTrigger,
  Checkbox,
  Label,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@thoughtweaver/ui';
import { 
  Save,
  AlertCircle,
  GripVertical
} from 'lucide-react';

import { useAuth, useNavigation, useSelection } from '../../contexts';
import { assistants } from '../assistant/assistantData';

// Draggable Assistant Item Component
interface DraggableAssistantItemProps {
  assistant: typeof assistants[0];
  index: number;
  moveAssistant: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableAssistantItem = ({ assistant, index, moveAssistant }: DraggableAssistantItemProps) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'assistant',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'assistant',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveAssistant(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={`transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
        <div
          ref={drag}
          className="flex-shrink-0 cursor-move hover:bg-gray-100 rounded p-1"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={assistant.avatar} alt={assistant.name} />
          <AvatarFallback className={assistant.color}>
            {assistant.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{assistant.name}</p>
          <p className="text-xs text-gray-500 truncate">{assistant.description}</p>
        </div>
      </div>
    </div>
  );
};

export function PreferencesPage() {
  const { user, login } = useAuth();
  const { navigate } = useNavigation();
  const { assistantOrder, setAssistantOrder } = useSelection();
  const [hasChanges, setHasChanges] = useState(false);

  // Get assistants in current order
  const [orderedAssistants, setOrderedAssistants] = useState(() => {
    return assistantOrder
      .map(id => assistants.find(a => a.id === id))
      .filter(Boolean) as typeof assistants;
  });

  // Sync with context when assistantOrder changes (e.g., on page load)
  useEffect(() => {
    setOrderedAssistants(
      assistantOrder
        .map(id => assistants.find(a => a.id === id))
        .filter(Boolean) as typeof assistants
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
    setHasChanges(true);
  }, []);

  const handleSave = () => {
    // Save assistant order to context (which persists to localStorage)
    setAssistantOrder(orderedAssistants.map(a => a.id));
    setHasChanges(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Preferences</h2>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Assistant Order Preferences */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="mb-2">Assistant Display Order</h3>
              <p className="text-sm text-gray-600">
                Drag to reorder how assistants appear in the home page carousel and Assistants page
              </p>
            </div>

            <DndProvider backend={HTML5Backend}>
              <div className="space-y-2">
                {orderedAssistants.map((assistant, index) => (
                  <DraggableAssistantItem
                    key={assistant.id}
                    assistant={assistant}
                    index={index}
                    moveAssistant={moveAssistant}
                  />
                ))}
              </div>
            </DndProvider>
          </Card>
        </div>
      </main>
    </div>
  );
}

'use client';

/**
 * ContextSelector Component
 * 
 * Modal dialog for selecting a context to apply to the current page/conversation
 */

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Checkbox,
  Label,
  Badge,
} from '@thoughtweaver/ui';
import { FileText, Share2 } from 'lucide-react';
import { useContextCards } from '../../contexts';

interface ContextSelectorProps {
  /** Optional callback when context is selected */
  onContextChange?: (contextIds: string[]) => void;
}

export function ContextSelector({ onContextChange }: ContextSelectorProps) {
  const { contexts, selectedContextIds, setSelectedContextIds } = useContextCards();
  const [open, setOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<string[]>(selectedContextIds);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // When opening, set temp selection to current selection
      setTempSelection(selectedContextIds);
    }
    setOpen(newOpen);
  };

  const handleApply = () => {
    setSelectedContextIds(tempSelection);
    if (onContextChange) {
      onContextChange(tempSelection);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setTempSelection(selectedContextIds);
    setOpen(false);
  };

  const handleNoneToggle = (checked: boolean) => {
    if (checked) {
      // When None is checked, clear all selections
      setTempSelection([]);
    }
  };

  const handleContextToggle = (contextId: string, checked: boolean) => {
    if (checked) {
      // Add to selection
      setTempSelection(prev => [...prev, contextId]);
    } else {
      // Remove from selection
      setTempSelection(prev => prev.filter(id => id !== contextId));
    }
  };

  const isNoneSelected = tempSelection.length === 0;

  // Display text for button
  let displayText = 'None';
  if (selectedContextIds.length === 1) {
    const context = contexts.find(c => c.id === selectedContextIds[0]);
    displayText = context?.name || 'None';
  } else if (selectedContextIds.length > 1) {
    displayText = `${selectedContextIds.length} contexts`;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 w-full justify-start">
          <FileText className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            <span className="text-muted-foreground">Context:</span> {displayText}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Context</DialogTitle>
          <DialogDescription>
            Choose a context to reference for this page. Context helps AI assistants understand your specific needs and preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="space-y-3">
            {/* None option */}
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <Checkbox 
                id="none" 
                checked={isNoneSelected}
                onCheckedChange={handleNoneToggle}
                className="mt-1"
              />
              <Label htmlFor="none" className="flex-1 cursor-pointer">
                <div>
                  <p className="text-sm">None</p>
                  <p className="text-xs text-gray-500 mt-1">
                    No context will be applied
                  </p>
                </div>
              </Label>
            </div>

            {/* Context cards */}
            {contexts.map((context) => (
              <div 
                key={context.id}
                className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <Checkbox 
                  id={context.id} 
                  checked={tempSelection.includes(context.id)}
                  onCheckedChange={(checked) => handleContextToggle(context.id, checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor={context.id} className="flex-1 cursor-pointer">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm">{context.name}</p>
                      {context.shared && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Share2 className="w-3 h-3" />
                          Shared
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {context.content}
                    </p>
                  </div>
                </Label>
              </div>
            ))}

            {contexts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">No contexts available</p>
                <p className="text-xs mt-1">Create contexts in the Context page to use them here</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

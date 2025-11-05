'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Textarea,
  Badge,
  SidebarTrigger,
  Switch,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@thoughtweaver/ui';
import { 
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
  Share2,
  Sparkles,
  User
} from 'lucide-react';
import { useAuth, useContextCards } from '../../contexts';

export function ContextPage() {
  const { user } = useAuth();
  const { contexts, addContext, updateContext, deleteContext } = useContextCards();
  
  // Learned About You state
  const [learnedContent, setLearnedContent] = useState(
    'Based on our conversations, you are working on a fitness application focused on habit building. You prefer clean, minimal design aesthetics and value user experience highly. You tend to think strategically about product decisions and often consider the long-term implications of design choices.'
  );
  const [learnedShared, setLearnedShared] = useState(true); // Default is ON
  const [isEditingLearned, setIsEditingLearned] = useState(false);
  const [learnedEditContent, setLearnedEditContent] = useState('');
  const [learnedEditShared, setLearnedEditShared] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editShared, setEditShared] = useState(false);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contextToDelete, setContextToDelete] = useState<string | null>(null);
  
  // Learned About You functions
  const startEditingLearned = () => {
    setLearnedEditContent(learnedContent);
    setLearnedEditShared(learnedShared);
    setIsEditingLearned(true);
  };
  
  const saveLearned = () => {
    setLearnedContent(learnedEditContent);
    setLearnedShared(learnedEditShared);
    setIsEditingLearned(false);
  };
  
  const cancelEditingLearned = () => {
    setIsEditingLearned(false);
    setLearnedEditContent('');
    setLearnedEditShared(learnedShared);
  };

  const addNewContext = () => {
    const newContext = {
      id: Date.now().toString(),
      name: 'New Context',
      content: '',
      shared: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addContext(newContext);
    startEditing(newContext.id, newContext.name, newContext.content, newContext.shared);
  };

  const startEditing = (id: string, name: string, content: string, shared: boolean) => {
    setEditingId(id);
    setEditName(name);
    setEditContent(content);
    setEditShared(shared);
  };

  const saveContextChanges = (id: string) => {
    updateContext(id, { name: editName, content: editContent, shared: editShared });
    setEditingId(null);
  };

  const cancelEditing = () => {
    // If it's a new context with empty content, remove it
    const context = contexts.find(c => c.id === editingId);
    if (context && context.name === 'New Context' && context.content === '') {
      confirmDeleteContext(editingId!);
    }
    setEditingId(null);
  };

  const confirmDeleteContext = (id: string) => {
    setContextToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteContext = () => {
    if (contextToDelete) {
      deleteContext(contextToDelete);
      if (editingId === contextToDelete) {
        setEditingId(null);
      }
      setContextToDelete(null);
    }
    setDeleteDialogOpen(false);
  };
  
  const cancelDelete = () => {
    setContextToDelete(null);
    setDeleteDialogOpen(false);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2>Context</h2>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Info Card */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">What is Context?</h3>
                <p className="text-sm text-gray-700">
                  Context cards store important information that can be shared across conversations. 
                  Use them for project details, design systems, brand guidelines, or any reference material 
                  you want AI assistants to remember.
                </p>
              </div>
            </div>
          </Card>

          {/* Context Cards Section Header */}
          <div className="mb-4">
            <h3 className="text-gray-900">Your Context</h3>
            <p className="text-sm text-gray-600">
              Add and manage contexts
            </p>
          </div>

          {/* Context Cards */}
          {contexts.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="mb-2 text-gray-900">No context cards yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first context card to store important information
                </p>
                <Button onClick={addNewContext} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Context
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {contexts.map((context) => (
                <Card key={context.id} className="overflow-hidden">
                  {editingId === context.id ? (
                    // Edit Mode
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-2 text-sm text-gray-700">Name</label>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="e.g., Project Overview, Brand Guidelines"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm text-gray-700">Content</label>
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Enter the context information..."
                            className="min-h-[150px] resize-none"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Share2 className="w-4 h-4 text-gray-600" />
                            <div>
                              <p className="text-sm">Share across conversations</p>
                              <p className="text-xs text-gray-600">
                                {editShared 
                                  ? 'This context will be available in all conversations' 
                                  : 'This context is private to specific conversations'}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={editShared}
                            onCheckedChange={setEditShared}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-6">
                        <Button onClick={() => saveContextChanges(context.id)} className="gap-2">
                          <Save className="w-4 h-4" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={cancelEditing}>
                          Cancel
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => confirmDeleteContext(context.id)}
                          className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3>{context.name}</h3>
                            {context.shared && (
                              <Badge variant="secondary" className="gap-1 text-xs">
                                <Share2 className="w-3 h-3" />
                                Shared
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Updated {formatDate(context.updatedAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(context.id, context.name, context.content, context.shared)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDeleteContext(context.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{context.content}</p>
                    </div>
                  )}
                </Card>
              ))}
              
              {/* Add Context Button */}
              <Button onClick={addNewContext} variant="outline" className="gap-2 mt-4">
                <Plus className="w-4 h-4" />
                Add Context
              </Button>
            </div>
          )}

          {/* AI-generated context Section */}
          <div className="mt-12 pt-8 border-t-2 border-gray-300">
            <div className="mb-4">
              <h3 className="text-gray-900">AI-generated context</h3>
              <p className="text-sm text-gray-600">
                What Thoughtweaver has learnt about your conversations
              </p>
            </div>

            {/* AI-generated context card */}
            <Card className="overflow-hidden">
              {isEditingLearned ? (
                // Edit Mode
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm text-gray-700">Content</label>
                      <Textarea
                        value={learnedEditContent}
                        onChange={(e) => setLearnedEditContent(e.target.value)}
                        placeholder="What has Thoughtweaver learned about you..."
                        className="min-h-[150px] resize-none"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Share2 className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="text-sm">Share across conversations</p>
                          <p className="text-xs text-gray-600">
                            {learnedEditShared 
                              ? 'This context will be available in all conversations' 
                              : 'This context is private to specific conversations'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={learnedEditShared}
                        onCheckedChange={setLearnedEditShared}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button onClick={saveLearned} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={cancelEditingLearned}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <h3>AI-generated</h3>
                        </div>
                        {learnedShared && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Share2 className="w-3 h-3" />
                            Shared
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={startEditingLearned}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{learnedContent}</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Context Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this context card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContext} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

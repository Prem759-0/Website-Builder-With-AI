import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Type, Image as ImageIcon, Box, Columns, Layout, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Block {
  id: string;
  type: 'hero' | 'features' | 'cta' | 'text' | 'image';
  content: string;
}

interface SortableItemProps {
  id: string;
  block: Block;
  onRemove: (id: string) => void;
}

const SortableItem = React.memo(({ id, block, onRemove }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const icons = {
    hero: <Layout className="text-blue-400" size={18} />,
    features: <Columns className="text-purple-400" size={18} />,
    cta: <Box className="text-yellow-400" size={18} />,
    text: <Type className="text-green-400" size={18} />,
    image: <ImageIcon className="text-pink-400" size={18} />,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 group"
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-white">
        <GripVertical size={20} />
      </button>
      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
        {icons[block.type as keyof typeof icons] || <Box size={18} />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium capitalize">{block.type}</p>
        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{block.content}</p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(id)}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-400/10"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
});

export const LandingPageBuilder = React.memo(() => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'hero', content: 'Main Hero Section' },
    { id: '2', type: 'features', content: 'Feature Grid' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: `New ${type} block content`,
    };
    setBlocks([...blocks, newBlock]);
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-[#0B0F19] h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Layout size={18} className="text-blue-500" />
          Page Sections
        </h3>
        <Button variant="outline" size="sm" className="h-8 border-white/10 hover:bg-white/5">
          Reset
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {blocks.map((block) => (
              <SortableItem 
                key={block.id} 
                id={block.id} 
                block={block} 
                onRemove={(id) => setBlocks(blocks.filter(b => b.id !== id))} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Add Section</p>
        <div className="grid grid-cols-2 gap-2">
          {(['hero', 'features', 'cta', 'text', 'image'] as const).map((type) => (
            <Button
              key={type}
              variant="outline"
              className="justify-start gap-2 h-9 border-white/5 bg-white/5 hover:bg-white/10 text-xs font-medium capitalize"
              onClick={() => addBlock(type)}
            >
              <div className="w-4 h-4 bg-white/10 rounded flex items-center justify-center">
                <Plus size={10} />
              </div>
              {type}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
});



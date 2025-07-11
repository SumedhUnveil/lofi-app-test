import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tracks: Array<{
    id: number;
    title: string;
    artist: string;
    album: string;
    cover: string;
  }>;
  selected: number;
  onSelect: (idx: number) => void;
  onReorder: (from: number, to: number) => void;
}

function SortableTrack({ track, index, selected, onSelect, onReorder, tracksLength }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : undefined,
      }}
      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors select-none ${selected === index ? 'bg-blue-100' : 'hover:bg-gray-100'} ${isDragging ? 'ring-2 ring-pink-400' : ''}`}
      onClick={() => onSelect(index)}
      {...attributes}
      {...listeners}
    >
      <img src={track.cover} alt={track.title} className="w-10 h-10 rounded mr-3 object-cover" />
      <div className="flex-1">
        <div className="font-medium text-gray-800 truncate">{track.title}</div>
        <div className="text-xs text-gray-500 truncate">{track.artist} – {track.album}</div>
      </div>
      <div className="flex flex-col ml-2">
        <button
          className="text-xs text-gray-500 hover:text-blue-600 disabled:opacity-30"
          onClick={e => { e.stopPropagation(); onReorder(index, index - 1); }}
          disabled={index === 0}
          title="Move Up"
        >▲</button>
        <button
          className="text-xs text-gray-500 hover:text-blue-600 disabled:opacity-30"
          onClick={e => { e.stopPropagation(); onReorder(index, index + 1); }}
          disabled={index === tracksLength - 1}
          title="Move Down"
        >▼</button>
      </div>
    </div>
  );
}

const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, tracks, selected, onSelect, onReorder }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tracks.findIndex(t => t.id === active.id);
      const newIndex = tracks.findIndex(t => t.id === over?.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Dialog.Content className="fixed top-0 left-0 h-full w-80 bg-white/90 shadow-2xl z-50 flex flex-col p-4 overflow-y-auto">
          <Dialog.Title className="text-lg font-bold mb-4">Track List</Dialog.Title>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tracks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="flex-1 space-y-2">
                {tracks.map((track, i) => (
                  <SortableTrack
                    key={track.id}
                    track={track}
                    index={i}
                    selected={selected}
                    onSelect={onSelect}
                    onReorder={onReorder}
                    tracksLength={tracks.length}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <Dialog.Close asChild>
            <button className="mt-4 px-4 py-2 rounded bg-pink-200 hover:bg-pink-300 text-pink-900 font-semibold w-full">Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Sheet; 
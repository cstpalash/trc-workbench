'use client';

import React from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Widget as WidgetType } from '@/types';
import { DraggableWidget } from './DraggableWidget';
import { DashboardToolbar } from './DashboardToolbar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  className?: string;
}

export function DashboardLayout({ className }: DashboardLayoutProps) {
  const {
    widgets,
    isEditing,
    updateWidgetPosition
  } = useDashboardStore();

  const [activeWidget, setActiveWidget] = React.useState<WidgetType | null>(null);
  
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const widget = widgets.find(w => w.id === event.active.id);
    setActiveWidget(widget || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    
    if (delta.x !== 0 || delta.y !== 0) {
      const widget = widgets.find(w => w.id === active.id);
      if (widget) {
        // Calculate new grid position based on delta and grid size
        const gridSize = 50; // Adjust based on your grid
        const newX = Math.max(0, widget.position.x + Math.round(delta.x / gridSize));
        const newY = Math.max(0, widget.position.y + Math.round(delta.y / gridSize));
        
        updateWidgetPosition(widget.id, { x: newX, y: newY });
      }
    }
    
    setActiveWidget(null);
  };

  const calculateWidgetStyle = (widget: WidgetType) => {
    const baseSize = 120; // Base grid size in pixels
    const gap = 16; // Gap between widgets
    
    return {
      left: (widget.position.x * (baseSize + gap)) + gap,
      top: (widget.position.y * (baseSize + gap)) + gap,
      width: (widget.size.width * baseSize) + ((widget.size.width - 1) * gap),
      height: (widget.size.height * baseSize) + ((widget.size.height - 1) * gap),
    };
  };

  return (
    <div className={cn('flex flex-col h-screen bg-gray-50', className)}>
      <DashboardToolbar />
      
      <div className="flex-1 relative overflow-auto p-4">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={widgets.map(w => w.id)}>
            <div 
              className="relative w-full h-full min-h-[800px]"
              style={{
                backgroundImage: isEditing ? `
                  linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
                ` : undefined,
                backgroundSize: isEditing ? '136px 136px' : undefined,
              }}
            >
              {widgets.map((widget) => (
                <DraggableWidget
                  key={widget.id}
                  widget={widget}
                  style={calculateWidgetStyle(widget)}
                  isEditing={isEditing}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeWidget && (
              <div 
                className="bg-white rounded-lg shadow-xl border-2 border-blue-300 opacity-90"
                style={calculateWidgetStyle(activeWidget)}
              >
                <div className="p-4 text-gray-700 font-medium">
                  {activeWidget.title}
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

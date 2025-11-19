'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Widget as WidgetType } from '@/types';
import { WidgetContainer } from '../widgets/WidgetContainer';
import { TRCCalendarWidget, CalendarControls } from '../widgets/TRCCalendarWidget';
import { cn } from '@/lib/utils';

interface DraggableWidgetProps {
  widget: WidgetType;
  style: React.CSSProperties;
  isEditing: boolean;
}

export function DraggableWidget({ widget, style, isEditing }: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: widget.id,
    disabled: !isEditing || !widget.isDraggable
  });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderCustomControls = () => {
    if (widget.type === 'trc_calendar') {
      return <CalendarControls config={widget.config} />;
    }
    return null;
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'trc_calendar':
        return <TRCCalendarWidget config={widget.config} />;
      default:
        return (
          <div className="p-4 text-gray-500">
            Widget type &quot;{widget.type}&quot; not implemented
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...dragStyle }}
      className={cn(
        'absolute',
        isDragging && 'z-50 opacity-50'
      )}
      {...(isEditing ? { ...attributes, ...listeners } : {})}
    >
      <WidgetContainer
        widget={widget}
        isEditing={isEditing}
        isDragging={isDragging}
        customControls={renderCustomControls()}
      >
        {renderWidgetContent()}
      </WidgetContainer>
    </div>
  );
}

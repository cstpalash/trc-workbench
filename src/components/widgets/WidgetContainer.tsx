'use client';

import React from 'react';
import {
  XMarkIcon,
  Cog6ToothIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { Widget as WidgetType } from '@/types';
import { useDashboardStore } from '@/stores/dashboardStore';
import { cn } from '@/lib/utils';

interface WidgetContainerProps {
  widget: WidgetType;
  children: React.ReactNode;
  isEditing: boolean;
  isDragging: boolean;
  customControls?: React.ReactNode;
}

export function WidgetContainer({
  widget,
  children,
  isEditing,
  isDragging,
  customControls
}: WidgetContainerProps) {
  const { removeWidget, updateWidget } = useDashboardStore();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showConfig, setShowConfig] = React.useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeWidget(widget.id);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleToggleConfig = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfig(!showConfig);
  };

  const handleToggleVisibility = () => {
    updateWidget(widget.id, { isVisible: !widget.isVisible });
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border transition-all duration-200 flex flex-col',
        isEditing && 'border-blue-200 hover:border-blue-300',
        !isEditing && 'border-gray-200 hover:border-gray-300',
        isDragging && 'shadow-xl border-blue-400',
        isExpanded && 'fixed inset-4 z-40 shadow-2xl',
        !widget.isVisible && 'opacity-50'
      )}
      style={isExpanded ? undefined : { height: '100%' }}
    >
      {/* Widget Header */}
      <div className={cn(
        'flex items-center justify-between p-4 border-b border-gray-100',
        isEditing && 'cursor-move'
      )}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={cn(
              'w-3 h-3 rounded-full',
              widget.isVisible ? 'bg-green-400' : 'bg-gray-400'
            )} />
            {widget.type === 'trc_calendar' && (
              <CalendarDaysIcon className="w-4 h-4 text-blue-600" />
            )}
            <h3 className="font-semibold text-gray-900">
              {widget.title}
            </h3>
          </div>
          
          {isEditing && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded">
                {widget.size.width}×{widget.size.height}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded">
                {widget.position.x},{widget.position.y}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {/* Custom Widget Controls */}
          {!isEditing && customControls && (
            <div className="flex items-center space-x-1 mr-1 px-2 py-1 bg-gray-50 rounded-md border">
              {customControls}
            </div>
          )}
          
          {/* Widget Controls */}
          {isEditing && (
            <>
              <button
                onClick={handleToggleConfig}
                className={cn(
                  'p-1.5 rounded hover:bg-gray-100 transition-colors',
                  showConfig && 'bg-blue-50 text-blue-600'
                )}
                title="Configure Widget"
              >
                <Cog6ToothIcon className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleToggleExpand}
                className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? (
                  <ArrowsPointingInIcon className="w-4 h-4" />
                ) : (
                  <ArrowsPointingOutIcon className="w-4 h-4" />
                )}
              </button>
              
              <button
                onClick={handleRemove}
                className="p-1.5 rounded hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Remove Widget"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Widget Configuration Panel */}
      {showConfig && isEditing && (
        <div className="border-b border-gray-100 bg-gray-50 p-4">
          <h4 className="font-medium text-gray-900 mb-3">Widget Configuration</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-600 mb-1">Visibility</label>
              <button
                onClick={handleToggleVisibility}
                className={cn(
                  'px-3 py-1 rounded text-xs font-medium',
                  widget.isVisible 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                )}
              >
                {widget.isVisible ? 'Visible' : 'Hidden'}
              </button>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Resizable</label>
              <span className={cn(
                'px-3 py-1 rounded text-xs font-medium',
                widget.isResizable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              )}>
                {widget.isResizable ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div className={cn(
        'flex-1 min-h-0',
        isExpanded ? 'overflow-auto' : ''
      )}>
        {children}
      </div>

      {/* Resize Handle (when editing) */}
      {isEditing && widget.isResizable && !isExpanded && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-400 rounded-sm" />
        </div>
      )}
    </div>
  );
}

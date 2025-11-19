import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DashboardLayout, Widget, WidgetType, WidgetPosition, WidgetSize } from '@/types';

interface DashboardState {
  layouts: DashboardLayout[];
  activeLayoutId: string | null;
  widgets: Widget[];
  isEditing: boolean;
  
  // Actions
  setActiveLayout: (layoutId: string) => void;
  addWidget: (widget: Omit<Widget, 'id'>) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  updateWidgetPosition: (widgetId: string, position: WidgetPosition) => void;
  updateWidgetSize: (widgetId: string, size: WidgetSize) => void;
  setEditMode: (editing: boolean) => void;
  saveLayout: (layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteLayout: (layoutId: string) => void;
  resetToDefault: () => void;
}

const defaultWidgets: Widget[] = [
  {
    id: 'trc-calendar-1',
    type: WidgetType.TRC_CALENDAR,
    title: 'TRC Events Calendar',
    config: {
      view: 'month',
      showEventTypes: ['internal_audit', 'regulatory_audit', 'recertification', 'core_issue'],
      enableAdmin: true
    },
    position: { x: 0, y: 0 },
    size: { width: 8, height: 6 },
    isVisible: true,
    isResizable: true,
    isDraggable: true,
    minSize: { width: 4, height: 4 },
    maxSize: { width: 12, height: 8 }
  }
];

const defaultLayout: DashboardLayout = {
  id: 'default-layout',
  name: 'Default Layout',
  widgets: defaultWidgets,
  userId: 'current-user',
  isDefault: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      layouts: [defaultLayout],
      activeLayoutId: 'default-layout',
      widgets: defaultWidgets,
      isEditing: false,

      setActiveLayout: (layoutId: string) => {
        const layout = get().layouts.find(l => l.id === layoutId);
        if (layout) {
          set({ 
            activeLayoutId: layoutId, 
            widgets: layout.widgets 
          });
        }
      },

      addWidget: (widget: Omit<Widget, 'id'>) => {
        const id = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newWidget: Widget = { ...widget, id };
        
        set(state => ({
          widgets: [...state.widgets, newWidget],
          layouts: state.layouts.map(layout => 
            layout.id === state.activeLayoutId 
              ? { ...layout, widgets: [...layout.widgets, newWidget], updatedAt: new Date() }
              : layout
          )
        }));
      },

      removeWidget: (widgetId: string) => {
        set(state => ({
          widgets: state.widgets.filter(w => w.id !== widgetId),
          layouts: state.layouts.map(layout =>
            layout.id === state.activeLayoutId
              ? { ...layout, widgets: layout.widgets.filter(w => w.id !== widgetId), updatedAt: new Date() }
              : layout
          )
        }));
      },

      updateWidget: (widgetId: string, updates: Partial<Widget>) => {
        set(state => ({
          widgets: state.widgets.map(w => w.id === widgetId ? { ...w, ...updates } : w),
          layouts: state.layouts.map(layout =>
            layout.id === state.activeLayoutId
              ? { 
                  ...layout, 
                  widgets: layout.widgets.map(w => w.id === widgetId ? { ...w, ...updates } : w),
                  updatedAt: new Date()
                }
              : layout
          )
        }));
      },

      updateWidgetPosition: (widgetId: string, position: WidgetPosition) => {
        get().updateWidget(widgetId, { position });
      },

      updateWidgetSize: (widgetId: string, size: WidgetSize) => {
        get().updateWidget(widgetId, { size });
      },

      setEditMode: (editing: boolean) => {
        set({ isEditing: editing });
      },

      saveLayout: (layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>) => {
        const id = `layout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newLayout: DashboardLayout = {
          ...layout,
          id,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set(state => ({
          layouts: [...state.layouts, newLayout]
        }));
      },

      deleteLayout: (layoutId: string) => {
        set(state => {
          const filteredLayouts = state.layouts.filter(l => l.id !== layoutId);
          const newActiveId = state.activeLayoutId === layoutId 
            ? (filteredLayouts[0]?.id || null) 
            : state.activeLayoutId;
          
          return {
            layouts: filteredLayouts,
            activeLayoutId: newActiveId,
            widgets: newActiveId ? filteredLayouts.find(l => l.id === newActiveId)?.widgets || [] : []
          };
        });
      },

      resetToDefault: () => {
        set({
          layouts: [defaultLayout],
          activeLayoutId: 'default-layout',
          widgets: defaultWidgets,
          isEditing: false
        });
      }
    }),
    {
      name: 'trc-dashboard-storage',
      partialize: (state) => ({
        layouts: state.layouts,
        activeLayoutId: state.activeLayoutId
      }),
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        if (state?.layouts) {
          // Convert string dates back to Date objects after hydration
          state.layouts = state.layouts.map(layout => ({
            ...layout,
            createdAt: new Date(layout.createdAt),
            updatedAt: new Date(layout.updatedAt)
          }));
        }
      },
    }
  )
);

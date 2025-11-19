'use client';

import React, { useCallback } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { useEventsStore } from '@/stores/eventsStore';
import { useUserStore } from '@/stores/userStore';
import { TRCEvent, EventType, EventPriority, EventStatus, UserPersona } from '@/types';

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: TRCEvent;
};

import { EventModal } from './EventModal';
import { AddEventModal } from './AddEventModal';
import { 
  CalendarDaysIcon, 
  PlusIcon,
  EyeIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';
import { cn, getEventTypeColor, getPriorityColor } from '@/lib/utils';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
});

// Create a context for calendar actions
const CalendarContext = React.createContext<{
  handleAddEvent: () => void;
} | null>(null);

interface TRCCalendarWidgetProps {
  config: {
    view?: 'month' | 'week' | 'day' | 'agenda';
    enableAdmin?: boolean;
    showEventTypes?: EventType[];
  };
}

export const useCalendarContext = () => {
  const context = React.useContext(CalendarContext);
  return context;
};

export function CalendarControls({ config }: {
  config: TRCCalendarWidgetProps['config'];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">TRC Events Calendar</span>
    </div>
  );
}

export function TRCCalendarWidget({ config }: TRCCalendarWidgetProps) {
  const { events, addEvent, updateEvent, deleteEvent, getMyEvents } = useEventsStore();
  const { currentUser, getUsersByPersona } = useUserStore();
  
  const [isClient, setIsClient] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState<Date | null>(null);
  const [currentView, setCurrentView] = React.useState<View>((config.view as View) || 'month');
  const [selectedEvent, setSelectedEvent] = React.useState<TRCEvent | null>(null);
  const [showEventModal, setShowEventModal] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  
  // Initialize with all event types explicitly
  const defaultEventTypes = React.useMemo(() => Object.values(EventType), []);
  const [eventTypeFilter, setEventTypeFilter] = React.useState<EventType[]>(() => 
    defaultEventTypes
  );
  const [priorityFilter, setPriorityFilter] = React.useState<EventPriority[]>(
    Object.values(EventPriority)
  );
  const [statusFilter, setStatusFilter] = React.useState<EventStatus[]>(
    Object.values(EventStatus)
  );
  const [showFilters, setShowFilters] = React.useState<boolean>(false);

  // Check if current user is TRC Admin (only role that can add/edit/delete)
  const isTrcAdmin = React.useMemo(() => {
    return currentUser?.persona === UserPersona.TRC_ADMIN;
  }, [currentUser]);

  // Handle client-side rendering to prevent hydration mismatches
  React.useEffect(() => {
    setIsClient(true);
    setCurrentDate(new Date());
  }, []);

  const handleAddEvent = () => {
    const now = new Date();
    const endDate = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
    
    setSelectedEvent({
      id: '',
      title: '',
      description: '',
      startDate: now,
      endDate: endDate,
      type: EventType.INTERNAL_AUDIT,
      priority: EventPriority.MEDIUM,
      status: EventStatus.SCHEDULED,
      createdBy: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    setIsEditMode(false);
    setShowAddModal(true);
  };

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event.resource);
  }, []);

  const handleSelectSlot = React.useCallback((slotInfo: any) => {
    if (!isTrcAdmin) return;
    
    const startDate = new Date(slotInfo.start);
    const endDate = new Date(slotInfo.end || slotInfo.start);
    
    // If the selected time span is less than an hour, make it exactly one hour
    if (endDate.getTime() - startDate.getTime() < 60 * 60 * 1000) {
      endDate.setTime(startDate.getTime() + 60 * 60 * 1000);
    }
    
    setSelectedEvent({
      id: '',
      title: '',
      description: '',
      startDate,
      endDate,
      type: EventType.INTERNAL_AUDIT,
      priority: EventPriority.MEDIUM,
      status: EventStatus.SCHEDULED,
      createdBy: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    setIsEditMode(false);
    setShowAddModal(true);
  }, [isTrcAdmin]);

  const handleNavigate = React.useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = React.useCallback((newView: View) => {
    setCurrentView(newView);
  }, []);

  const handleEventSave = React.useCallback((eventData: Partial<TRCEvent>) => {
    if (isEditMode && selectedEvent?.id) {
      updateEvent(selectedEvent.id, eventData);
    } else {
      const newEvent: TRCEvent = {
        id: Date.now().toString(),
        createdBy: currentUser?.id || 'current-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...eventData,
      } as TRCEvent;
      
      addEvent(newEvent);
    }
    
    setShowAddModal(false);
    setSelectedEvent(null);
    setIsEditMode(false);
  }, [isEditMode, selectedEvent, addEvent, updateEvent, currentUser]);

  // Filter events based on type, priority and status
  const filteredEvents = React.useMemo(() => {
    if (!isClient) return [];
    
    return events.filter(event => 
      eventTypeFilter.includes(event.type) &&
      priorityFilter.includes(event.priority) &&
      statusFilter.includes(event.status)
    );
  }, [isClient, events, eventTypeFilter, priorityFilter, statusFilter]);

  // Transform TRC events to react-big-calendar events
  const calendarEvents = React.useMemo(() => {
    if (!isClient) return [];
    
    return filteredEvents.map((event) => {
      const startDate = new Date(event.startDate);
      const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 60 * 60 * 1000);

      const isAllDay = endDate.getTime() - startDate.getTime() >= 24 * 60 * 60 * 1000;

      const calendarEvent = {
        id: event.id,
        title: event.title,
        start: startDate,
        end: endDate,
        allDay: isAllDay,
        resource: event,
      };

      return calendarEvent;
    });
  }, [isClient, filteredEvents]);

  // Get upcoming events
  const upcomingEvents = React.useMemo(() => {
    if (!isClient) return [];
    
    const now = new Date();
    
    const upcoming = filteredEvents
      .filter(event => {
        const eventDate = new Date(event.startDate);
        const isUpcoming = eventDate >= now;
        return isUpcoming;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 10);
    
    return upcoming;
  }, [isClient, filteredEvents]);

  const CustomToolbar = ({ label, onNavigate, onView, view }: any) => {
    return (
      <div className="flex items-center justify-between mb-4 p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
          <div className="flex space-x-1">
            <button
              onClick={() => onNavigate('PREV')}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <button
              onClick={() => onNavigate('TODAY')}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              Today
            </button>
            <button
              onClick={() => onNavigate('NEXT')}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              →
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {['month', 'week', 'day', 'agenda'].map((viewName) => (
            <button
              key={viewName}
              onClick={() => {
                onView(viewName);
              }}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                view === viewName
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
            </button>
          ))}
        </div>

        {isTrcAdmin && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddEvent}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        )}
        
        {!isTrcAdmin && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 italic px-3 py-2">
              Only TRC Admin can add, edit, or delete events
            </span>
          </div>
        )}
      </div>
    );
  };

  const eventStyleGetter = (event: any) => {
    const trcEvent: TRCEvent = event.resource;
    const baseStyle = {
      borderRadius: '6px',
      border: '1px solid rgba(255,255,255,0.2)',
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      padding: '4px 6px',
      minHeight: '24px',
      lineHeight: '1.2',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      zIndex: '10',
    };

    switch (trcEvent.priority) {
      case EventPriority.CRITICAL:
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#dc2626',
            color: 'white',
          }
        };
      case EventPriority.HIGH:
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#ea580c',
            color: 'white',
          }
        };
      case EventPriority.MEDIUM:
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#ca8a04',
            color: 'white',
          }
        };
      case EventPriority.LOW:
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#65a30d',
            color: 'white',
          }
        };
      default:
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#6b7280',
            color: 'white',
          }
        };
    }
  };

  return (
    <CalendarContext.Provider value={{ handleAddEvent }}>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Calendar */}
          <div className="flex-1 p-4 min-h-0 overflow-hidden flex flex-col">
            {/* Filter Section */}
            <div className="relative mb-4 flex justify-end">
              {/* Filter Toggle Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
                    showFilters ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586l-4-2v-2.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm font-medium">Filters</span>
                  {(eventTypeFilter.length !== Object.values(EventType).length || 
                    priorityFilter.length !== Object.values(EventPriority).length || 
                    statusFilter.length !== Object.values(EventStatus).length) && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </button>

                {/* Filter Panel */}
                {showFilters && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4">
                    <div className="space-y-4">
                      {/* Event Type Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {Object.values(EventType).map(type => (
                            <label key={type} className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                className="h-3 w-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                checked={eventTypeFilter.includes(type)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEventTypeFilter([...eventTypeFilter, type]);
                                  } else {
                                    setEventTypeFilter(eventTypeFilter.filter((t: EventType) => t !== type));
                                  }
                                }}
                              />
                              <span className="ml-2 text-gray-600">{type.replace('_', ' ')}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Priority Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <div className="space-y-1">
                          {Object.values(EventPriority).map(priority => (
                            <label key={priority} className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                className="h-3 w-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                checked={priorityFilter.includes(priority)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setPriorityFilter([...priorityFilter, priority]);
                                  } else {
                                    setPriorityFilter(priorityFilter.filter((p: EventPriority) => p !== priority));
                                  }
                                }}
                              />
                              <span className="ml-2 text-gray-600">{priority}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Initial Status</label>
                        <div className="space-y-1">
                          {Object.values(EventStatus).map(status => (
                            <label key={status} className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                className="h-3 w-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                checked={statusFilter.includes(status)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setStatusFilter([...statusFilter, status]);
                                  } else {
                                    setStatusFilter(statusFilter.filter((s: EventStatus) => s !== status));
                                  }
                                }}
                              />
                              <span className="ml-2 text-gray-600">{status.replace('_', ' ')}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Clear All Filters Button */}
                      <div className="pt-2 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setEventTypeFilter(Object.values(EventType));
                            setPriorityFilter(Object.values(EventPriority));
                            setStatusFilter(Object.values(EventStatus));
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isClient ? (
              <div className="flex-1 min-h-0">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  date={currentDate || new Date()}
                  onNavigate={handleNavigate}
                  view={currentView}
                  onView={handleViewChange}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  selectable={isTrcAdmin}
                  eventPropGetter={eventStyleGetter}
                  style={{ height: '100%' }}
                  className="trc-calendar"
                  step={30}
                  timeslots={2}
                  showMultiDayTimes={true}
                  popup={true}
                  popupOffset={30}
                  dayLayoutAlgorithm="no-overlap"
                  min={new Date(1970, 1, 1, 6, 0, 0)}
                  max={new Date(1970, 1, 1, 22, 0, 0)}
                  scrollToTime={new Date(1970, 1, 1, 8, 0, 0)}
                  components={{
                    toolbar: CustomToolbar,
                  }}
                  formats={{
                    eventTimeRangeFormat: ({ start, end }: any, culture: any, localizer: any) =>
                      `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
                    agendaTimeFormat: 'HH:mm',
                    agendaTimeRangeFormat: ({ start, end }: any, culture: any, localizer: any) =>
                      `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center flex-1 text-gray-500">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p>Loading calendar...</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-72 border-l border-gray-100 bg-gray-50 flex flex-col min-h-0">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Upcoming Events
                </h4>
                <span className="text-sm text-gray-500">
                  {upcomingEvents.length} events
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 trc-upcoming-events-container">
              <div className="space-y-3">
                {isClient ? (
                  upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event: TRCEvent) => (
                      <div
                        key={event.id}
                        onClick={() => {
                          setSelectedEvent(event);
                          if (isTrcAdmin) {
                            setIsEditMode(true);
                            setShowAddModal(true);
                          } else {
                            setShowEventModal(true);
                          }
                        }}
                        className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors trc-upcoming-event-card"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 text-sm leading-tight">
                              {event.title}
                            </h5>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(event.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-2 flex flex-col space-y-1">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              getPriorityColor(event.priority)
                            )}>
                              {event.priority}
                            </span>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              getEventTypeColor(event.type)
                            )}>
                              {event.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        {event.description && (
                          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <DocumentTextIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No upcoming events</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm">Loading events...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event Modals */}
        {showEventModal && selectedEvent && (
          <EventModal
            event={selectedEvent}
            isOpen={showEventModal}
            onClose={() => {
              setShowEventModal(false);
              setSelectedEvent(null);
            }}
            onSave={handleEventSave}
            onDelete={(id: string) => {
              deleteEvent(id);
              setShowEventModal(false);
              setSelectedEvent(null);
            }}
            canEdit={isTrcAdmin}
          />
        )}

        {showAddModal && selectedEvent && (
          <AddEventModal
            event={selectedEvent}
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setSelectedEvent(null);
              setIsEditMode(false);
            }}
            onSave={handleEventSave}
            isEditMode={isEditMode}
            canEdit={isTrcAdmin}
          />
        )}
      </div>
    </CalendarContext.Provider>
  );
}

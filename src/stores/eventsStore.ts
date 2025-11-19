import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TRCEvent, EventType, EventPriority, EventStatus } from '@/types';

interface EventsState {
  events: TRCEvent[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addEvent: (event: Omit<TRCEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (eventId: string, updates: Partial<TRCEvent>) => void;
  deleteEvent: (eventId: string) => void;
  clearAllEvents: () => void;
  getEventsByDateRange: (startDate: Date, endDate: Date) => TRCEvent[];
  getEventsByType: (type: EventType) => TRCEvent[];
  getUpcomingEvents: (days?: number) => TRCEvent[];
  getOverdueEvents: () => TRCEvent[];
  getMyEvents: (userId: string) => TRCEvent[]; // New method for filtering user's events
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Mock initial events for demonstration - WITH USER ASSIGNMENTS
const mockEvents: TRCEvent[] = [
  {
    id: '1',
    title: 'Q4 Internal Audit - Cloud Infrastructure',
    description: 'Comprehensive audit of cloud foundational services infrastructure and security controls',
    startDate: new Date(2025, 10, 20, 9, 0), // November 20, 2025, 9:00 AM
    endDate: new Date(2025, 10, 22, 17, 0), // November 22, 2025, 5:00 PM
    type: EventType.INTERNAL_AUDIT,
    priority: EventPriority.HIGH,
    status: EventStatus.SCHEDULED,
    createdBy: 'trc-001', // Sarah Chen
    assignedUsers: ['trc-001', 'ao-001', 'ao-002'], // Sarah Chen, Sophia Davis, Marcus Johnson
    createdAt: new Date(2024, 10, 1),
    updatedAt: new Date(2024, 10, 15),
    metadata: {
      auditScope: 'Cloud Infrastructure',
      leadAuditor: 'Sarah Chen',
      estimatedHours: 40,
      riskLevel: 'Medium'
    }
  },
  {
    id: '2',
    title: 'PCI-DSS Compliance Review',
    description: 'Annual PCI-DSS compliance assessment and documentation review',
    startDate: new Date(2025, 10, 19, 14, 0), // November 19, 2025, 2:00 PM
    endDate: new Date(2025, 10, 19, 16, 0), // November 19, 2025, 4:00 PM
    type: EventType.COMPLIANCE_REVIEW,
    priority: EventPriority.HIGH,
    status: EventStatus.IN_PROGRESS,
    createdBy: 'trc-admin-001', // David Kim
    assignedUsers: ['trc-admin-001', 'trc-002', 'psl-001'], // David Kim, Michael Rodriguez, Amanda Thompson
    createdAt: new Date(2024, 9, 15),
    updatedAt: new Date(2025, 10, 10),
    metadata: {
      complianceStandard: 'PCI-DSS v4.0',
      assessor: 'David Kim',
      findings: 3,
      remediation: 'In Progress'
    }
  },
  {
    id: '3',
    title: 'API Recertification - Customer Portal',
    description: 'Quarterly recertification of customer-facing API security controls and access management',
    startDate: new Date(2025, 10, 21, 10, 0), // November 21, 2025, 10:00 AM
    endDate: new Date(2025, 10, 21, 12, 0), // November 21, 2025, 12:00 PM
    type: EventType.RECERTIFICATION,
    priority: EventPriority.MEDIUM,
    status: EventStatus.SCHEDULED,
    createdBy: 'product-001', // Daniel Martinez
    assignedUsers: ['product-001', 'product-002', 'trc-003'], // Daniel Martinez, Rachel Green, Emily Watson
    createdAt: new Date(2025, 9, 15),
    updatedAt: new Date(2025, 10, 5),
    metadata: {
      apiVersion: 'v2.1',
      endpoints: 47,
      lastCertification: '2025-08-15',
      certificationBody: 'Internal Security Team'
    }
  },
  {
    id: '4',
    title: 'CORE-2024-015: API Security Vulnerability',
    description: 'Critical vulnerability in customer-facing API requiring immediate remediation',
    startDate: new Date(2025, 10, 22, 11, 0), // November 22, 2025, 11:00 AM
    endDate: new Date(2025, 10, 22, 15, 0), // November 22, 2025, 3:00 PM
    type: EventType.CORE_ISSUE,
    priority: EventPriority.CRITICAL,
    status: EventStatus.IN_PROGRESS,
    createdBy: 'trc-admin-002', // Lisa Zhang
    assignedUsers: ['trc-admin-002', 'ao-003', 'product-003'], // Lisa Zhang, Ashley Miller, Kevin Brown
    createdAt: new Date(2024, 10, 20),
    updatedAt: new Date(2024, 10, 22),
    metadata: {
      severity: 'High',
      affectedSystems: ['Customer Portal API', 'Mobile App API'],
      remediationOwner: 'Dev Team Alpha'
    }
  },
  {
    id: '5',
    title: 'Leadership Security Briefing',
    description: 'Monthly security briefing for CFS leadership team',
    startDate: new Date(2025, 10, 25, 15, 0), // November 25, 2025, 3:00 PM
    endDate: new Date(2025, 10, 25, 16, 30), // November 25, 2025, 4:30 PM
    type: EventType.REGULATORY_AUDIT,
    priority: EventPriority.MEDIUM,
    status: EventStatus.SCHEDULED,
    createdBy: 'cfs-002', // Victoria Adams
    assignedUsers: ['cfs-001', 'cfs-002', 'cfs-003'], // All CFS Leadership
    createdAt: new Date(2025, 10, 18),
    updatedAt: new Date(2025, 10, 18),
    metadata: {
      reviewType: 'Executive Briefing',
      attendees: ['CFS Leadership', 'CISO', 'Security Team Leads'],
      location: 'Executive Conference Room'
    }
  }
];

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      events: mockEvents,
      loading: false,
      error: null,

      addEvent: (event: Omit<TRCEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
        const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date();
        const newEvent: TRCEvent = {
          ...event,
          id,
          createdAt: now,
          updatedAt: now
        };

        console.log('Adding new event to store:', newEvent);
        set(state => ({
          events: [...state.events, newEvent]
        }));
      },

      updateEvent: (eventId: string, updates: Partial<TRCEvent>) => {
        set(state => ({
          events: state.events.map(event =>
            event.id === eventId
              ? { ...event, ...updates, updatedAt: new Date() }
              : event
          )
        }));
      },

      deleteEvent: (eventId: string) => {
        set(state => ({
          events: state.events.filter(event => event.id !== eventId)
        }));
      },

      clearAllEvents: () => {
        set({ events: [] });
      },

      getEventsByDateRange: (startDate: Date, endDate: Date) => {
        return get().events.filter(event => {
          const eventStart = new Date(event.startDate);
          const eventEnd = new Date(event.endDate || event.startDate);
          return (eventStart >= startDate && eventStart <= endDate) ||
                 (eventEnd >= startDate && eventEnd <= endDate) ||
                 (eventStart <= startDate && eventEnd >= endDate);
        });
      },

      getEventsByType: (type: EventType) => {
        return get().events.filter(event => event.type === type);
      },

      getUpcomingEvents: (days = 30) => {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + days);
        
        return get().events
          .filter(event => new Date(event.startDate) >= now && new Date(event.startDate) <= futureDate)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      },

      getOverdueEvents: () => {
        const now = new Date();
        return get().events.filter(event => 
          event.endDate && event.endDate < now && event.status !== EventStatus.COMPLETED
        );
      },

      getMyEvents: (userId: string) => {
        return get().events.filter(event => 
          event.createdBy === userId || 
          (event.assignedUsers && event.assignedUsers.includes(userId))
        );
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      }
    }),
    {
      name: 'trc-events-storage-v7', // Bumped version to force refresh with new events with user assignments
      partialize: (state) => ({ events: state.events }),
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        if (state?.events) {
          // Convert string dates back to Date objects after hydration
          state.events = state.events.map(event => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: event.endDate ? new Date(event.endDate) : undefined,
            createdAt: new Date(event.createdAt),
            updatedAt: new Date(event.updatedAt)
          }));
        }
      },
    }
  )
);

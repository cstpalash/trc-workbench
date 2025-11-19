import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserPersona, UserRole, Permission } from '@/types';

interface UserState {
  users: User[];
  currentUser: User | null;
  
  // Actions
  setCurrentUser: (user: User) => void;
  switchUser: (userId: string) => void;
  getUsersByPersona: (persona: UserPersona) => User[];
  getAllUsers: () => User[];
}

// Mock users with 3 users per persona
const mockUsers: User[] = [
  // TRC Users
  {
    id: 'trc-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: UserRole.TRC_MANAGER,
    persona: UserPersona.TRC,
    permissions: [Permission.CREATE_EVENT, Permission.EDIT_EVENT, Permission.VIEW_ALL_EVENTS],
    department: 'Technology Risk & Control',
    photoUrl: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 'trc-002',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@company.com',
    role: UserRole.TRC_MANAGER,
    persona: UserPersona.TRC,
    permissions: [Permission.CREATE_EVENT, Permission.EDIT_EVENT, Permission.VIEW_ALL_EVENTS],
    department: 'Technology Risk & Control',
    photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 'trc-003',
    name: 'Emily Watson',
    email: 'emily.watson@company.com',
    role: UserRole.TRC_MANAGER,
    persona: UserPersona.TRC,
    permissions: [Permission.CREATE_EVENT, Permission.EDIT_EVENT, Permission.VIEW_ALL_EVENTS],
    department: 'Technology Risk & Control',
    photoUrl: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  
  // TRC Admin Users
  {
    id: 'trc-admin-001',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: UserRole.ADMIN,
    persona: UserPersona.TRC_ADMIN,
    permissions: [Permission.CREATE_EVENT, Permission.EDIT_EVENT, Permission.DELETE_EVENT, Permission.VIEW_ALL_EVENTS, Permission.MANAGE_USERS],
    department: 'Technology Risk & Control',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'trc-admin-002',
    name: 'Lisa Zhang',
    email: 'lisa.zhang@company.com',
    role: UserRole.ADMIN,
    persona: UserPersona.TRC_ADMIN,
    permissions: [Permission.CREATE_EVENT, Permission.EDIT_EVENT, Permission.DELETE_EVENT, Permission.VIEW_ALL_EVENTS, Permission.MANAGE_USERS],
    department: 'Technology Risk & Control',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'trc-admin-003',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    role: UserRole.ADMIN,
    persona: UserPersona.TRC_ADMIN,
    permissions: [Permission.CREATE_EVENT, Permission.EDIT_EVENT, Permission.DELETE_EVENT, Permission.VIEW_ALL_EVENTS, Permission.MANAGE_USERS],
    department: 'Technology Risk & Control',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  
  // PSL Users
  {
    id: 'psl-001',
    name: 'Amanda Thompson',
    email: 'amanda.thompson@company.com',
    role: UserRole.VIEWER,
    persona: UserPersona.PSL,
    permissions: [Permission.VIEW_ALL_EVENTS],
    department: 'Product Security Lead',
    photoUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'psl-002',
    name: 'Robert Anderson',
    email: 'robert.anderson@company.com',
    role: UserRole.VIEWER,
    persona: UserPersona.PSL,
    permissions: [Permission.VIEW_ALL_EVENTS],
    department: 'Product Security Lead',
    photoUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'psl-003',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@company.com',
    role: UserRole.VIEWER,
    persona: UserPersona.PSL,
    permissions: [Permission.VIEW_ALL_EVENTS],
    department: 'Product Security Lead',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
  },
  
  // Product Lead Users
  {
    id: 'product-001',
    name: 'Daniel Martinez',
    email: 'daniel.martinez@company.com',
    role: UserRole.VIEWER,
    persona: UserPersona.PRODUCT_LEAD,
    permissions: [Permission.VIEW_ALL_EVENTS, Permission.CREATE_EVENT],
    department: 'Product Management',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'product-002',
    name: 'Rachel Green',
    email: 'rachel.green@company.com',
    role: UserRole.VIEWER,
    persona: UserPersona.PRODUCT_LEAD,
    permissions: [Permission.VIEW_ALL_EVENTS, Permission.CREATE_EVENT],
    department: 'Product Management',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'product-003',
    name: 'Kevin Brown',
    email: 'kevin.brown@company.com',
    role: UserRole.VIEWER,
    persona: UserPersona.PRODUCT_LEAD,
    permissions: [Permission.VIEW_ALL_EVENTS, Permission.CREATE_EVENT],
    department: 'Product Management',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
  },
  
  // AO Users
  {
    id: 'ao-001',
    name: 'Sophia Davis',
    email: 'sophia.davis@company.com',
    role: UserRole.AUDITOR,
    persona: UserPersona.AO,
    permissions: [Permission.VIEW_ALL_EVENTS, Permission.CREATE_EVENT, Permission.EDIT_EVENT],
    department: 'Audit Office',
    photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'ao-002',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@company.com',
    role: UserRole.AUDITOR,
    persona: UserPersona.AO,
    permissions: [Permission.VIEW_ALL_EVENTS, Permission.CREATE_EVENT, Permission.EDIT_EVENT],
    department: 'Audit Office',
    photoUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'ao-003',
    name: 'Ashley Miller',
    email: 'ashley.miller@company.com',
    role: UserRole.AUDITOR,
    persona: UserPersona.AO,
    permissions: [Permission.VIEW_ALL_EVENTS, Permission.CREATE_EVENT, Permission.EDIT_EVENT],
    department: 'Audit Office',
    photoUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face'
  },
  
  // CFS Leadership Users
  {
    id: 'cfs-001',
    name: 'William Taylor',
    email: 'william.taylor@company.com',
    role: UserRole.VIEWER,
    persona: UserPersona.CFS_LEADERSHIP,
    permissions: [Permission.VIEW_ALL_EVENTS],
    department: 'CFS Leadership',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'cfs-002',
    name: 'Victoria Adams',
    email: 'victoria.adams@company.com',
    role: UserRole.VIEWER,
    persona: UserPersona.CFS_LEADERSHIP,
    permissions: [Permission.VIEW_ALL_EVENTS],
    department: 'CFS Leadership',
    photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 'cfs-003',
    name: 'Christopher White',
    email: 'christopher.white@company.com',
    role: UserRole.VIEWER,
    persona: UserPersona.CFS_LEADERSHIP,
    permissions: [Permission.VIEW_ALL_EVENTS],
    department: 'CFS Leadership',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: mockUsers,
      currentUser: mockUsers[0], // Default to first TRC user
      
      setCurrentUser: (user: User) => {
        set({ currentUser: user });
      },
      
      switchUser: (userId: string) => {
        const user = get().users.find(u => u.id === userId);
        if (user) {
          set({ currentUser: user });
        }
      },
      
      getUsersByPersona: (persona: UserPersona) => {
        return get().users.filter(user => user.persona === persona);
      },
      
      getAllUsers: () => {
        return get().users;
      }
    }),
    {
      name: 'trc-user-storage-v2', // Updated to refresh photo URLs
    }
  )
);

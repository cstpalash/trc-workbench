export interface TRCEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  type: EventType;
  priority: EventPriority;
  status: EventStatus;
  createdBy: string;
  assignedUsers?: string[]; // Array of user IDs assigned to this event
  associatedEntity?: EntityAssociation; // Associated entity information
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface EntityAssociation {
  type: EntityType;
  id: string;
  name: string;
  tag?: string; // Type tag for categorization (e.g., 'storage', 'compute' for products)
}

export enum EntityType {
  PLATFORM = 'platform',
  PRODUCT = 'product',
  APPLICATION = 'application'
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  parentId?: string; // For hierarchical relationships (e.g., Products under Platforms)
  tag?: string; // Type tag for categorization (e.g., 'storage', 'compute' for products)
}

export enum EventType {
  INTERNAL_AUDIT = 'internal_audit',
  HORIZONTAL_AUDIT = 'horizontal_audit',
  REGULATORY_AUDIT = 'regulatory_audit',
  RECERTIFICATION = 'recertification',
  CORE_ISSUE = 'core_issue',
  COMPLIANCE_REVIEW = 'compliance_review',
  RISK_ASSESSMENT = 'risk_assessment'
}

export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum EventStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  config: WidgetConfig;
  position: WidgetPosition;
  size: WidgetSize;
  isVisible: boolean;
  isResizable: boolean;
  isDraggable: boolean;
  minSize?: WidgetSize;
  maxSize?: WidgetSize;
}

export enum WidgetType {
  TRC_CALENDAR = 'trc_calendar',
  RISK_DASHBOARD = 'risk_dashboard',
  COMPLIANCE_METRICS = 'compliance_metrics',
  AUDIT_STATUS = 'audit_status',
  QUICK_ACTIONS = 'quick_actions'
}

export interface WidgetConfig {
  [key: string]: any;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: Widget[];
  userId: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  defaultLayout: string;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  browserEnabled: boolean;
  eventReminders: boolean;
  auditAlerts: boolean;
  complianceUpdates: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  screenReader: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  persona: UserPersona;
  permissions: Permission[];
  department?: string;
  avatar?: string;
  photoUrl?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  TRC_MANAGER = 'trc_manager',
  AUDITOR = 'auditor',
  VIEWER = 'viewer'
}

export enum UserPersona {
  TRC = 'TRC',
  TRC_ADMIN = 'TRC Admin',
  PSL = 'PSL',
  PRODUCT_LEAD = 'Product Lead',
  AO = 'AO',
  CFS_LEADERSHIP = 'CFS Leadership'
}

export enum Permission {
  CREATE_EVENT = 'create_event',
  EDIT_EVENT = 'edit_event',
  DELETE_EVENT = 'delete_event',
  VIEW_ALL_EVENTS = 'view_all_events',
  MANAGE_USERS = 'manage_users',
  CONFIGURE_WIDGETS = 'configure_widgets',
  EXPORT_DATA = 'export_data'
}

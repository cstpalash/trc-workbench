export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    }
  },
  
  eventTypes: {
    internal_audit: {
      color: '#8b5cf6',
      background: '#f3e8ff',
      name: 'Internal Audit'
    },
    horizontal_audit: {
      color: '#06b6d4',
      background: '#cffafe',
      name: 'Horizontal Audit'
    },
    regulatory_audit: {
      color: '#dc2626',
      background: '#fee2e2',
      name: 'Regulatory Audit'
    },
    recertification: {
      color: '#059669',
      background: '#d1fae5',
      name: 'Recertification'
    },
    core_issue: {
      color: '#ea580c',
      background: '#fed7aa',
      name: 'CORE Issue'
    },
    compliance_review: {
      color: '#2563eb',
      background: '#dbeafe',
      name: 'Compliance Review'
    },
    risk_assessment: {
      color: '#7c3aed',
      background: '#ede9fe',
      name: 'Risk Assessment'
    }
  },

  priorities: {
    critical: {
      color: '#dc2626',
      background: '#fee2e2',
      name: 'Critical'
    },
    high: {
      color: '#ea580c',
      background: '#fed7aa',
      name: 'High'
    },
    medium: {
      color: '#d97706',
      background: '#fde68a',
      name: 'Medium'
    },
    low: {
      color: '#059669',
      background: '#d1fae5',
      name: 'Low'
    }
  },

  statuses: {
    scheduled: {
      color: '#2563eb',
      background: '#dbeafe',
      name: 'Scheduled'
    },
    in_progress: {
      color: '#7c3aed',
      background: '#ede9fe',
      name: 'In Progress'
    },
    completed: {
      color: '#059669',
      background: '#d1fae5',
      name: 'Completed'
    },
    cancelled: {
      color: '#6b7280',
      background: '#f3f4f6',
      name: 'Cancelled'
    },
    overdue: {
      color: '#dc2626',
      background: '#fee2e2',
      name: 'Overdue'
    }
  },

  animations: {
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideIn: 'slideInFromBottom 0.3s ease-out',
    scaleIn: 'scaleIn 0.2s ease-out',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },

  shadows: {
    card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    cardHover: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    modal: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  }
};

export type Theme = typeof theme;

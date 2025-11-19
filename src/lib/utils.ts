import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' }
  }[format] as Intl.DateTimeFormatOptions;

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function getPriorityColor(priority: string): string {
  const colors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-orange-600 bg-orange-100',
    critical: 'text-red-600 bg-red-100'
  };
  return colors[priority as keyof typeof colors] || colors.medium;
}

export function getStatusColor(status: string): string {
  const colors = {
    scheduled: 'text-blue-600 bg-blue-100',
    in_progress: 'text-indigo-600 bg-indigo-100',
    completed: 'text-green-600 bg-green-100',
    cancelled: 'text-gray-600 bg-gray-100',
    overdue: 'text-red-600 bg-red-100'
  };
  return colors[status as keyof typeof colors] || colors.scheduled;
}

export function getEventTypeColor(type: string): string {
  const colors = {
    internal_audit: 'text-purple-600 bg-purple-100',
    horizontal_audit: 'text-cyan-600 bg-cyan-100',
    regulatory_audit: 'text-red-600 bg-red-100',
    recertification: 'text-emerald-600 bg-emerald-100',
    core_issue: 'text-orange-600 bg-orange-100',
    compliance_review: 'text-blue-600 bg-blue-100',
    risk_assessment: 'text-indigo-600 bg-indigo-100'
  };
  return colors[type as keyof typeof colors] || colors.internal_audit;
}

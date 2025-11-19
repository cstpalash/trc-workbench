'use client';

import React from 'react';
import { 
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useDashboardStore } from '@/stores/dashboardStore';
import { UserSwitcher } from '@/components/ui/UserSwitcher';
import { cn } from '@/lib/utils';

export function DashboardToolbar() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            TRC Workbench
          </h1>
          <span className="text-sm text-gray-500">
            Cloud Foundational Services
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Switcher */}
          <UserSwitcher />

          {/* Toolbar Actions */}
          <div className="flex items-center space-x-2 border-l border-gray-300 pl-4">
            <button
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Settings"
            >
              <Cog6ToothIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

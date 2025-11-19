'use client';

import { AuditHistoryWidget } from '@/components/widgets/AuditHistoryWidget';
import { useUserStore } from '@/stores/userStore';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AuditHistoryWidgetPage() {
  const { currentUser } = useUserStore();

  const config = {
    defaultView: 'list' as const,
    showFilters: true,
    itemsPerPage: 10
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Widget Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Audit History</h1>
              <p className="text-sm text-gray-500">
                Complete audit tracking for the last 3 years with detailed insights
                {currentUser && (
                  <span className="ml-2">• Current user: <span className="font-medium">{currentUser.name}</span></span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Widget Content */}
      <div className="flex-1 min-h-0">
        <AuditHistoryWidget config={config} />
      </div>
    </div>
  );
}
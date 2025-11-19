'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { 
  CalendarDaysIcon, 
  DocumentChartBarIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

// Widget definitions
const widgets = [
  {
    id: 'trc-calendar',
    name: 'TRC Event Calendar',
    description: 'Manage audits, recertifications, and CORE issues with an interactive calendar interface.',
    icon: CalendarDaysIcon,
    href: '/widget/calendar',
    color: 'from-blue-500 to-indigo-600',
    features: ['Event Management', 'Multi-view Calendar', 'Team Assignment', 'Status Tracking']
  },
  {
    id: 'audit-history',
    name: 'Audit History',
    description: 'Comprehensive audit tracking and analysis for the last 3 years with detailed insights.',
    icon: DocumentChartBarIcon,
    href: '/widget/audit-history',
    color: 'from-emerald-500 to-teal-600',
    features: ['3-Year History', 'Detailed Reports', 'Similar Audits', 'Document Management']
  }
];

export default function LandingPage() {
  const { currentUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWidgets = widgets.filter(widget =>
    widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    widget.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-100/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TRC Workbench
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
              Your comprehensive Technology Risk and Control platform. Streamline audits, 
              manage compliance, and track risk assessments.
            </p>

            {currentUser && (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 inline-flex items-center space-x-3 shadow-lg">
                <UserGroupIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">
                  Welcome back, <span className="font-semibold">{currentUser.name}</span>
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {currentUser.persona}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Widget Search and Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 h-full flex flex-col">
        {/* Search Section */}
        <div className="mb-6 flex-shrink-0">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Discover Powerful Widgets
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm">
              Choose from our collection of specialized widgets designed to streamline your TRC workflows.
            </p>
          </div>
          
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search widgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm"
            />
          </div>
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto">
          {filteredWidgets.map((widget) => (
            <Link
              key={widget.id}
              href={widget.href}
              className="group relative h-fit"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02] border border-gray-100">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${widget.color} p-4 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                    <widget.icon className="w-20 h-20" />
                  </div>
                  <div className="relative z-10 flex items-start space-x-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <widget.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{widget.name}</h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {widget.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <SparklesIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">Key Features</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {widget.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Click to explore</span>
                    <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700">
                      <span className="text-xs font-medium">Open Widget</span>
                      <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredWidgets.length === 0 && (
          <div className="text-center py-8 flex-1 flex flex-col justify-center">
            <ClipboardDocumentListIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600 mb-1">No widgets found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}

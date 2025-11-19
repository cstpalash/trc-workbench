'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ExclamationTriangleIcon, UserIcon } from '@heroicons/react/24/outline';
import { TRCEvent, EventType, EventPriority, EventStatus, UserPersona } from '@/types';
import { cn, formatDate, getEventTypeColor, getPriorityColor, getStatusColor } from '@/lib/utils';
import { useUserStore } from '@/stores/userStore';
import { useEntitiesStore } from '@/stores/entitiesStore';

interface EventModalProps {
  event: TRCEvent;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<TRCEvent>) => void;
  onDelete: (eventId: string) => void;
  canEdit: boolean;
}

export function EventModal({ 
  event, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  canEdit 
}: EventModalProps) {
  const { users } = useUserStore();
  const { getEntityById } = useEntitiesStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleDelete = () => {
    onDelete(event.id);
    setShowDeleteConfirm(false);
  };

  const getEventTypeDescription = (type: EventType) => {
    const descriptions = {
      [EventType.INTERNAL_AUDIT]: 'Internal audit conducted by the organization',
      [EventType.HORIZONTAL_AUDIT]: 'Cross-functional audit across multiple departments',
      [EventType.REGULATORY_AUDIT]: 'Audit conducted by external regulatory bodies',
      [EventType.RECERTIFICATION]: 'Periodic recertification of compliance standards',
      [EventType.CORE_ISSUE]: 'Critical operational or compliance issue requiring attention',
      [EventType.COMPLIANCE_REVIEW]: 'Regular review of compliance processes and controls',
      [EventType.RISK_ASSESSMENT]: 'Assessment of operational and business risks'
    };
    return descriptions[type] || '';
  };

  // Helper function to format date for display
  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-xl max-h-[90vh] flex flex-col my-8">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Event Details
                </Dialog.Title>
                <p className="text-sm text-gray-500">
                  Complete event information and metadata
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-8">
              
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      <span className="text-gray-900">{event.title}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md min-h-[72px]">
                      <span className="text-gray-900 whitespace-pre-wrap">
                        {event.description || 'No description provided'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date & Time <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      <span className="text-gray-900">{formatDateForDisplay(event.startDate)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date & Time <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      <span className="text-gray-900">
                        {event.endDate ? formatDateForDisplay(event.endDate) : 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Classification */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      <span className="text-gray-900">{event.type.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {getEventTypeDescription(event.type)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      <span className={cn(
                        'px-3 py-1 text-xs font-medium rounded-full',
                        getPriorityColor(event.priority)
                      )}>
                        {event.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Status
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      <span className={cn(
                        'px-3 py-1 text-xs font-medium rounded-full',
                        getStatusColor(event.status)
                      )}>
                        {event.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Assignment Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <UserIcon className="w-4 h-4 inline mr-2" />
                    Assigned Team Members
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[UserPersona.TRC, UserPersona.PSL, UserPersona.PRODUCT_LEAD, UserPersona.AO].map((persona) => {
                      const personaUsers = users.filter(user => user.persona === persona);
                      const assignedPersonaUsers = personaUsers.filter(user => 
                        event.assignedUsers && event.assignedUsers.includes(user.id)
                      );
                      
                      return (
                        <div key={persona} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700">{persona}</h4>
                            {assignedPersonaUsers.length > 0 && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                {assignedPersonaUsers.length} assigned
                              </span>
                            )}
                          </div>
                          <div className="space-y-2">
                            {personaUsers.length > 0 ? personaUsers.map((user) => {
                              const isAssigned = event.assignedUsers && event.assignedUsers.includes(user.id);
                              return (
                                <div 
                                  key={user.id} 
                                  className={cn(
                                    'flex items-center space-x-3 p-2 rounded-lg border',
                                    isAssigned ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                                  )}
                                >
                                  <div className="relative">
                                    <img
                                      src={user.photoUrl || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e5e7eb&color=374151&size=32`}
                                      alt={user.name}
                                      className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e5e7eb&color=374151&size=32`;
                                      }}
                                    />
                                    {isAssigned && (
                                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={cn(
                                      'text-sm font-medium truncate',
                                      isAssigned ? 'text-blue-900' : 'text-gray-900'
                                    )}>
                                      {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                  </div>
                                </div>
                              );
                            }) : (
                              <div className="text-xs text-gray-500 italic p-3 text-center bg-white rounded border border-gray-200">
                                No users found for this role
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Associated Entity */}
              {event.associatedEntity && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Associated Entity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entity Type
                      </label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        <span className="text-gray-900">{event.associatedEntity.type.replace('_', ' ').toUpperCase()}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entity Name
                      </label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        <span className="text-gray-900">{event.associatedEntity.name}</span>
                      </div>
                    </div>
                    {event.associatedEntity.tag && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                          <span className="text-gray-900 capitalize">{event.associatedEntity.tag}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Event Metadata */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Created Date
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      <span className="text-gray-900">{formatDate(event.createdAt, 'short')}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Created By
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      <span className="text-gray-900">{event.createdBy}</span>
                    </div>
                  </div>
                  {event.updatedAt && event.updatedAt.getTime() !== event.createdAt.getTime() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Updated
                      </label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        <span className="text-gray-900">{formatDate(event.updatedAt, 'short')}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event ID
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      <span className="text-gray-900 font-mono text-sm">{event.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Metadata */}
              {event.metadata && Object.keys(event.metadata).length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key}>
                          <dt className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </dt>
                          <dd className="text-gray-600 mt-1">
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
            <div>
              {canEdit && event.id && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                  Delete Event
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Dialog
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm w-full bg-white rounded-xl shadow-xl p-6">
              <div className="text-center">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Event
                </Dialog.Title>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this event? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </Dialog>
  );
}

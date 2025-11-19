import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import { TRCEvent, EventType, EventPriority, EventStatus, UserPersona, EntityType } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { useEntitiesStore } from '@/stores/entitiesStore';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: TRCEvent) => void;
  event?: TRCEvent;
  isEditMode?: boolean;
  canEdit?: boolean;
}

export function AddEventModal({ isOpen, onClose, onSave, event, isEditMode = false, canEdit = true }: AddEventModalProps) {
  const { users, currentUser } = useUserStore();
  const { getAllEntities, getEntityById, getEntitiesByType } = useEntitiesStore();
  
  // Permission check - prevent unauthorized access
  if (!canEdit) {
    return null;
  }

  // Helper function to format date for datetime-local input without timezone issues
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    startDate: event?.startDate ? formatDateForInput(event.startDate) : '',
    endDate: event?.endDate ? formatDateForInput(event.endDate) : '',
    type: event?.type || EventType.INTERNAL_AUDIT,
    priority: event?.priority || EventPriority.MEDIUM,
    status: event?.status || EventStatus.SCHEDULED,
    assignedUsers: event?.assignedUsers || (currentUser?.id ? [currentUser.id] : []),
    associatedEntityId: event?.associatedEntity?.id || '',
    associatedEntityType: event?.associatedEntity?.type || EntityType.PLATFORM
  });

  // Update form when event prop changes (for edit mode)
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: formatDateForInput(event.startDate),
        endDate: event.endDate ? formatDateForInput(event.endDate) : '',
        type: event.type,
        priority: event.priority,
        status: event.status,
        assignedUsers: event.assignedUsers || (currentUser?.id ? [currentUser.id] : []),
        associatedEntityId: event.associatedEntity?.id || '',
        associatedEntityType: event.associatedEntity?.type || EntityType.PLATFORM
      });
    }
  }, [event, currentUser?.id]);

  const handleSave = () => {
    if (!formData.title.trim()) return;
    
    // Get the associated entity if one is selected
    const associatedEntity = formData.associatedEntityId 
      ? getEntityById(formData.associatedEntityId)
      : undefined;
    
    const eventData: TRCEvent = {
      id: event?.id || `event-${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      type: formData.type,
      priority: formData.priority,
      status: formData.status,
      assignedUsers: formData.assignedUsers.length > 0 ? formData.assignedUsers : undefined,
      associatedEntity: associatedEntity ? {
        id: associatedEntity.id,
        name: associatedEntity.name,
        type: associatedEntity.type,
        tag: associatedEntity.tag
      } : undefined,
      createdAt: event?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: event?.createdBy || (currentUser?.id ?? '')
    };
    
    onSave(eventData);
  };

  // Get entities for the selected type
  const entitiesForSelectedType = getEntitiesByType(formData.associatedEntityType);

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
                <PlusIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {isEditMode ? 'Edit Event' : 'Add New Event'}
                </Dialog.Title>
                <p className="text-sm text-gray-500">
                  {isEditMode ? 'Update event details' : 'Create a new TRC event'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    placeholder="Enter event description"
                  />
                </div>
              </div>
            </div>

            {/* Entity Association */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Entity Association</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entity Type
                  </label>
                  <select
                    value={formData.associatedEntityType}
                    onChange={(e) => {
                      const newType = e.target.value as EntityType;
                      setFormData({ 
                        ...formData, 
                        associatedEntityType: newType,
                        associatedEntityId: '' // Reset entity selection when type changes
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value={EntityType.PLATFORM}>Platform</option>
                    <option value={EntityType.PRODUCT}>Product</option>
                    <option value={EntityType.APPLICATION}>Application</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Entity
                  </label>
                  <select
                    value={formData.associatedEntityId}
                    onChange={(e) => setFormData({ ...formData, associatedEntityId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value="">No entity association</option>
                    {entitiesForSelectedType.map((entity) => (
                      <option key={entity.id} value={entity.id}>
                        {entity.name}{entity.tag ? ` (${entity.tag})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Event Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value={EventType.INTERNAL_AUDIT}>Internal Audit</option>
                    <option value={EventType.HORIZONTAL_AUDIT}>Horizontal Audit</option>
                    <option value={EventType.REGULATORY_AUDIT}>Regulatory Audit</option>
                    <option value={EventType.RECERTIFICATION}>Recertification</option>
                    <option value={EventType.CORE_ISSUE}>CORE Issue</option>
                    <option value={EventType.COMPLIANCE_REVIEW}>Compliance Review</option>
                    <option value={EventType.RISK_ASSESSMENT}>Risk Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as EventPriority })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value={EventPriority.LOW}>Low</option>
                    <option value={EventPriority.MEDIUM}>Medium</option>
                    <option value={EventPriority.HIGH}>High</option>
                    <option value={EventPriority.CRITICAL}>Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value={EventStatus.SCHEDULED}>Scheduled</option>
                    <option value={EventStatus.IN_PROGRESS}>In Progress</option>
                    <option value={EventStatus.COMPLETED}>Completed</option>
                    <option value={EventStatus.CANCELLED}>Cancelled</option>
                    <option value={EventStatus.OVERDUE}>Overdue</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Team Assignment */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Assign Team Members
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[UserPersona.TRC, UserPersona.PSL, UserPersona.PRODUCT_LEAD, UserPersona.AO].map((persona) => {
                  const personaUsers = users.filter(user => user.persona === persona);
                  
                  return (
                    <div key={persona} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">{persona}</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {personaUsers.map((user) => (
                          <label 
                            key={user.id} 
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                              formData.assignedUsers.includes(user.id) 
                                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' 
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.assignedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    assignedUsers: [...formData.assignedUsers, user.id]
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    assignedUsers: formData.assignedUsers.filter(id => id !== user.id)
                                  });
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="relative">
                                <img
                                  src={user.photoUrl || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e5e7eb&color=374151&size=40`}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e5e7eb&color=374151&size=40`;
                                  }}
                                />
                                {formData.assignedUsers.includes(user.id) && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 flex items-center justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors inline-flex items-center"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              {isEditMode ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
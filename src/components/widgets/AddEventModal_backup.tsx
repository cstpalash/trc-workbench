import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { TRCEvent } from '@/types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: TRCEvent) => void;
  event?: TRCEvent;
}

export function AddEventModal({ isOpen, onClose, onSave, event }: AddEventModalProps) {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md bg-white rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-medium">
              {event ? 'Edit Event' : 'Add Event'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <p>Event modal content will go here</p>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Placeholder save logic
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { User, UserPersona } from '@/types';
import { cn } from '@/lib/utils';

export function UserSwitcher() {
  const { currentUser, users, switchUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  if (!currentUser) return null;

  const handleImageError = (userId: string) => {
    console.log('Image failed to load for user:', userId);
    setFailedImages(prev => new Set([...prev, userId]));
  };

  const handleImageLoad = (userId: string) => {
    console.log('Image loaded successfully for user:', userId);
  };

  const groupedUsers = users.reduce((groups, user) => {
    if (!groups[user.persona]) {
      groups[user.persona] = [];
    }
    groups[user.persona].push(user);
    return groups;
  }, {} as Record<UserPersona, User[]>);

  const handleUserSwitch = (user: User) => {
    switchUser(user.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        aria-label="Switch user"
      >
        <div className="flex items-center space-x-2">
          {currentUser.photoUrl && !failedImages.has(currentUser.id) ? (
            <img
              src={currentUser.photoUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover"
              onError={() => handleImageError(currentUser.id)}
              onLoad={() => handleImageLoad(currentUser.id)}
            />
          ) : (
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
          )}
          <div className="text-left">
            <div className="font-medium text-gray-900">{currentUser.name}</div>
            <div className="text-xs text-gray-500">{currentUser.persona}</div>
          </div>
        </div>
        <ChevronDownIcon className={cn(
          "w-4 h-4 text-gray-400 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">Switch User</h3>
              <p className="text-xs text-gray-500">Select a different user persona</p>
            </div>

            <div className="py-2">
              {Object.entries(groupedUsers).map(([persona, personaUsers]) => (
                <div key={persona} className="mb-1">
                  <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase bg-gray-50">
                    {persona}
                  </div>
                  {personaUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSwitch(user)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors",
                        currentUser.id === user.id && "bg-blue-50 border-r-2 border-blue-500"
                      )}
                    >
                      {user.photoUrl && !failedImages.has(user.id) ? (
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          onError={() => handleImageError(user.id)}
                          onLoad={() => handleImageLoad(user.id)}
                        />
                      ) : (
                        <UserCircleIcon className="w-10 h-10 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.department}
                        </div>
                      </div>
                      {currentUser.id === user.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

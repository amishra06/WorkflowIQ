import React, { useEffect, useState } from 'react';
import { Avatar } from '../common/Avatar';
import { useCollaboration } from '../../hooks/useCollaboration';
import { User } from '../../types';

interface CollaborationOverlayProps {
  workflowId: string;
}

const CollaborationOverlay: React.FC<CollaborationOverlayProps> = ({ workflowId }) => {
  const { activeUsers, userCursors } = useCollaboration(workflowId);
  const [showUserList, setShowUserList] = useState(false);

  return (
    <>
      {/* Active users indicator */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <div 
          className="flex -space-x-2 cursor-pointer"
          onClick={() => setShowUserList(!showUserList)}
        >
          {activeUsers.slice(0, 3).map((user) => (
            <Avatar
              key={user.id}
              src={user.avatarUrl}
              alt={user.fullName}
              size="sm"
              className="border-2 border-white"
            />
          ))}
          {activeUsers.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 border-2 border-white">
              +{activeUsers.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* User list popup */}
      {showUserList && (
        <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 w-64">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Active Users ({activeUsers.length})
          </h3>
          <div className="space-y-2">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <Avatar src={user.avatarUrl} alt={user.fullName} size="sm" />
                <span className="text-sm text-gray-700">{user.fullName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User cursors */}
      {Object.entries(userCursors).map(([userId, cursor]) => {
        const user = activeUsers.find(u => u.id === userId);
        if (!user) return null;

        return (
          <div
            key={userId}
            className="absolute pointer-events-none"
            style={{
              left: cursor.x,
              top: cursor.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 transform rotate-45"
                style={{ backgroundColor: cursor.color }}
              />
              <span
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: cursor.color }}
              >
                {user.fullName}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CollaborationOverlay;
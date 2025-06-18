import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { supabase } from '../services/supabase';
import { User } from '../types';

interface Cursor {
  x: number;
  y: number;
  color: string;
}

export function useCollaboration(workflowId: string) {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [userCursors, setUserCursors] = useState<Record<string, Cursor>>({});
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    // Initialize Yjs document
    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      'wss://yjs.workflowiq.com',
      `workflow-${workflowId}`,
      doc
    );

    setYdoc(doc);
    setProvider(wsProvider);

    // Subscribe to real-time presence
    const presenceChannel = supabase.channel(`workflow-${workflowId}`);

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.values(state).flat() as User[];
        setActiveUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        setActiveUsers(prev => [...prev, ...newPresences]);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        setActiveUsers(prev => 
          prev.filter(user => !leftPresences.find(p => p.id === user.id))
        );
      })
      .on('broadcast', { event: 'cursor' }, ({ payload }) => {
        setUserCursors(prev => ({
          ...prev,
          [payload.userId]: payload.cursor
        }));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            id: supabase.auth.user()?.id,
            email: supabase.auth.user()?.email,
            // Add other user data as needed
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      presenceChannel.unsubscribe();
      wsProvider.destroy();
    };
  }, [workflowId]);

  const updateCursor = (x: number, y: number) => {
    if (!channel) return;

    const cursor = {
      x,
      y,
      color: getUserColor(supabase.auth.user()?.id || '')
    };

    channel.send({
      type: 'broadcast',
      event: 'cursor',
      payload: {
        userId: supabase.auth.user()?.id,
        cursor
      }
    });
  };

  const getUserColor = (userId: string): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
    ];
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return {
    activeUsers,
    userCursors,
    updateCursor,
    ydoc,
    provider
  };
}
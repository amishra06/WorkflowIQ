import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MessageSquare, Send } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { supabase } from '../../services/supabase';

interface Comment {
  id: string;
  userId: string;
  comment: string;
  createdAt: string;
  user: {
    fullName: string;
    avatarUrl: string;
  };
}

interface CommentThreadProps {
  workflowId: string;
  nodeId?: string;
}

const CommentThread: React.FC<CommentThreadProps> = ({ workflowId, nodeId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
    subscribeToComments();
  }, [workflowId, nodeId]);

  const loadComments = async () => {
    const query = supabase
      .from('workflow_comments')
      .select(`
        id,
        comment,
        created_at,
        user_id,
        user:user_profiles(full_name, avatar_url)
      `)
      .eq('workflow_id', workflowId)
      .order('created_at', { ascending: true });

    if (nodeId) {
      query.eq('node_id', nodeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading comments:', error);
      return;
    }

    setComments(data);
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel(`workflow-${workflowId}-comments`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workflow_comments',
          filter: `workflow_id=eq.${workflowId}`
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase.from('workflow_comments').insert({
        workflow_id: workflowId,
        node_id: nodeId,
        comment: newComment.trim(),
        user_id: supabase.auth.user()?.id
      });

      if (error) throw error;

      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare size={20} className="text-gray-500" />
        <h3 className="font-medium text-gray-900">Comments</h3>
      </div>

      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <Avatar
              src={comment.user.avatarUrl}
              alt={comment.user.fullName}
              size="sm"
            />
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-medium text-gray-900">
                  {comment.user.fullName}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          icon={<Send size={16} />}
          loading={loading}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default CommentThread;
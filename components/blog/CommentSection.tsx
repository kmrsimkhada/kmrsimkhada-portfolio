import React, { useState, useEffect } from 'react';
import { Comment } from '../../types';
import { apiService } from '../../services/api';

interface CommentSectionProps {
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.getComments(articleId);
        const parsed = Array.isArray(data) ? data : [];
        setComments(parsed.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })));
      } catch (err) {
        console.error('Failed to load comments:', err);
        setComments([]);
      }
    };
    load();
  }, [articleId]);

  const saveComments = (updatedComments: Comment[]) => {
    setComments(updatedComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        author: authorName.trim(),
        content: newComment.trim()
      };
      const created = await apiService.createComment(articleId, payload);
      const normalized: Comment = {
        id: created.id,
        author: created.author,
        content: created.content,
        timestamp: new Date(created.timestamp),
        likes: created.likes || 0,
        replies: []
      };
      const updatedComments = [normalized, ...comments];
      saveComments(updatedComments);
      setNewComment('');
      setAuthorName('');
    } catch (err) {
      console.error('Failed to create comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const likedComments = JSON.parse(localStorage.getItem('likedComments') || '[]');
        const isLiked = likedComments.includes(commentId);
        
        if (isLiked) {
          // Unlike
          const newLikedComments = likedComments.filter((id: string) => id !== commentId);
          localStorage.setItem('likedComments', JSON.stringify(newLikedComments));
          return { ...comment, likes: Math.max(0, comment.likes - 1) };
        } else {
          // Like
          likedComments.push(commentId);
          localStorage.setItem('likedComments', JSON.stringify(likedComments));
          return { ...comment, likes: comment.likes + 1 };
        }
      }
      return comment;
    });
    saveComments(updatedComments);
  };

  const isCommentLiked = (commentId: string) => {
    const likedComments = JSON.parse(localStorage.getItem('likedComments') || '[]');
    return likedComments.includes(commentId);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-16 border-t border-surface pt-8">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim() || !authorName.trim()}
          className="px-6 py-2 bg-accent text-background font-medium rounded-md hover:bg-accent-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-text-secondary text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-surface rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-text-primary">{comment.author}</h4>
                  <p className="text-sm text-text-secondary">{formatDate(comment.timestamp)}</p>
                </div>
              </div>
              <p className="text-text-secondary mb-4 leading-relaxed">{comment.content}</p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${
                    isCommentLiked(comment.id) 
                      ? 'text-accent' 
                      : 'text-text-secondary hover:text-accent'
                  }`}
                >
                  <svg className="w-4 h-4" fill={isCommentLiked(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{comment.likes}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
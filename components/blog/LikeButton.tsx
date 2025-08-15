import React, { useState, useEffect } from 'react';

interface LikeButtonProps {
  articleId: string;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ articleId, className = '' }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load likes from localStorage
    const savedLikes = localStorage.getItem(`article-likes-${articleId}`);
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    
    setLikes(Number(savedLikes || '0'));
    setIsLiked(likedArticles.includes(articleId));
  }, [articleId]);

  const handleLike = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    let newLikes = likes;

    if (isLiked) {
      // Unlike
      newLikes = Math.max(0, likes - 1);
      const updatedLikedArticles = likedArticles.filter((id: string) => id !== articleId);
      localStorage.setItem('likedArticles', JSON.stringify(updatedLikedArticles));
      setIsLiked(false);
    } else {
      // Like
      newLikes = likes + 1;
      likedArticles.push(articleId);
      localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
      setIsLiked(true);
    }

    localStorage.setItem(`article-likes-${articleId}`, String(newLikes));
    setLikes(newLikes);
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-2 transition-all duration-300 ${
        isLiked 
          ? 'text-red-500' 
          : 'text-text-secondary hover:text-red-500'
      } ${className}`}
    >
      <svg 
        className={`w-6 h-6 transition-transform duration-300 ${
          isAnimating ? 'scale-125' : 'scale-100'
        }`} 
        fill={isLiked ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      <span className="font-medium">{likes}</span>
    </button>
  );
};

export default LikeButton;
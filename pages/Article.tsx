import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import ParticleBackground from '../components/common/ParticleBackground';
import CommentSection from '../components/blog/CommentSection';
import LikeButton from '../components/blog/LikeButton';
import { apiService } from '../services/api';

interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  readTime: string;
  description: string;
  published: boolean;
}

const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const load = async () => {
      try {
        const a = await apiService.getArticle(id);
        if (!isMounted) return;
        if (a && a.published) {
          setArticle(a);
        } else {
          setArticle(null);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load article:', err);
        setArticle(null);
      }
    };
    load();

    const interval = setInterval(load, 5000);
    return () => { isMounted = false; clearInterval(interval); };

    // Handle view counting (still local to avoid backend writes for views)
    const key = `article-views-${id}`;
    const sessionKey = `article-viewed-${id}`;
    if (!sessionStorage.getItem(sessionKey)) {
      let currentViews = Number(localStorage.getItem(key) || '0');
      currentViews += 1;
      localStorage.setItem(key, String(currentViews));
      setViews(currentViews);
      sessionStorage.setItem(sessionKey, 'true');
    } else {
      setViews(Number(localStorage.getItem(key) || '0'));
    }
  }, [id]);

  return (
    <div className="bg-background font-sans text-text-secondary antialiased min-h-screen flex flex-col relative">
      <ParticleBackground />
      <header className="bg-background/80 backdrop-blur-md shadow-lg shadow-surface/20 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex justify-between items-center">
          <Link to="/" aria-label="home" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
            <Logo />
          </Link>
          <Link to="/blog" className="text-sm font-medium transition-colors duration-300 text-text-secondary hover:text-accent">
            ← Back to Blog
          </Link>
        </div>
      </header>
      <main className="pt-32 pb-16 px-6 sm:px-8 flex-1 relative z-10">
        <div className="max-w-4xl mx-auto">
          {article ? (
            <>
              <div className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">{article.title}</h1>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <span>Published: {article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>Views: {views}</span>
                  </div>
                  <LikeButton articleId={id!} className="text-lg" />
                </div>
              </div>
              
              <div 
                className="text-text-secondary text-lg leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <CommentSection articleId={id!} />
            </>
          ) : (
            <div className="text-center text-text-primary">Article not found.</div>
          )}
        </div>
      </main>
      <footer className="py-8 text-center text-text-secondary text-sm">
        <p>Kumar Simkhada &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Article;
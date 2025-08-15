import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import ParticleBackground from '../components/common/ParticleBackground';
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

const Blog: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [commentCounts, setCommentCounts] = useState<{[key: string]: number}>({});

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const allArticles: Article[] = await apiService.getArticles();
        if (!isMounted) return;
        const publishedArticles = allArticles.filter(article => article.published);
        setArticles(publishedArticles);

        // Fetch comment counts per article from API
        const counts: {[key: string]: number} = {};
        await Promise.all(
          publishedArticles.map(async (article) => {
            try {
              const comments = await apiService.getComments(article.id);
              counts[article.id] = Array.isArray(comments) ? comments.length : 0;
            } catch {
              counts[article.id] = 0;
            }
          })
        );
        if (!isMounted) return;
        setCommentCounts(counts);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load blog data:', err);
        setArticles([]);
        setCommentCounts({});
      }
    };

    // initial load
    load();

    // refresh when tab gains focus or becomes visible
    const onFocus = () => load();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') load();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
  <div className="bg-background font-sans text-text-secondary antialiased min-h-screen flex flex-col relative">
    <ParticleBackground />
    <header className="bg-background/80 backdrop-blur-md shadow-lg shadow-surface/20 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex justify-between items-center">
        <Link to="/" aria-label="home" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
          <Logo />
        </Link>
        <Link to="/" className="text-sm font-medium transition-colors duration-300 text-text-secondary hover:text-accent">
          ← Back to Portfolio
        </Link>
      </div>
    </header>

    <main className="pt-24 sm:pt-32 pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8 flex-1 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">Code & Data</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            A blog about software development, data engineering, and technology.
          </p>
        </div>

        <div className="space-y-12">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-text-primary mb-2">No Articles Yet</h3>
              <p className="text-text-secondary">Check back soon for new content!</p>
            </div>
          ) : (
            articles.map((article) => (
              <article key={article.id} className="group bg-surface/30 rounded-lg p-6 hover:bg-surface/50 transition-colors duration-300">
                <p className="text-sm text-text-secondary mb-2">{article.date} • {article.readTime}</p>
                <Link to={`/blog/${article.id}`} className="block">
                  <h2 className="text-2xl font-bold text-text-primary group-hover:text-accent transition-colors duration-300 mb-3">
                    {article.title}
                  </h2>
                  <p className="text-text-secondary mb-4">
                    {article.description}
                  </p>
                  <span className="text-accent font-medium">Read more →</span>
                </Link>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-light">
                  <LikeButton articleId={article.id} />
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{commentCounts[article.id] || 0}</span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>

    <footer className="py-8 text-center text-text-secondary text-sm">
      <p>Kumar Simkhada &copy; {new Date().getFullYear()}</p>
    </footer>
  </div>
  );
};

export default Blog;
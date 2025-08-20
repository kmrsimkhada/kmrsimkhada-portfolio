import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import ParticleBackground from '../components/common/ParticleBackground';
import { apiService } from '../services/api';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'currentlyReading' | 'alreadyRead' | 'wantToRead';
  progress?: number;
  rating?: number;
  description?: string;
  completedDate?: string;
}

const Reading: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        console.log('📚 Reading: Starting to load books...');
        const data = await apiService.getBooks();
        console.log('✅ Reading: API response:', data);
        setBooks(data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Reading: Failed to load books:', err);
        setBooks([]);
        setLoading(false);
      }
    };
    load();
  }, []);

  const currentlyReading = books.filter(book => book.status === 'currentlyReading');
  const alreadyRead = books.filter(book => book.status === 'alreadyRead');
  const wantToRead = books.filter(book => book.status === 'wantToRead');

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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">Reading List</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Books, articles, and resources that have shaped my thinking about technology, engineering, and life.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
              <span className="text-text-secondary">Loading reading list...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Currently Reading Section */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                <span className="w-3 h-3 bg-accent rounded-full mr-3 animate-pulse"></span>
                Currently Reading
              </h2>
              {currentlyReading.length === 0 ? (
                <div className="bg-surface/30 rounded-lg p-6 text-center">
                  <p className="text-text-secondary">No books currently being read.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentlyReading.map((book) => (
                    <div key={book.id} className="bg-surface/30 rounded-lg p-6 hover:bg-surface/50 transition-colors duration-300">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-32 bg-surface-light rounded-lg flex items-center justify-center">
                            <span className="text-text-secondary text-xs">📚</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-text-primary mb-2">{book.title}</h3>
                          <p className="text-accent mb-2">by {book.author}</p>
                          {book.description && (
                            <p className="text-text-secondary mb-4">{book.description}</p>
                          )}
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-text-secondary">Progress: {book.progress || 0}%</span>
                            <div className="flex-1 max-w-xs bg-surface-light rounded-full h-2">
                              <div className="bg-accent h-2 rounded-full" style={{ width: `${book.progress || 0}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Already Read Section */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Already Read</h2>
              {alreadyRead.length === 0 ? (
                <div className="bg-surface/30 rounded-lg p-6 text-center">
                  <p className="text-text-secondary">No books completed yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {alreadyRead.map((book) => (
                    <div key={book.id} className="bg-surface/30 rounded-lg p-6 hover:bg-surface/50 transition-colors duration-300">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-20 bg-surface-light rounded flex items-center justify-center">
                            <span className="text-text-secondary text-xs">📚</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-text-primary mb-1">{book.title}</h3>
                          <p className="text-accent text-sm mb-2">by {book.author}</p>
                          {book.description && (
                            <p className="text-text-secondary text-sm mb-3">{book.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-text-secondary">{book.category}</span>
                            {book.rating && (
                              <div className="flex text-accent">
                                {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                              </div>
                            )}
                          </div>
                          {book.completedDate && (
                            <p className="text-xs text-text-secondary mt-2">Completed: {book.completedDate}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Want to Read Section */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Want to Read</h2>
              {wantToRead.length === 0 ? (
                <div className="bg-surface/30 rounded-lg p-6 text-center">
                  <p className="text-text-secondary">No books in the wishlist yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {wantToRead.map((book) => (
                    <div key={book.id} className="bg-surface/20 rounded-lg p-4 hover:bg-surface/40 transition-colors duration-300">
                      <h3 className="font-semibold text-text-primary mb-1">{book.title}</h3>
                      <p className="text-accent text-sm mb-2">by {book.author}</p>
                      <span className="inline-block px-2 py-1 bg-surface text-xs rounded text-text-secondary">
                        {book.category}
                      </span>
                      {book.description && (
                        <p className="text-text-secondary text-xs mt-2">{book.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Reading Stats Section */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Reading Stats</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-surface/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">{alreadyRead.length}</div>
                  <div className="text-text-secondary">Books Read</div>
                </div>
                <div className="bg-surface/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">{currentlyReading.length}</div>
                  <div className="text-text-secondary">Currently Reading</div>
                </div>
                <div className="bg-surface/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">{wantToRead.length}</div>
                  <div className="text-text-secondary">Want to Read</div>
                </div>
              </div>
            </section>

            {/* Favorite Quotes Section */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Favorite Quotes</h2>
              <div className="space-y-6">
                <blockquote className="bg-surface/30 rounded-lg p-6 border-l-4 border-accent">
                  <p className="text-text-primary italic mb-4">
                    "And, when you want something, all the universe conspires in helping you to achieve it."
                  </p>
                  <cite className="text-accent text-sm">— Paulo Coelho, The Alchemist</cite>
                </blockquote>
                <blockquote className="bg-surface/30 rounded-lg p-6 border-l-4 border-accent">
                  <p className="text-text-primary italic mb-4">
                    "The single most powerful asset we all have is our mind. If it is trained well, it can create enormous wealth."
                  </p>
                  <cite className="text-accent text-sm">— Robert Kiyosaki, Rich Dad Poor Dad</cite>
                </blockquote>
                <blockquote className="bg-surface/30 rounded-lg p-6 border-l-4 border-accent">
                  <p className="text-text-primary italic mb-4">
                    "Your personal experiences with money make up maybe 0.00000001% of what's happened in the world, but maybe 80% of how you think the world works."
                  </p>
                  <cite className="text-accent text-sm">— Morgan Housel, The Psychology of Money</cite>
                </blockquote>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>

    <footer className="py-8 text-center text-text-secondary text-sm relative z-10">
      <p>Kumar Simkhada &copy; {new Date().getFullYear()}</p>
    </footer>
  </div>
  );
};

export default Reading;
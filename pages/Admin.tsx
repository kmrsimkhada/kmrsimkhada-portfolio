import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import ParticleBackground from '../components/common/ParticleBackground';
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

interface TravelLocation {
    id: string;
    name: string;
    country: string;
    continent: string;
    coordinates: [number, number];
    description?: string;
    dateVisited?: string;
    duration?: string;
    imageUrl?: string;
    status: 'lived' | 'visited' | 'wantToVisit' | 'wantToLive';
}

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string;
    liveUrl?: string;
    githubUrl?: string;
    featured?: boolean;
    order?: number;
}

interface Skill {
    id: string;
    name: string;
    category?: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    icon?: string;
    order?: number;
}

interface Experience {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string[];
    location?: string;
    current?: boolean;
    order?: number;
}

type AdminSection = 'blog' | 'reading' | 'travel' | 'projects' | 'skills' | 'experience' | 'settings';

const Admin: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeSection, setActiveSection] = useState<AdminSection>('blog');

    // Blog state
    const [articles, setArticles] = useState<Article[]>([]);
    const [isEditingArticle, setIsEditingArticle] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Article>({
        id: '',
        title: '',
        content: '',
        date: '',
        readTime: '',
        description: '',
        published: false
    });

    // Reading state
    const [books, setBooks] = useState<Book[]>([]);
    const [isEditingBook, setIsEditingBook] = useState(false);
    const [currentBook, setCurrentBook] = useState<Book>({
        id: '',
        title: '',
        author: '',
        category: '',
        status: 'wantToRead',
        progress: 0,
        rating: 0,
        description: ''
    });

    // Travel state
    const [locations, setLocations] = useState<TravelLocation[]>([]);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<TravelLocation>({
        id: '',
        name: '',
        country: '',
        continent: '',
        coordinates: [0, 0],
        description: '',
        status: 'wantToVisit'
    });

    // Projects state
    const [projects, setProjects] = useState<Project[]>([]);
    const [isEditingProject, setIsEditingProject] = useState(false);
    const [currentProject, setCurrentProject] = useState<Project>({
        id: '',
        title: '',
        description: '',
        tags: [],
        featured: false,
        order: 0
    });

    // Skills state
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isEditingSkill, setIsEditingSkill] = useState(false);
    const [currentSkill, setCurrentSkill] = useState<Skill>({
        id: '',
        name: '',
        category: '',
        level: 'Intermediate',
        order: 0
    });

    // Experience state
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isEditingExperience, setIsEditingExperience] = useState(false);
    const [currentExperience, setCurrentExperience] = useState<Experience>({
        id: '',
        role: '',
        company: '',
        duration: '',
        description: [],
        current: false,
        order: 0
    });

    // Settings state
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    
    // Mobile menu state
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Credentials are now validated server-side only

    useEffect(() => {
        // Check if already authenticated
        const authStatus = localStorage.getItem('adminAuth');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
            loadAllData();
        }
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showMobileMenu && !(event.target as Element).closest('.relative')) {
                setShowMobileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMobileMenu]);

    const loadAllData = () => {
        loadArticles();
        loadBooks();
        loadLocations();
        loadProjects();
        loadSkills();
        loadExperiences();
    };

    // Remove undefined values to avoid DynamoDB update errors
    const sanitizePayload = (obj: Record<string, any>) => {
        const result: Record<string, any> = {};
        const disallowed = new Set(['id', 'createdAt', 'updatedAt', 'likes', 'comments']);
        Object.entries(obj).forEach(([key, value]) => {
            if (value === undefined) return;
            if (disallowed.has(key)) return;
            result[key] = value;
        });
        return result;
    };

    const loadArticles = async () => {
        try {
            const data = await apiService.getArticles();
            setArticles(data);
        } catch (error) {
            console.error('Failed to load articles:', error);
            // Fallback to localStorage for now
            const savedArticles = localStorage.getItem('blogArticles');
            if (savedArticles) {
                setArticles(JSON.parse(savedArticles));
            }
        }
    };

    const loadBooks = async () => {
        try {
            const data = await apiService.getBooks();
            setBooks(data);
        } catch (error) {
            console.error('Failed to load books:', error);
            // Fallback to localStorage for now
            const savedBooks = localStorage.getItem('readingBooks');
            if (savedBooks) {
                setBooks(JSON.parse(savedBooks));
            }
        }
    };

    const loadLocations = async () => {
        try {
            const data = await apiService.getLocations();
            setLocations(data);
        } catch (error) {
            console.error('Failed to load locations:', error);
            // Fallback to localStorage for now
            const savedLocations = localStorage.getItem('travelLocations');
            if (savedLocations) {
                setLocations(JSON.parse(savedLocations));
            }
        }
    };

    const loadProjects = async () => {
        try {
            const data = await apiService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const loadSkills = async () => {
        try {
            const data = await apiService.getSkills();
            setSkills(data);
        } catch (error) {
            console.error('Failed to load skills:', error);
        }
    };

    const loadExperiences = async () => {
        try {
            const data = await apiService.getExperiences();
            setExperiences(data);
        } catch (error) {
            console.error('Failed to load experiences:', error);
        }
    };

    const saveArticles = (updatedArticles: Article[]) => {
        // Keep localStorage as backup for now
        localStorage.setItem('blogArticles', JSON.stringify(updatedArticles));
        setArticles(updatedArticles);
    };

    const saveBooks = (updatedBooks: Book[]) => {
        // Keep localStorage as backup for now
        localStorage.setItem('readingBooks', JSON.stringify(updatedBooks));
        setBooks(updatedBooks);
    };

    const saveLocations = (updatedLocations: TravelLocation[]) => {
        // Keep localStorage as backup for now
        localStorage.setItem('travelLocations', JSON.stringify(updatedLocations));
        setLocations(updatedLocations);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiService.login(username, password);
            if (response.success) {
                setIsAuthenticated(true);
                localStorage.setItem('adminAuth', 'true');
                localStorage.setItem('adminUser', username);
                loadAllData();
            } else {
                alert(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminUser');
        setUsername('');
        setPassword('');
    };

    const handleSaveArticle = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const articleData = {
                title: currentArticle.title || '',
                content: currentArticle.content || '',
                description: currentArticle.description || '',
                published: Boolean(currentArticle.published),
                date: currentArticle.date || new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                readTime: currentArticle.readTime || `${Math.ceil((currentArticle.content || '').split(' ').length / 200)} min read`
            } as const;

            if (currentArticle.id) {
                // Update existing article
                await apiService.updateArticle(currentArticle.id, articleData);
            } else {
                // Create new article (omit id so backend generates one)
                const { id: _omitId, ...createPayload } = articleData as any;
                await apiService.createArticle(createPayload);
            }

            // Reload articles from API
            await loadArticles();
            
            setIsEditingArticle(false);
            setCurrentArticle({
                id: '',
                title: '',
                content: '',
                date: '',
                readTime: '',
                description: '',
                published: false
            });
        } catch (error) {
            console.error('Failed to save article:', error);
            alert('Failed to save article. Please try again.');
        }
    };

    // Book handlers
    const handleSaveBook = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const book: Book = {
                ...currentBook,
            };

            const payload = sanitizePayload(book) as any;

            if (currentBook.id) {
                await apiService.updateBook(currentBook.id, payload);
            } else {
                const { id: _omitId, ...createPayload } = payload as any;
                await apiService.createBook(createPayload);
            }

            await loadBooks();
            setIsEditingBook(false);
            setCurrentBook({
                id: '',
                title: '',
                author: '',
                category: '',
                status: 'wantToRead',
                progress: 0,
                rating: 0,
                description: ''
            });
        } catch (error) {
            console.error('Failed to save book:', error);
            alert(`Failed to save book. ${(error as Error)?.message || ''}`);
        }
    };

    const handleEditBook = (book: Book) => {
        setCurrentBook(book);
        setIsEditingBook(true);
    };

    const handleDeleteBook = async (id: string) => {
        if (confirm('Are you sure you want to delete this book?')) {
            try {
                await apiService.deleteBook(id);
                await loadBooks();
            } catch (error) {
                console.error('Failed to delete book:', error);
                alert('Failed to delete book. Please try again.');
            }
        }
    };

    const handleNewBook = () => {
        setCurrentBook({
            id: '',
            title: '',
            author: '',
            category: '',
            status: 'wantToRead',
            progress: 0,
            rating: 0,
            description: ''
        });
        setIsEditingBook(true);
    };

    // Location handlers
    const handleSaveLocation = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const location: TravelLocation = {
                ...currentLocation,
            };

            const payload = sanitizePayload(location) as any;

            if (currentLocation.id) {
                await apiService.updateLocation(currentLocation.id, payload);
            } else {
                const { id: _omitId, ...createPayload } = payload as any;
                await apiService.createLocation(createPayload);
            }

            await loadLocations();
            setIsEditingLocation(false);
            setCurrentLocation({
                id: '',
                name: '',
                country: '',
                continent: '',
                coordinates: [0, 0],
                description: '',
                status: 'wantToVisit'
            });
        } catch (error) {
            console.error('Failed to save location:', error);
            alert(`Failed to save location. ${(error as Error)?.message || ''}`);
        }
    };

    const handleEditLocation = (location: TravelLocation) => {
        setCurrentLocation(location);
        setIsEditingLocation(true);
    };

    const handleDeleteLocation = async (id: string) => {
        if (confirm('Are you sure you want to delete this location?')) {
            try {
                await apiService.deleteLocation(id);
                await loadLocations();
            } catch (error) {
                console.error('Failed to delete location:', error);
                alert('Failed to delete location. Please try again.');
            }
        }
    };

    const handleNewLocation = () => {
        setCurrentLocation({
            id: '',
            name: '',
            country: '',
            continent: '',
            coordinates: [0, 0],
            description: '',
            status: 'wantToVisit'
        });
        setIsEditingLocation(true);
    };

    const handleEditArticle = (article: Article) => {
        setCurrentArticle(article);
        setIsEditingArticle(true);
    };

    const handleDeleteArticle = async (id: string) => {
        if (confirm('Are you sure you want to delete this article?')) {
            try {
                await apiService.deleteArticle(id);
                await loadArticles(); // Reload from API
            } catch (error) {
                console.error('Failed to delete article:', error);
                alert('Failed to delete article. Please try again.');
            }
        }
    };

    const handleNewArticle = () => {
        setCurrentArticle({
            id: '',
            title: '',
            content: '',
            date: '',
            readTime: '',
            description: '',
            published: false
        });
        setIsEditingArticle(true);
    };

    // Project handlers
    const handleSaveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const projectData = {
                ...currentProject,
                tags: typeof currentProject.tags === 'string' 
                    ? currentProject.tags.split(',').map(tag => tag.trim())
                    : currentProject.tags
            };

            const payload = sanitizePayload(projectData) as any;

            if (currentProject.id) {
                await apiService.updateProject(currentProject.id, payload);
            } else {
                const { id: _omitId, ...createPayload } = payload as any;
                await apiService.createProject(createPayload);
            }

            await loadProjects();
            setIsEditingProject(false);
            setCurrentProject({
                id: '',
                title: '',
                description: '',
                tags: [],
                featured: false,
                order: 0
            });
        } catch (error) {
            console.error('Failed to save project:', error);
            alert(`Failed to save project. ${(error as Error)?.message || ''}`);
        }
    };

    const handleEditProject = (project: Project) => {
        setCurrentProject(project);
        setIsEditingProject(true);
    };

    const handleDeleteProject = async (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await apiService.deleteProject(id);
                await loadProjects();
            } catch (error) {
                console.error('Failed to delete project:', error);
                alert('Failed to delete project. Please try again.');
            }
        }
    };

    // Skill handlers
    const handleSaveSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = sanitizePayload(currentSkill) as any;

            if (currentSkill.id) {
                await apiService.updateSkill(currentSkill.id, payload);
            } else {
                const { id: _omitId, ...createPayload } = payload as any;
                await apiService.createSkill(createPayload);
            }

            await loadSkills();
            setIsEditingSkill(false);
            setCurrentSkill({
                id: '',
                name: '',
                category: '',
                level: 'Intermediate',
                order: 0
            });
        } catch (error) {
            console.error('Failed to save skill:', error);
            alert(`Failed to save skill. ${(error as Error)?.message || ''}`);
        }
    };

    const handleEditSkill = (skill: Skill) => {
        setCurrentSkill(skill);
        setIsEditingSkill(true);
    };

    const handleDeleteSkill = async (id: string) => {
        if (confirm('Are you sure you want to delete this skill?')) {
            try {
                await apiService.deleteSkill(id);
                await loadSkills();
            } catch (error) {
                console.error('Failed to delete skill:', error);
                alert('Failed to delete skill. Please try again.');
            }
        }
    };

    // Experience handlers
    const handleSaveExperience = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const experienceData = {
                ...currentExperience,
                description: typeof currentExperience.description === 'string'
                    ? currentExperience.description.split('\n').filter(line => line.trim())
                    : currentExperience.description
            };

            const payload = sanitizePayload(experienceData) as any;

            if (currentExperience.id) {
                await apiService.updateExperience(currentExperience.id, payload);
            } else {
                const { id: _omitId, ...createPayload } = payload as any;
                await apiService.createExperience(createPayload);
            }

            await loadExperiences();
            setIsEditingExperience(false);
            setCurrentExperience({
                id: '',
                role: '',
                company: '',
                duration: '',
                description: [],
                current: false,
                order: 0
            });
        } catch (error) {
            console.error('Failed to save experience:', error);
            alert(`Failed to save experience. ${(error as Error)?.message || ''}`);
        }
    };

    const handleEditExperience = (experience: Experience) => {
        setCurrentExperience({
            ...experience,
            description: Array.isArray(experience.description) 
                ? experience.description.join('\n')
                : experience.description
        });
        setIsEditingExperience(true);
    };

    const handleDeleteExperience = async (id: string) => {
        if (confirm('Are you sure you want to delete this experience?')) {
            try {
                await apiService.deleteExperience(id);
                await loadExperiences();
            } catch (error) {
                console.error('Failed to delete experience:', error);
                alert('Failed to delete experience. Please try again.');
            }
        }
    };

    // Settings handlers
    const handleChangeCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        if (newPassword.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }

        try {
            // First verify current password
            const loginResponse = await apiService.login(username, currentPassword);
            if (!loginResponse.success) {
                alert('Current password is incorrect!');
                return;
            }

            // Call the change credentials API
            const response = await apiService.changeCredentials({
                currentUsername: username,
                currentPassword: currentPassword,
                newUsername: newUsername || username,
                newPassword: newPassword
            });

            if (response.success) {
                alert('Credentials updated successfully! Please log in again.');
                handleLogout();
            } else {
                alert(response.message || 'Failed to update credentials');
            }
        } catch (error) {
            console.error('Failed to change credentials:', error);
            alert('Failed to update credentials. Please try again.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-background font-sans text-text-secondary antialiased min-h-screen flex flex-col relative">
                <ParticleBackground />
                <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className="bg-surface/30 rounded-lg p-8 w-full max-w-md">
                        <div className="text-center mb-6">
                            <Logo />
                            <h1 className="text-2xl font-bold text-text-primary mt-4">Admin Login</h1>
                            <p className="text-text-secondary">Enter your credentials to access admin panel</p>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-surface border border-surface-light rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-surface border border-surface-light rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-accent text-background font-medium py-3 rounded-md hover:bg-accent-light transition-colors duration-300"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background font-sans text-text-secondary antialiased min-h-screen flex flex-col relative">
            <ParticleBackground />
            <header className="bg-background/80 backdrop-blur-md shadow-lg shadow-surface/20 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
                    <Link to="/" aria-label="home" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
                        <Logo />
                    </Link>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Mobile: Dropdown Menu */}
                        <div className="relative sm:hidden">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="flex items-center space-x-1 px-3 py-2 rounded-md bg-surface/30 text-text-secondary hover:text-accent transition-colors"
                            >
                                <span>📱</span>
                                <span className="text-xs">Menu</span>
                                <svg className={`w-4 h-4 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {showMobileMenu && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-surface-light rounded-lg shadow-lg z-50">
                                    <div className="py-2">
                                        <Link to="/" className="flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-surface-light transition-colors">
                                            <span>🏠</span>
                                            <span>Home</span>
                                        </Link>
                                        <Link to="/#projects" className="flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-surface-light transition-colors">
                                            <span>💼</span>
                                            <span>Projects</span>
                                        </Link>
                                        <Link to="/#skills" className="flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-surface-light transition-colors">
                                            <span>🛠️</span>
                                            <span>Skills</span>
                                        </Link>
                                        <Link to="/#experience" className="flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-surface-light transition-colors">
                                            <span>👔</span>
                                            <span>Experience</span>
                                        </Link>
                                        <Link to="/blog" className="flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-surface-light transition-colors">
                                            <span>📝</span>
                                            <span>Blog</span>
                                        </Link>
                                        <div className="border-t border-surface-light my-2"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-surface-light transition-colors w-full text-left"
                                        >
                                            <span>🚪</span>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden sm:flex items-center space-x-2 lg:space-x-3">
                            <Link to="/" className="text-xs lg:text-sm font-medium transition-colors duration-300 text-text-secondary hover:text-accent flex items-center space-x-1">
                                <span>🏠</span>
                                <span className="hidden lg:inline">Home</span>
                            </Link>
                            <Link to="/#projects" className="text-xs lg:text-sm font-medium transition-colors duration-300 text-text-secondary hover:text-accent flex items-center space-x-1">
                                <span>💼</span>
                                <span className="hidden lg:inline">Projects</span>
                            </Link>
                            <Link to="/#skills" className="text-xs lg:text-sm font-medium transition-colors duration-300 text-text-secondary hover:text-accent flex items-center space-x-1">
                                <span>🛠️</span>
                                <span className="hidden lg:inline">Skills</span>
                            </Link>
                            <Link to="/blog" className="text-xs lg:text-sm font-medium transition-colors duration-300 text-text-secondary hover:text-accent flex items-center space-x-1">
                                <span>📝</span>
                                <span className="hidden lg:inline">Blog</span>
                            </Link>
                        </nav>
                        
                        <div className="hidden sm:block h-6 w-px bg-surface-light"></div>
                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex text-xs lg:text-sm font-medium transition-colors duration-300 text-text-secondary hover:text-red-400 items-center space-x-1"
                        >
                            <span>🚪</span>
                            <span className="hidden lg:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-20 sm:pt-32 pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8 flex-1 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Content Admin</h1>
                            <p className="text-text-secondary mt-1 text-sm sm:text-base">Welcome back, {localStorage.getItem('adminUser') || 'Admin'}!</p>
                        </div>
                        <div className="flex space-x-2 sm:space-x-3">
                            {activeSection === 'blog' && (
                                <button
                                    onClick={handleNewArticle}
                                    className="bg-accent text-background px-3 sm:px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300 text-sm sm:text-base"
                                >
                                    <span className="sm:hidden">+ Article</span>
                                    <span className="hidden sm:inline">New Article</span>
                                </button>
                            )}
                            {activeSection === 'projects' && (
                                <button
                                    onClick={() => setIsEditingProject(true)}
                                    className="bg-accent text-background px-3 sm:px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300 text-sm sm:text-base"
                                >
                                    <span className="sm:hidden">+ Project</span>
                                    <span className="hidden sm:inline">Add Project</span>
                                </button>
                            )}
                            {activeSection === 'skills' && (
                                <button
                                    onClick={() => setIsEditingSkill(true)}
                                    className="bg-accent text-background px-3 sm:px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300 text-sm sm:text-base"
                                >
                                    <span className="sm:hidden">+ Skill</span>
                                    <span className="hidden sm:inline">Add Skill</span>
                                </button>
                            )}
                            {activeSection === 'experience' && (
                                <button
                                    onClick={() => setIsEditingExperience(true)}
                                    className="bg-accent text-background px-3 sm:px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300 text-sm sm:text-base"
                                >
                                    <span className="sm:hidden">+ Experience</span>
                                    <span className="hidden sm:inline">Add Experience</span>
                                </button>
                            )}
                            {activeSection === 'reading' && (
                                <button
                                    onClick={handleNewBook}
                                    className="bg-accent text-background px-3 sm:px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300 text-sm sm:text-base"
                                >
                                    <span className="sm:hidden">+ Book</span>
                                    <span className="hidden sm:inline">Add Book</span>
                                </button>
                            )}
                            {activeSection === 'travel' && (
                                <button
                                    onClick={handleNewLocation}
                                    className="bg-accent text-background px-3 sm:px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300 text-sm sm:text-base"
                                >
                                    <span className="sm:hidden">+ Location</span>
                                    <span className="hidden sm:inline">Add Location</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Section Tabs - Mobile Responsive */}
                    <div className="mb-6 sm:mb-8">
                        {/* Mobile: 2-Row Grid */}
                        <div className="grid sm:hidden grid-cols-4 gap-2 bg-surface/30 rounded-lg p-2">
                            {[
                                { key: 'blog', label: 'Blog', icon: '📝' },
                                { key: 'projects', label: 'Projects', icon: '💼' },
                                { key: 'skills', label: 'Skills', icon: '🛠️' },
                                { key: 'experience', label: 'Experience', icon: '👔' },
                                { key: 'reading', label: 'Reading', icon: '📚' },
                                { key: 'travel', label: 'Travel', icon: '✈️' },
                                { key: 'settings', label: 'Settings', icon: '⚙️' }
                            ].map((section) => (
                                <button
                                    key={section.key}
                                    onClick={() => setActiveSection(section.key as AdminSection)}
                                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg font-medium transition-colors duration-300 ${activeSection === section.key
                                        ? 'bg-accent text-background'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                                        }`}
                                >
                                    <span className="text-lg mb-1">{section.icon}</span>
                                    <span className="text-xs leading-tight text-center">{section.label}</span>
                                </button>
                            ))}
                        </div>
                        
                        {/* Desktop: Grid Layout */}
                        <div className="hidden sm:grid grid-cols-4 lg:grid-cols-7 gap-1 bg-surface/30 rounded-lg p-1">
                            {[
                                { key: 'blog', label: 'Blog', icon: '📝' },
                                { key: 'projects', label: 'Projects', icon: '💼' },
                                { key: 'skills', label: 'Skills', icon: '🛠️' },
                                { key: 'experience', label: 'Experience', icon: '👔' },
                                { key: 'reading', label: 'Reading', icon: '📚' },
                                { key: 'travel', label: 'Travel', icon: '✈️' },
                                { key: 'settings', label: 'Settings', icon: '⚙️' }
                            ].map((section) => (
                                <button
                                    key={section.key}
                                    onClick={() => setActiveSection(section.key as AdminSection)}
                                    className={`flex items-center justify-center space-x-2 px-2 lg:px-4 py-2 rounded-md font-medium transition-colors duration-300 ${activeSection === section.key
                                        ? 'bg-accent text-background'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                                        }`}
                                >
                                    <span>{section.icon}</span>
                                    <span className="hidden lg:inline text-sm">{section.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Blog Section */}
                    {activeSection === 'blog' && (
                        <>
                            {isEditingArticle ? (
                                <div className="bg-surface/30 rounded-lg p-6 mb-8">
                                    <h2 className="text-xl font-bold text-text-primary mb-6">
                                        {currentArticle.id ? 'Edit Article' : 'New Article'}
                                    </h2>

                                    <form onSubmit={handleSaveArticle} className="space-y-4">
                                        <div>
                                            <label className="block text-text-primary font-medium mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={currentArticle.title}
                                                onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                                                className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-text-primary font-medium mb-2">Description</label>
                                            <textarea
                                                value={currentArticle.description}
                                                onChange={(e) => setCurrentArticle({ ...currentArticle, description: e.target.value })}
                                                rows={2}
                                                className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-text-primary font-medium mb-2">Content</label>
                                            <textarea
                                                value={currentArticle.content}
                                                onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                                                rows={15}
                                                className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                                placeholder="Write your article content here... You can use basic HTML tags."
                                                required
                                            />
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={currentArticle.published}
                                                    onChange={(e) => setCurrentArticle({ ...currentArticle, published: e.target.checked })}
                                                    className="mr-2"
                                                />
                                                <span className="text-text-primary">Publish immediately</span>
                                            </label>
                                        </div>

                                        <div className="flex space-x-4">
                                            <button
                                                type="submit"
                                                className="bg-accent text-background px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300"
                                            >
                                                Save Article
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingArticle(false)}
                                                className="bg-surface text-text-primary px-6 py-2 rounded-md font-medium hover:bg-surface-light transition-colors duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-text-primary">Articles ({articles.length})</h2>

                                    {articles.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-text-secondary">No articles yet. Create your first article!</p>
                                        </div>
                                    ) : (
                                        articles.map((article) => (
                                            <div key={article.id} className="bg-surface/30 rounded-lg p-6 flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-lg font-bold text-text-primary">{article.title}</h3>
                                                        <span className={`px-2 py-1 rounded text-xs ${article.published
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                            {article.published ? 'Published' : 'Draft'}
                                                        </span>
                                                    </div>
                                                    <p className="text-text-secondary text-sm mb-2">{article.description}</p>
                                                    <p className="text-text-secondary text-xs">
                                                        {article.date} • {article.readTime}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    <button
                                                        onClick={() => handleEditArticle(article)}
                                                        className="text-accent hover:text-accent-light transition-colors duration-300"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteArticle(article.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors duration-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Reading Section */}
                    {activeSection === 'reading' && (
                        <>
                            {isEditingBook ? (
                                <div className="bg-surface/30 rounded-lg p-6 mb-8">
                                    <h2 className="text-xl font-bold text-text-primary mb-6">
                                        {currentBook.id ? 'Edit Book' : 'Add Book'}
                                    </h2>

                                    <form onSubmit={handleSaveBook} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    value={currentBook.title}
                                                    onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Author</label>
                                                <input
                                                    type="text"
                                                    value={currentBook.author}
                                                    onChange={(e) => setCurrentBook({ ...currentBook, author: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Category</label>
                                                <input
                                                    type="text"
                                                    value={currentBook.category}
                                                    onChange={(e) => setCurrentBook({ ...currentBook, category: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="e.g., Philosophy, Finance, Self-Help"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Status</label>
                                                <select
                                                    value={currentBook.status}
                                                    onChange={(e) => setCurrentBook({ ...currentBook, status: e.target.value as Book['status'] })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                >
                                                    <option value="wantToRead">Want to Read</option>
                                                    <option value="currentlyReading">Currently Reading</option>
                                                    <option value="alreadyRead">Already Read</option>
                                                </select>
                                            </div>
                                        </div>

                                        {currentBook.status === 'currentlyReading' && (
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Progress (%)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={currentBook.progress || 0}
                                                    onChange={(e) => setCurrentBook({ ...currentBook, progress: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                />
                                            </div>
                                        )}

                                        {currentBook.status === 'alreadyRead' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-text-primary font-medium mb-2">Rating (1-5)</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="5"
                                                        value={currentBook.rating || 0}
                                                        onChange={(e) => setCurrentBook({ ...currentBook, rating: parseInt(e.target.value) })}
                                                        className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-text-primary font-medium mb-2">Completed Date</label>
                                                    <input
                                                        type="text"
                                                        value={currentBook.completedDate || ''}
                                                        onChange={(e) => setCurrentBook({ ...currentBook, completedDate: e.target.value })}
                                                        className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                        placeholder="e.g., November 2024"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-text-primary font-medium mb-2">Description</label>
                                            <textarea
                                                value={currentBook.description || ''}
                                                onChange={(e) => setCurrentBook({ ...currentBook, description: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                                placeholder="Brief description of the book..."
                                            />
                                        </div>

                                        <div className="flex space-x-4">
                                            <button
                                                type="submit"
                                                className="bg-accent text-background px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300"
                                            >
                                                Save Book
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingBook(false)}
                                                className="bg-surface text-text-primary px-6 py-2 rounded-md font-medium hover:bg-surface-light transition-colors duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-text-primary">Books ({books.length})</h2>

                                    {books.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-text-secondary">No books yet. Add your first book!</p>
                                        </div>
                                    ) : (
                                        books.map((book) => (
                                            <div key={book.id} className="bg-surface/30 rounded-lg p-6 flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-lg font-bold text-text-primary">{book.title}</h3>
                                                        <span className={`px-2 py-1 rounded text-xs ${book.status === 'alreadyRead' ? 'bg-green-500/20 text-green-400' :
                                                            book.status === 'currentlyReading' ? 'bg-blue-500/20 text-blue-400' :
                                                                'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                            {book.status === 'alreadyRead' ? 'Read' :
                                                                book.status === 'currentlyReading' ? 'Reading' : 'Want to Read'}
                                                        </span>
                                                    </div>
                                                    <p className="text-accent text-sm mb-1">{book.author}</p>
                                                    <p className="text-text-secondary text-sm mb-2">{book.category}</p>
                                                    {book.description && (
                                                        <p className="text-text-secondary text-sm">{book.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    <button
                                                        onClick={() => handleEditBook(book)}
                                                        className="text-accent hover:text-accent-light transition-colors duration-300"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBook(book.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors duration-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Travel Section */}
                    {activeSection === 'travel' && (
                        <>
                            {isEditingLocation ? (
                                <div className="bg-surface/30 rounded-lg p-6 mb-8">
                                    <h2 className="text-xl font-bold text-text-primary mb-6">
                                        {currentLocation.id ? 'Edit Location' : 'Add Location'}
                                    </h2>

                                    <form onSubmit={handleSaveLocation} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Name</label>
                                                <input
                                                    type="text"
                                                    value={currentLocation.name}
                                                    onChange={(e) => setCurrentLocation({ ...currentLocation, name: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="e.g., Tokyo, Finland"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Country</label>
                                                <input
                                                    type="text"
                                                    value={currentLocation.country}
                                                    onChange={(e) => setCurrentLocation({ ...currentLocation, country: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="e.g., Japan, Finland"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Continent</label>
                                                <select
                                                    value={currentLocation.continent}
                                                    onChange={(e) => setCurrentLocation({ ...currentLocation, continent: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    required
                                                >
                                                    <option value="">Select Continent</option>
                                                    <option value="Asia">Asia</option>
                                                    <option value="Europe">Europe</option>
                                                    <option value="North America">North America</option>
                                                    <option value="South America">South America</option>
                                                    <option value="Africa">Africa</option>
                                                    <option value="Australia">Australia</option>
                                                    <option value="Antarctica">Antarctica</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Status</label>
                                                <select
                                                    value={currentLocation.status}
                                                    onChange={(e) => setCurrentLocation({ ...currentLocation, status: e.target.value as TravelLocation['status'] })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                >
                                                    <option value="lived">Places Lived</option>
                                                    <option value="visited">Countries Visited</option>
                                                    <option value="wantToVisit">Want to Visit</option>
                                                    <option value="wantToLive">Want to Live</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Latitude</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={currentLocation.coordinates[0]}
                                                    onChange={(e) => setCurrentLocation({ ...currentLocation, coordinates: [parseFloat(e.target.value), currentLocation.coordinates[1]] })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="e.g., 35.6762"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Longitude</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={currentLocation.coordinates[1]}
                                                    onChange={(e) => setCurrentLocation({ ...currentLocation, coordinates: [currentLocation.coordinates[0], parseFloat(e.target.value)] })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="e.g., 139.6503"
                                                />
                                            </div>
                                        </div>

                                        {(currentLocation.status === 'lived' || currentLocation.status === 'visited') && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-text-primary font-medium mb-2">Date Visited</label>
                                                    <input
                                                        type="text"
                                                        value={currentLocation.dateVisited || ''}
                                                        onChange={(e) => setCurrentLocation({ ...currentLocation, dateVisited: e.target.value })}
                                                        className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                        placeholder="e.g., March 2023"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-text-primary font-medium mb-2">Duration</label>
                                                    <input
                                                        type="text"
                                                        value={currentLocation.duration || ''}
                                                        onChange={(e) => setCurrentLocation({ ...currentLocation, duration: e.target.value })}
                                                        className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                        placeholder="e.g., 2 weeks, 5 years"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-text-primary font-medium mb-2">Image URL</label>
                                            <input
                                                type="url"
                                                value={currentLocation.imageUrl || ''}
                                                onChange={(e) => setCurrentLocation({ ...currentLocation, imageUrl: e.target.value })}
                                                className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-text-primary font-medium mb-2">Description</label>
                                            <textarea
                                                value={currentLocation.description || ''}
                                                onChange={(e) => setCurrentLocation({ ...currentLocation, description: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                                placeholder="Brief description of the location..."
                                            />
                                        </div>

                                        <div className="flex space-x-4">
                                            <button
                                                type="submit"
                                                className="bg-accent text-background px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300"
                                            >
                                                Save Location
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingLocation(false)}
                                                className="bg-surface text-text-primary px-6 py-2 rounded-md font-medium hover:bg-surface-light transition-colors duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-text-primary">Locations ({locations.length})</h2>

                                    {locations.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-text-secondary">No locations yet. Add your first location!</p>
                                        </div>
                                    ) : (
                                        locations.map((location) => (
                                            <div key={location.id} className="bg-surface/30 rounded-lg p-6 flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-lg font-bold text-text-primary">{location.name}</h3>
                                                        <span className={`px-2 py-1 rounded text-xs ${location.status === 'lived' ? 'bg-cyan-500/20 text-cyan-400' :
                                                            location.status === 'visited' ? 'bg-green-500/20 text-green-400' :
                                                                location.status === 'wantToVisit' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                    'bg-red-500/20 text-red-400'
                                                            }`}>
                                                            {location.status === 'lived' ? 'Lived' :
                                                                location.status === 'visited' ? 'Visited' :
                                                                    location.status === 'wantToVisit' ? 'Want to Visit' : 'Want to Live'}
                                                        </span>
                                                    </div>
                                                    <p className="text-accent text-sm mb-1">{location.country}</p>
                                                    <p className="text-text-secondary text-sm mb-2">{location.continent}</p>
                                                    {location.description && (
                                                        <p className="text-text-secondary text-sm">{location.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    <button
                                                        onClick={() => handleEditLocation(location)}
                                                        className="text-accent hover:text-accent-light transition-colors duration-300"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLocation(location.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors duration-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Projects Section */}
                    {activeSection === 'projects' && (
                        <>
                            {isEditingProject ? (
                                <div className="bg-surface/30 rounded-lg p-6 mb-8">
                                    <h2 className="text-xl font-bold text-text-primary mb-6">
                                        {currentProject.id ? 'Edit Project' : 'Add Project'}
                                    </h2>

                                    <form onSubmit={handleSaveProject} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    value={currentProject.title}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Tags (comma-separated)</label>
                                                <input
                                                    type="text"
                                                    value={Array.isArray(currentProject.tags) ? currentProject.tags.join(', ') : currentProject.tags}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, tags: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="React, Node.js, AWS"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-text-primary font-medium mb-2">Description</label>
                                            <textarea
                                                value={currentProject.description}
                                                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">GitHub URL</label>
                                                <input
                                                    type="url"
                                                    value={currentProject.githubUrl || ''}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, githubUrl: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Live URL</label>
                                                <input
                                                    type="url"
                                                    value={currentProject.liveUrl || ''}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, liveUrl: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={currentProject.featured || false}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, featured: e.target.checked })}
                                                    className="mr-2"
                                                />
                                                <span className="text-text-primary">Featured Project</span>
                                            </label>
                                        </div>

                                        <div className="flex space-x-4">
                                            <button
                                                type="submit"
                                                className="bg-accent text-background px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300"
                                            >
                                                Save Project
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingProject(false)}
                                                className="bg-surface text-text-primary px-6 py-2 rounded-md font-medium hover:bg-surface-light transition-colors duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-text-primary">Projects ({projects.length})</h2>

                                    {projects.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-text-secondary">No projects yet. Add your first project!</p>
                                        </div>
                                    ) : (
                                        projects.map((project) => (
                                            <div key={project.id} className="bg-surface/30 rounded-lg p-6 flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-lg font-bold text-text-primary">{project.title}</h3>
                                                        {project.featured && (
                                                            <span className="px-2 py-1 rounded text-xs bg-accent/20 text-accent">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-text-secondary text-sm mb-2">{project.description}</p>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {project.tags.map((tag) => (
                                                            <span key={tag} className="px-2 py-1 bg-surface text-text-secondary text-xs rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="flex space-x-4 text-xs text-text-secondary">
                                                        {project.githubUrl && <span>GitHub ✓</span>}
                                                        {project.liveUrl && <span>Live Demo ✓</span>}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    <button
                                                        onClick={() => handleEditProject(project)}
                                                        className="text-accent hover:text-accent-light transition-colors duration-300"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProject(project.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors duration-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Skills Section */}
                    {activeSection === 'skills' && (
                        <>
                            {isEditingSkill ? (
                                <div className="bg-surface/30 rounded-lg p-6 mb-8">
                                    <h2 className="text-xl font-bold text-text-primary mb-6">
                                        {currentSkill.id ? 'Edit Skill' : 'Add Skill'}
                                    </h2>

                                    <form onSubmit={handleSaveSkill} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Skill Name</label>
                                                <input
                                                    type="text"
                                                    value={currentSkill.name}
                                                    onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Category</label>
                                                <input
                                                    type="text"
                                                    value={currentSkill.category || ''}
                                                    onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="e.g., Frontend, Backend, Database"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Level</label>
                                                <select
                                                    value={currentSkill.level || 'Intermediate'}
                                                    onChange={(e) => setCurrentSkill({ ...currentSkill, level: e.target.value as Skill['level'] })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                >
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Advanced">Advanced</option>
                                                    <option value="Expert">Expert</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Icon (emoji)</label>
                                                <input
                                                    type="text"
                                                    value={currentSkill.icon || ''}
                                                    onChange={(e) => setCurrentSkill({ ...currentSkill, icon: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="⚛️"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex space-x-4">
                                            <button
                                                type="submit"
                                                className="bg-accent text-background px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300"
                                            >
                                                Save Skill
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingSkill(false)}
                                                className="bg-surface text-text-primary px-6 py-2 rounded-md font-medium hover:bg-surface-light transition-colors duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-text-primary">Skills ({skills.length})</h2>

                                    {skills.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-text-secondary">No skills yet. Add your first skill!</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {skills.map((skill) => (
                                                <div key={skill.id} className="bg-surface/30 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center space-x-2">
                                                            {skill.icon && <span className="text-lg">{skill.icon}</span>}
                                                            <h3 className="font-bold text-text-primary">{skill.name}</h3>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleEditSkill(skill)}
                                                                className="text-accent hover:text-accent-light transition-colors duration-300 text-sm"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteSkill(skill.id)}
                                                                className="text-red-400 hover:text-red-300 transition-colors duration-300 text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {skill.category && (
                                                        <p className="text-text-secondary text-sm mb-1">{skill.category}</p>
                                                    )}
                                                    {skill.level && (
                                                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                                                            skill.level === 'Expert' ? 'bg-green-500/20 text-green-400' :
                                                            skill.level === 'Advanced' ? 'bg-blue-500/20 text-blue-400' :
                                                            skill.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                            {skill.level}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Experience Section */}
                    {activeSection === 'experience' && (
                        <>
                            {isEditingExperience ? (
                                <div className="bg-surface/30 rounded-lg p-6 mb-8">
                                    <h2 className="text-xl font-bold text-text-primary mb-6">
                                        {currentExperience.id ? 'Edit Experience' : 'Add Experience'}
                                    </h2>

                                    <form onSubmit={handleSaveExperience} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Role</label>
                                                <input
                                                    type="text"
                                                    value={currentExperience.role}
                                                    onChange={(e) => setCurrentExperience({ ...currentExperience, role: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Company</label>
                                                <input
                                                    type="text"
                                                    value={currentExperience.company}
                                                    onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Duration</label>
                                                <input
                                                    type="text"
                                                    value={currentExperience.duration}
                                                    onChange={(e) => setCurrentExperience({ ...currentExperience, duration: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="Jan 2020 - Present"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-text-primary font-medium mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    value={currentExperience.location || ''}
                                                    onChange={(e) => setCurrentExperience({ ...currentExperience, location: e.target.value })}
                                                    className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="Sydney, Australia"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-text-primary font-medium mb-2">Description (one per line)</label>
                                            <textarea
                                                value={typeof currentExperience.description === 'string' ? currentExperience.description : currentExperience.description.join('\n')}
                                                onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
                                                rows={6}
                                                className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                                placeholder="Led development of scalable web applications&#10;Managed team of 5 developers&#10;Implemented CI/CD pipelines"
                                                required
                                            />
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={currentExperience.current || false}
                                                    onChange={(e) => setCurrentExperience({ ...currentExperience, current: e.target.checked })}
                                                    className="mr-2"
                                                />
                                                <span className="text-text-primary">Current Position</span>
                                            </label>
                                        </div>

                                        <div className="flex space-x-4">
                                            <button
                                                type="submit"
                                                className="bg-accent text-background px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300"
                                            >
                                                Save Experience
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingExperience(false)}
                                                className="bg-surface text-text-primary px-6 py-2 rounded-md font-medium hover:bg-surface-light transition-colors duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-text-primary">Experience ({experiences.length})</h2>

                                    {experiences.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-text-secondary">No experience yet. Add your first position!</p>
                                        </div>
                                    ) : (
                                        experiences.map((experience) => (
                                            <div key={experience.id} className="bg-surface/30 rounded-lg p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h3 className="text-lg font-bold text-text-primary">{experience.role}</h3>
                                                            {experience.current && (
                                                                <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                                                                    Current
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-accent font-medium mb-1">{experience.company}</p>
                                                        <p className="text-text-secondary text-sm mb-1">{experience.duration}</p>
                                                        {experience.location && (
                                                            <p className="text-text-secondary text-sm mb-3">{experience.location}</p>
                                                        )}
                                                        <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                                                            {Array.isArray(experience.description) ? 
                                                                experience.description.map((desc, index) => (
                                                                    <li key={index}>{desc}</li>
                                                                )) :
                                                                <li>{experience.description}</li>
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div className="flex space-x-2 ml-4">
                                                        <button
                                                            onClick={() => handleEditExperience(experience)}
                                                            className="text-accent hover:text-accent-light transition-colors duration-300"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteExperience(experience.id)}
                                                            className="text-red-400 hover:text-red-300 transition-colors duration-300"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Settings Section */}
                    {activeSection === 'settings' && (
                        <div className="space-y-8">
                            <h2 className="text-xl font-bold text-text-primary">Account Settings</h2>
                            
                            {/* Change Credentials */}
                            <div className="bg-surface/30 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-text-primary mb-4">Change Login Credentials</h3>
                                <p className="text-text-secondary text-sm mb-6">
                                    Update your admin username and password. You'll need to log in again after changing.
                                </p>

                                <form onSubmit={handleChangeCredentials} className="space-y-4">
                                    <div>
                                        <label className="block text-text-primary font-medium mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="Enter your current password"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-text-primary font-medium mb-2">New Username</label>
                                            <input
                                                type="text"
                                                value={newUsername}
                                                onChange={(e) => setNewUsername(e.target.value)}
                                                className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                placeholder={`Current: ${username}`}
                                            />
                                            <p className="text-text-secondary text-xs mt-1">Leave empty to keep current username</p>
                                        </div>
                                        <div>
                                            <label className="block text-text-primary font-medium mb-2">New Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                placeholder="Enter new password"
                                                minLength={8}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-text-primary font-medium mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="Confirm new password"
                                            minLength={8}
                                            required
                                        />
                                    </div>

                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4">
                                        <div className="flex items-start space-x-2">
                                            <span className="text-yellow-400 text-lg">⚠️</span>
                                            <div>
                                                <p className="text-yellow-400 font-medium text-sm">Important:</p>
                                                <ul className="text-yellow-300 text-xs mt-1 space-y-1">
                                                    <li>• You will be logged out after changing credentials</li>
                                                    <li>• Password must be at least 8 characters long</li>
                                                    <li>• Make sure to remember your new credentials</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            className="bg-accent text-background px-6 py-2 rounded-md font-medium hover:bg-accent-light transition-colors duration-300"
                                        >
                                            Update Credentials
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewUsername('');
                                                setNewPassword('');
                                                setConfirmPassword('');
                                                setCurrentPassword('');
                                            }}
                                            className="bg-surface text-text-primary px-6 py-2 rounded-md font-medium hover:bg-surface-light transition-colors duration-300"
                                        >
                                            Clear Form
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* System Information */}
                            <div className="bg-surface/30 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-text-primary mb-4">System Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-text-secondary">Current User:</p>
                                        <p className="text-text-primary font-medium">{username}</p>
                                    </div>
                                    <div>
                                        <p className="text-text-secondary">Last Login:</p>
                                        <p className="text-text-primary font-medium">{new Date().toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-text-secondary">API Endpoint:</p>
                                        <p className="text-text-primary font-medium text-xs">https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev</p>
                                    </div>
                                    <div>
                                        <p className="text-text-secondary">Database:</p>
                                        <p className="text-text-primary font-medium">AWS DynamoDB (Sydney)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Admin;
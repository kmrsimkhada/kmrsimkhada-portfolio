# Frontend Documentation

Modern React + TypeScript portfolio website with admin panel and dynamic content management.

## 🎨 Overview

A responsive, modern portfolio website built with React 19, TypeScript, and Vite. Features include a blog system, project showcase, reading list, travel experiences, and a complete admin panel for content management.

## 🚀 Quick Start

### Development Setup
```bash
# Install dependencies
npm install

# Start development server (connects to local backend)
npm run dev

# Development URLs:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000/dev (requires backend to be running)
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Technology Stack

### Core Framework
- **React**: 19.1.1 (Latest with concurrent features)
- **TypeScript**: ~5.8.2 (Type safety and development experience)
- **Vite**: ^6.3.5 (Fast build tool and dev server)

### Routing & Navigation
- **React Router DOM**: 7.8.0 (Client-side routing)
- **Hash Router**: Used for compatibility with static hosting

### Styling & UI
- **TailwindCSS**: Utility-first CSS framework
- **Custom Components**: Reusable UI components
- **Responsive Design**: Mobile-first approach
- **CSS Modules**: Component-scoped styles

### State Management
- **React Hooks**: useState, useEffect for local state
- **Context API**: For global state (if needed)
- **API Integration**: Real-time data from backend

## 🏗️ Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── common/             # Shared components
│   │   ├── Logo.tsx        # Site logo component
│   │   ├── Section.tsx     # Page section wrapper
│   │   └── ...
│   ├── blog/               # Blog-specific components
│   │   ├── CommentSection.tsx   # Article comments
│   │   ├── BlogCard.tsx         # Article preview card
│   │   └── ...
│   └── travel/             # Travel page components
│       ├── TravelMap.tsx   # Interactive travel map
│       └── ...
├── pages/                  # Route components (main pages)
│   ├── Home.tsx           # Landing page
│   ├── Blog.tsx           # Blog listing page
│   ├── Article.tsx        # Individual article view
│   ├── Projects.tsx       # Project showcase
│   ├── About.tsx          # About page
│   ├── Reading.tsx        # Reading list
│   ├── Travel.tsx         # Travel experiences
│   ├── Contact.tsx        # Contact form
│   └── Admin.tsx          # Admin dashboard
├── services/               # External service integrations
│   └── api.ts             # API service for backend communication
├── styles/                 # Global styles and Tailwind config
├── types.ts               # TypeScript type definitions
├── App.tsx                # Main application component
└── main.tsx              # Application entry point
```

## 🎯 Key Features

### Public Website Features
- **Responsive Design**: Works on all devices (mobile, tablet, desktop)
- **Interactive Portfolio**: Project showcase with live links and GitHub repos
- **Blog System**: Articles with comments, reading time, publication dates
- **Reading List**: Book recommendations with ratings and progress
- **Travel Map**: Interactive map showing places lived/visited/want to visit
- **Skills Showcase**: Technical skills organized by category
- **Work Experience**: Timeline of professional experience
- **Contact Form**: Direct communication capabilities

### Admin Panel Features
- **Dashboard**: Overview of all content and statistics
- **Content Management**: CRUD operations for all content types
- **Article Editor**: Rich text editing for blog posts
- **Project Management**: Add/edit portfolio projects with media
- **Book Management**: Track reading progress and recommendations
- **Location Management**: Manage travel experiences and wishlist
- **Skills Management**: Organize and categorize technical skills
- **Experience Management**: Update work history and achievements

### User Experience
- **Fast Loading**: Optimized with Vite and lazy loading
- **Smooth Animations**: CSS transitions and micro-interactions
- **Particle Background**: Interactive particle system
- **Dark Theme**: Modern dark color scheme
- **Typography**: Carefully chosen fonts and spacing
- **Accessibility**: Semantic HTML and keyboard navigation

## 🔧 Component Architecture

### Component Categories

#### 1. Page Components (pages/)
Main route components that represent full pages:

```typescript
// Example: Blog.tsx
export const Blog: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await apiService.getArticles();
        setArticles(data.filter(article => article.published));
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Component JSX */}
    </div>
  );
};
```

#### 2. Layout Components (components/common/)
Reusable layout and structural components:

```typescript
// Example: Section.tsx
interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ 
  id, 
  className = '', 
  children 
}) => (
  <section 
    id={id} 
    className={`py-20 px-4 ${className}`}
  >
    <div className="max-w-6xl mx-auto">
      {children}
    </div>
  </section>
);
```

#### 3. Feature Components (components/blog/, components/travel/)
Specialized components for specific features:

```typescript
// Example: CommentSection.tsx
interface CommentSectionProps {
  articleId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  // Component logic for handling comments
  return (
    <div className="mt-12 border-t border-gray-700 pt-8">
      {/* Comments UI */}
    </div>
  );
};
```

## 🔌 API Integration

### API Service Architecture
Centralized API communication through `services/api.ts`:

```typescript
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.PROD)
      ? 'https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev'
      : 'http://localhost:3000/dev';
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let details = '';
        try {
          const text = await response.text();
          details = text;
        } catch {}
        throw new Error(`Request failed ${response.status} ${response.statusText}${details ? `: ${details}` : ''}`);
      }

      // Some endpoints return 204/empty body; guard JSON parse
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Complete API methods for all content types
  
  // Articles
  async getArticles() { return this.request('/articles'); }
  async getArticle(id: string) { return this.request(`/articles/${id}`); }
  async createArticle(article: any) { 
    return this.request('/articles', { method: 'POST', body: JSON.stringify(article) }); 
  }
  async updateArticle(id: string, article: any) { 
    return this.request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(article) }); 
  }
  async deleteArticle(id: string) { 
    return this.request(`/articles/${id}`, { method: 'DELETE' }); 
  }

  // Books
  async getBooks() { return this.request('/books'); }
  async createBook(book: any) { 
    return this.request('/books', { method: 'POST', body: JSON.stringify(book) }); 
  }
  async updateBook(id: string, book: any) { 
    return this.request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(book) }); 
  }
  async deleteBook(id: string) { 
    return this.request(`/books/${id}`, { method: 'DELETE' }); 
  }

  // Locations, Projects, Skills, Experiences, Comments, Auth
  // ... (similar patterns for all other entities)
}

export const apiService = new ApiService();
```

### Data Flow Patterns

#### 1. Loading Data
```typescript
const [data, setData] = useState<DataType[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);
```

#### 2. Creating/Updating Data
```typescript
const handleSave = async (formData: FormData) => {
  try {
    if (isEditing) {
      await apiService.updateItem(itemId, formData);
    } else {
      await apiService.createItem(formData);
    }
    // Refresh data
    await loadData();
    // Reset form
    setFormData(initialState);
  } catch (error) {
    console.error('Save failed:', error);
    alert('Failed to save. Please try again.');
  }
};
```

## 🎨 Styling & Design System

### TailwindCSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        gray: {
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
```

### Design Principles
- **Mobile-First**: Design for mobile, enhance for desktop
- **Consistent Spacing**: Using Tailwind's spacing scale
- **Color Harmony**: Limited color palette for cohesion
- **Typography Scale**: Consistent text sizing and line heights
- **Interactive States**: Hover, focus, and active states for all interactive elements

### Component Styling Patterns
```typescript
// Consistent button styling
const buttonClasses = {
  base: "px-4 py-2 rounded-lg font-medium transition-colors",
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white"
};

// Usage
<button className={`${buttonClasses.base} ${buttonClasses.primary}`}>
  Save Article
</button>
```

## 🔧 Configuration

### Environment Configuration
```typescript
// Environment detection (from services/api.ts)
const API_BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.PROD)
  ? 'https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev'
  : 'http://localhost:3000/dev';

// Environment detection helpers
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// Feature flags
const FEATURES = {
  comments: true,
  analytics: isProd,
  debugging: isDev,
};
```

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true,
  }
})
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Lazy loading for route components
import { lazy, Suspense } from 'react';

const Admin = lazy(() => import('./pages/Admin'));
const Blog = lazy(() => import('./pages/Blog'));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/admin" element={<Admin />} />
    <Route path="/blog" element={<Blog />} />
  </Routes>
</Suspense>
```

### Image Optimization
```typescript
// Responsive images with proper loading
<img 
  src={imageUrl}
  alt={altText}
  loading="lazy"
  className="w-full h-auto object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 🧪 Development Workflow

### Local Development
```bash
# Start backend first (in separate terminal)
cd backend
npm run local

# Start frontend (in main directory)
npm run dev

# Development URLs:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000/dev

# Production configuration:
# Frontend: https://www.kmrsimkhada.com  
# Backend API: https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev
```

### Build Process
```bash
# Production build
npm run build

# Output in dist/ directory
# - Optimized and minified
# - Source maps included
# - Ready for S3 deployment

# Preview production build locally
npm run preview
```

### Code Quality
```bash
# Type checking
npx tsc --noEmit

# Linting (if configured)
npm run lint

# Formatting (if configured)
npm run format
```

## 🔍 Debugging

### Browser DevTools
- **React DevTools**: Component inspection and props
- **Network Tab**: API request monitoring
- **Console**: Error logging and debugging
- **Sources**: Breakpoint debugging with source maps

### Common Issues & Solutions

#### 1. API Connection Issues
```typescript
// Debug API calls
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);

// Check network tab for failed requests
// Verify CORS configuration
```

#### 2. State Management Issues
```typescript
// Add debug logging to useEffect
useEffect(() => {
  console.log('Component mounted, loading data...');
  loadData().then(() => {
    console.log('Data loaded successfully');
  });
}, []);
```

#### 3. Build Issues
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## 📱 Responsive Design

### Breakpoint Strategy
```css
/* Mobile First */
.container {
  @apply px-4;     /* Mobile: 16px padding */
}

@screen sm {       /* 640px+ */
  .container {
    @apply px-6;   /* Small: 24px padding */
  }
}

@screen md {       /* 768px+ */
  .container {
    @apply px-8;   /* Medium: 32px padding */
  }
}

@screen lg {       /* 1024px+ */
  .container {
    @apply px-12;  /* Large: 48px padding */
  }
}
```

### Component Responsiveness
```typescript
// Responsive grid example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <div key={item.id} className="bg-gray-800 rounded-lg p-6">
      {/* Item content */}
    </div>
  ))}
</div>
```

## 🔒 Security Considerations

### Input Validation
```typescript
// Sanitize user input
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

### XSS Prevention
```typescript
// Safe HTML rendering
import DOMPurify from 'dompurify';

const safeHTML = DOMPurify.sanitize(userContent);
```

### API Security
- HTTPS-only communication
- No sensitive data in frontend code
- Proper error handling without exposing internal details

## 📈 Analytics & Monitoring

### Performance Monitoring
```typescript
// Performance measurement
const startTime = performance.now();

// After operation
const endTime = performance.now();
console.log(`Operation took ${endTime - startTime} milliseconds`);
```

### Error Tracking
```typescript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to monitoring service
});

// React error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error:', error, errorInfo);
  }
}
```

## 🚀 Production Considerations

### Build Optimization
- Tree shaking for smaller bundles
- Code splitting for faster initial loads
- Asset optimization (images, fonts)
- Gzip compression via CloudFront

### Caching Strategy
- Static assets: Long-term caching
- HTML files: No cache for updates
- API responses: Fresh data always

### Deployment Checklist
- [ ] API URLs updated for production
- [ ] Error handling for network failures
- [ ] Loading states for all async operations
- [ ] Responsive design tested on all devices
- [ ] Performance optimized (bundle size, loading speed)
- [ ] Accessibility verified
- [ ] SEO metadata included

---

**Frontend Documentation Version**: 1.0.0  
**Last Updated**: August 14, 2025  
**Framework**: React 19 + TypeScript + Vite

// API Configuration
// Use production URL since backend is deployed to AWS
const API_BASE_URL = 'https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
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

  // Articles
  async getArticles() {
    return this.request('/articles');
  }

  async getArticle(id: string) {
    return this.request(`/articles/${id}`);
  }

  async createArticle(article: any) {
    return this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(id: string, article: any) {
    return this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
  }

  async deleteArticle(id: string) {
    return this.request(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Books
  async getBooks() {
    return this.request('/books');
  }

  async createBook(book: any) {
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  }

  async updateBook(id: string, book: any) {
    return this.request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(book),
    });
  }

  async deleteBook(id: string) {
    return this.request(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  // Locations
  async getLocations() {
    return this.request('/locations');
  }

  async createLocation(location: any) {
    return this.request('/locations', {
      method: 'POST',
      body: JSON.stringify(location),
    });
  }

  async updateLocation(id: string, location: any) {
    return this.request(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(location),
    });
  }

  async deleteLocation(id: string) {
    return this.request(`/locations/${id}`, {
      method: 'DELETE',
    });
  }

  // Comments
  async getComments(articleId: string) {
    return this.request(`/comments/article/${articleId}`);
  }

  async createComment(articleId: string, comment: any) {
    return this.request(`/comments/article/${articleId}`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  // Projects
  async getProjects() {
    return this.request('/projects');
  }

  async createProject(project: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, project: any) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Skills
  async getSkills() {
    console.log('🌐 API Service: Calling getSkills from:', `${this.baseUrl}/skills`);
    const result = await this.request('/skills');
    console.log('📡 API Service: getSkills result:', result);
    return result;
  }

  async createSkill(skill: any) {
    return this.request('/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    });
  }

  async updateSkill(id: string, skill: any) {
    return this.request(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(skill),
    });
  }

  async deleteSkill(id: string) {
    return this.request(`/skills/${id}`, {
      method: 'DELETE',
    });
  }

  // Experiences
  async getExperiences() {
    return this.request('/experiences');
  }

  async createExperience(experience: any) {
    return this.request('/experiences', {
      method: 'POST',
      body: JSON.stringify(experience),
    });
  }

  async updateExperience(id: string, experience: any) {
    return this.request(`/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(experience),
    });
  }

  async deleteExperience(id: string) {
    return this.request(`/experiences/${id}`, {
      method: 'DELETE',
    });
  }

  // Auth
  async login(username: string, password: string) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async changeCredentials(credentials: {
    currentUsername: string;
    currentPassword: string;
    newUsername: string;
    newPassword: string;
  }) {
    return this.request('/admin/change-credentials', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
}

export const apiService = new ApiService();
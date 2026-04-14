const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new Error(error.message || `Erreur ${res.status}`);
    }

    return res.json();
  }

  // Auth
  async register(data: { email: string; password: string; firstName: string; lastName: string }) {
    return this.request<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User
  async getMe() {
    return this.request<any>('/api/user/me');
  }

  async getProfile() {
    return this.request<any>('/api/user/profile');
  }

  async createProfile(data: any) {
    return this.request<any>('/api/user/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Recipes
  async getRecipes(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<any>(`/api/recipes${query}`);
  }

  async getRecipe(id: string) {
    return this.request<any>(`/api/recipes/${id}`);
  }

  async getRecommendations(mealType?: string) {
    const query = mealType ? `?mealType=${mealType}` : '';
    return this.request<any>(`/api/recipes/recommendations${query}`);
  }

  async toggleFavorite(recipeId: string) {
    return this.request<any>(`/api/recipes/${recipeId}/favorite`, { method: 'POST' });
  }

  async getFavorites() {
    return this.request<any>('/api/recipes/favorites');
  }

  // Shopping
  async getShoppingList() {
    return this.request<any>('/api/shopping');
  }

  async addRecipeToCart(recipeId: string, servings?: number) {
    const query = servings ? `?servings=${servings}` : '';
    return this.request<any>(`/api/shopping/add-recipe/${recipeId}${query}`, { method: 'POST' });
  }

  async toggleShoppingItem(itemId: string) {
    return this.request<any>(`/api/shopping/toggle/${itemId}`, { method: 'POST' });
  }

  async removeShoppingItem(itemId: string) {
    return this.request<any>(`/api/shopping/item/${itemId}`, { method: 'DELETE' });
  }

  async clearShoppingList() {
    return this.request<any>('/api/shopping/clear', { method: 'DELETE' });
  }

  async getDriveCart() {
    return this.request<any>('/api/shopping/drive-cart');
  }

  // Tracking
  async logMeal(data: { recipeId: string; mealType: string; servings?: number }) {
    return this.request<any>('/api/tracking/log', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDailyDashboard(date?: string) {
    const query = date ? `?date=${date}` : '';
    return this.request<any>(`/api/tracking/daily${query}`);
  }

  async getWeeklyDashboard() {
    return this.request<any>('/api/tracking/weekly');
  }

  async deleteMealLog(logId: string) {
    return this.request<any>(`/api/tracking/log/${logId}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

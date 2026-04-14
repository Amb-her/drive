import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://localhost:3001';

class ApiClient {
  private token: string | null = null;

  async init() {
    this.token = await SecureStore.getItemAsync('token');
  }

  async setToken(token: string) {
    this.token = token;
    await SecureStore.setItemAsync('token', token);
  }

  async clearToken() {
    this.token = null;
    await SecureStore.deleteItemAsync('token');
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new Error(error.message || `Erreur ${res.status}`);
    }

    return res.json();
  }

  // Auth
  register(data: { email: string; password: string; firstName: string; lastName: string }) {
    return this.request<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST', body: JSON.stringify(data),
    });
  }

  login(data: { email: string; password: string }) {
    return this.request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST', body: JSON.stringify(data),
    });
  }

  // User
  getMe() { return this.request<any>('/api/user/me'); }
  getProfile() { return this.request<any>('/api/user/profile'); }
  createProfile(data: any) {
    return this.request<any>('/api/user/profile', { method: 'POST', body: JSON.stringify(data) });
  }

  // Recipes
  getRecipes(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<any>(`/api/recipes${query}`);
  }
  getRecommendations(mealType?: string) {
    const query = mealType ? `?mealType=${mealType}` : '';
    return this.request<any>(`/api/recipes/recommendations${query}`);
  }
  toggleFavorite(id: string) {
    return this.request<any>(`/api/recipes/${id}/favorite`, { method: 'POST' });
  }

  // Shopping
  getShoppingList() { return this.request<any>('/api/shopping'); }
  addRecipeToCart(id: string, servings?: number) {
    const q = servings ? `?servings=${servings}` : '';
    return this.request<any>(`/api/shopping/add-recipe/${id}${q}`, { method: 'POST' });
  }
  toggleShoppingItem(id: string) {
    return this.request<any>(`/api/shopping/toggle/${id}`, { method: 'POST' });
  }
  removeShoppingItem(id: string) {
    return this.request<any>(`/api/shopping/item/${id}`, { method: 'DELETE' });
  }
  clearShoppingList() {
    return this.request<any>('/api/shopping/clear', { method: 'DELETE' });
  }

  // Tracking
  logMeal(data: { recipeId: string; mealType: string; servings?: number }) {
    return this.request<any>('/api/tracking/log', { method: 'POST', body: JSON.stringify(data) });
  }
  getDailyDashboard(date?: string) {
    const q = date ? `?date=${date}` : '';
    return this.request<any>(`/api/tracking/daily${q}`);
  }
  getWeeklyDashboard() { return this.request<any>('/api/tracking/weekly'); }
}

export const api = new ApiClient();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('aiblty_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('aiblty_token', token);
    } else {
      localStorage.removeItem('aiblty_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // Auth
  async register(email: string, password: string, name?: string) {
    const data = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    if (data.data?.accessToken) {
      this.setToken(data.data.accessToken);
    }
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.data?.accessToken) {
      this.setToken(data.data.accessToken);
    }
    return data;
  }

  async logout() {
    this.setToken(null);
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // Projects
  async getProjects(page = 1) {
    return this.request<any>(`/projects?page=${page}`);
  }

  async createProject(title: string, description?: string) {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  async getProject(id: string) {
    return this.request<any>(`/projects/${id}`);
  }

  // Sessions
  async getSessions(projectId: string) {
    return this.request<any>(`/sessions/project/${projectId}`);
  }

  async createSession(projectId: string, type: string) {
    return this.request<any>(`/sessions/project/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  async getSession(id: string) {
    return this.request<any>(`/sessions/${id}`);
  }

  // Messages
  async getMessages(sessionId: string) {
    return this.request<any>(`/messages/session/${sessionId}`);
  }

  async createMessage(sessionId: string, role: string, content: string) {
    return this.request<any>('/messages', {
      method: 'POST',
      body: JSON.stringify({ sessionId, role, content }),
    });
  }

  // AI
  ai = {
    solveProblem: (projectId: string, prompt: string) =>
      this.request<any>('/ai/solve', {
        method: 'POST',
        body: JSON.stringify({ projectId, prompt }),
      }),
    buildBusiness: (projectId: string, prompt: string) =>
      this.request<any>('/ai/build', {
        method: 'POST',
        body: JSON.stringify({ projectId, prompt }),
      }),
  };

  async chat(sessionId: string, prompt: string) {
    return this.request<any>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ sessionId, prompt }),
    });
  }

  // Billing
  async createCheckout(plan: 'starter' | 'pro' | 'elite') {
    return this.request<any>('/billing/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  }

  async getSubscription() {
    return this.request<any>('/billing/subscription');
  }

  async getPayments(page = 1) {
    return this.request<any>(`/billing/payments?page=${page}`);
  }

  async getBillingPortal() {
    return this.request<any>('/billing/stripe/portal', {
      method: 'POST',
    });
  }

  async cancelSubscription() {
    return this.request<any>('/billing/subscription/cancel', {
      method: 'POST',
    });
  }

  // Admin
  admin = {
    getUsers: (page = 1) => this.request<any>(`/admin/users?page=${page}`),
    getStats: () => this.request<any>('/admin/stats'),
    getPayments: (page = 1) => this.request<any>(`/admin/payments?page=${page}`),
    getDeployments: (page = 1) => this.request<any>(`/admin/deployments?page=${page}`),
    updateUserRole: (userId: string, role: string) =>
      this.request<any>(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
    updateUserPlan: (userId: string, plan: string) =>
      this.request<any>(`/admin/users/${userId}/plan`, {
        method: 'PATCH',
        body: JSON.stringify({ plan }),
      }),
  };

  // Deploy
  async triggerDeployment(target = 'vps') {
    return this.request<any>('/deploy/trigger', {
      method: 'POST',
      body: JSON.stringify({ target }),
    });
  }
}

export const api = new ApiClient();
export default api;

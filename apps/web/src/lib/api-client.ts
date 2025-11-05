/**
 * API Client Base Service
 * 
 * Handles all HTTP requests to the NestJS backend API
 * Includes authentication token management
 */

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: number | string;
    message: string;
    timestamp?: string;
    path?: string;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Get authentication token from Supabase session
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      // Import supabase client dynamically to avoid circular dependencies
      const { supabase } = await import('./supabase');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Failed to get session:', error);
        return null;
      }
      
      if (!session?.access_token) {
        console.warn('No access token in session');
        return null;
      }
      
      console.log('✅ Token retrieved:', session.access_token.substring(0, 20) + '...');
      return session.access_token;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  /**
   * Build headers with authentication
   */
  private async buildHeaders(customHeaders?: HeadersInit): Promise<HeadersInit> {
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('📤 Sending request with Authorization header');
    } else {
      console.warn('⚠️ No token available - request will fail if endpoint requires auth');
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got ${contentType}: ${text}`);
    }

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = data;
      throw new Error(error.error?.message || `API Error: ${response.statusText}`);
    }

    return data as ApiResponse<T>;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.buildHeaders(options?.headers);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      ...options,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.buildHeaders(options?.headers);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.buildHeaders(options?.headers);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.buildHeaders(options?.headers);

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      ...options,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();


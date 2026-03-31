const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: any = {
      ...fetchOptions.headers,
    };

    // Only set Content-Type if not FormData
    if (!(fetchOptions.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // Handle empty responses (e.g., 204 No Content)
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      // Try to parse error as JSON, but handle non-JSON error responses
      let errorMessage = response.statusText;
      if (isJson && contentLength !== '0') {
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || JSON.stringify(error);
        } catch {
          // If JSON parsing fails, use status text
        }
      } else {
        // Try to get text response for non-JSON errors
        try {
          const text = await response.text();
          if (text) errorMessage = text;
        } catch {
          // If text parsing fails, use status text
        }
      }
      throw new Error(errorMessage || `HTTP ${response.status}`);
    }

    // Handle successful responses
    if (contentLength === '0' || response.status === 204) {
      return {} as T;
    }

    // If expecting JSON but content-type isn't JSON, or content is empty
    if (!isJson) {
      const text = await response.text();
      if (!text) {
        return {} as T;
      }
      // Try to parse as JSON anyway (some APIs don't set proper headers)
      try {
        return JSON.parse(text) as T;
      } catch {
        // Return text wrapped if it can't be parsed as JSON
        return text as unknown as T;
      }
    }

    return response.json();
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', token });
  }

  async post<T>(endpoint: string, data?: any, token?: string, options: Partial<RequestOptions> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
      token,
      ...options,
    });
  }

  async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async patch<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', token });
  }

  async getBlob(endpoint: string, token?: string): Promise<Blob> {
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blob');
    }

    return response.blob();
  }

  async upload<T>(
    endpoint: string,
    file: File,
    token?: string
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }
}

export const api = new ApiClient(API_URL);

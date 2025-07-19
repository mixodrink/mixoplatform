// src/api/axiosController.ts

import axios from 'axios';
import { AuthToken, Drink, User } from 'models/models';

// Simple error types for better handling
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class AxiosController {
  private instance: ReturnType<typeof axios.create>;

  constructor(baseURL: string, config?: any) {
    this.instance = axios.create({
      baseURL,
      ...config,
    });

    this.instance.interceptors.request.use(
      (request: any) => {
        return request;
      },
      (error: any) => {
        console.error('Request error:', error);
        return Promise.reject(this.handleError(error));
      }
    );

    this.instance.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        console.error('Response error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  // Simple error handler
  private handleError(error: any): ApiError {
    // Network error (no internet, server down, etc.)
    if (!error.response) {
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR'
      };
    }

    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.message || 'Something went wrong';

    switch (status) {
      case 400:
        return { message: 'Invalid request. Please check your data.', status, code: 'BAD_REQUEST' };
      case 401:
        return { message: 'Unauthorized. Please login again.', status, code: 'UNAUTHORIZED' };
      case 403:
        return { message: 'Access forbidden.', status, code: 'FORBIDDEN' };
      case 404:
        return { message: 'Resource not found.', status, code: 'NOT_FOUND' };
      case 500:
        return { message: 'Server error. Please try again later.', status, code: 'SERVER_ERROR' };
      default:
        return { message, status, code: 'UNKNOWN_ERROR' };
    }
  }

  public async get<T = any>(
    url: string,
    config?: any
  ): Promise<{ data: T | null; error: ApiError | null }> {
    try {
      const response = await this.instance.get<T>(url, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error as ApiError };
    }
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<{ data: T | null; error: ApiError | null }> {
    try {
      const response = await this.instance.post<T>(url, data, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error as ApiError };
    }
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<{ data: T | null; error: ApiError | null }> {
    try {
      const response = await this.instance.put<T>(url, data, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error as ApiError };
    }
  }

  public async delete<T = any>(
    url: string,
    config?: any
  ): Promise<{ data: T | null; error: ApiError | null }> {
    try {
      const response = await this.instance.delete<T>(url, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error as ApiError };
    }
  }
}

const baseURL = 'http://localhost:3000';
const api = new AxiosController(baseURL);

// Simple utility to show user-friendly error messages
export const showErrorMessage = (error: ApiError): string => {
  return error.message || 'Something went wrong. Please try again.';
};

// Simple utility to check if error is network related
export const isNetworkError = (error: ApiError): boolean => {
  return error.code === 'NETWORK_ERROR';
};

// Simple utility to check if user needs to login again
export const isAuthError = (error: ApiError): boolean => {
  return error.code === 'UNAUTHORIZED';
};

export default api;

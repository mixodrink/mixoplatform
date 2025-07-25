import { useAuthStore } from '../store/AuthStore';
import { 
  postActionCloudLoginConstructor, 
  postActionCloudRefreshTokenConstructor,
  PostEC2CloudLogin,
  PostEC2CloudLRefreshToken 
} from '../api/cloud/api-cloud';

export class AutoLoginService {
  private static instance: AutoLoginService;
  private authStore = useAuthStore.getState();

  private constructor() {}

  static getInstance(): AutoLoginService {
    if (!AutoLoginService.instance) {
      AutoLoginService.instance = new AutoLoginService();
    }
    return AutoLoginService.instance;
  }

  /**
   * Attempts to login automatically using credentials from environment variables
   */
  async autoLogin(): Promise<boolean> {
    try {
      this.authStore.setLoading(true);
      this.authStore.setError(null);

      // Get credentials from environment
      const email = import.meta.env.VITE_CLOUD_LOGIN_EMAIL;
      const password = import.meta.env.VITE_CLOUD_LOGIN_PASSWORD;

      if (!email || !password) {
        throw new Error('Login credentials not found in environment variables');
      }

      console.log('Attempting auto-login for:', email);

      // Attempt login
      const loginData: PostEC2CloudLogin = {
        email,
        password,
      };

      const response = await postActionCloudLoginConstructor(loginData);

      if (response.accessToken && response.refreshToken) {
        // Store tokens
        this.authStore.setTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });

        console.log('Auto-login successful');
        return true;
      } else {
        throw new Error('Login response missing tokens');
      }
    } catch (error: any) {
      console.error('Auto-login failed:', error);
      this.authStore.setError(error.message || 'Auto-login failed');
      this.authStore.clearTokens();
      return false;
    } finally {
      this.authStore.setLoading(false);
    }
  }

  /**
   * Attempts to refresh the access token using the stored refresh token
   */
  async refreshAccessToken(): Promise<boolean> {
    try {
      const currentState = useAuthStore.getState();
      
      if (!currentState.refreshToken) {
        throw new Error('No refresh token available');
      }

      const email = import.meta.env.VITE_CLOUD_LOGIN_EMAIL;
      if (!email) {
        throw new Error('Email not found in environment variables');
      }

      console.log('Attempting token refresh...');

      const refreshData: PostEC2CloudLRefreshToken = {
        email,
        refreshToken: currentState.refreshToken,
        accessToken: currentState.accessToken || undefined,
      };

      const response = await postActionCloudRefreshTokenConstructor(refreshData);

      if (response.accessToken) {
        // Update tokens
        this.authStore.setTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || currentState.refreshToken,
        });

        console.log('Token refresh successful');
        return true;
      } else {
        throw new Error('Token refresh response missing access token');
      }
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      // If refresh fails, try auto-login again
      return await this.autoLogin();
    }
  }

  /**
   * Ensures user is authenticated, attempting auto-login or token refresh as needed
   */
  async ensureAuthenticated(): Promise<boolean> {
    const currentState = useAuthStore.getState();

    // If already authenticated with valid token, return true
    if (currentState.isAuthenticated && currentState.accessToken) {
      return true;
    }

    // If we have a refresh token, try to refresh
    if (currentState.refreshToken) {
      const refreshSuccess = await this.refreshAccessToken();
      if (refreshSuccess) {
        return true;
      }
    }

    // Otherwise, attempt auto-login
    return await this.autoLogin();
  }

  /**
   * Get the current access token, ensuring authentication first
   */
  async getValidAccessToken(): Promise<string | null> {
    const isAuthenticated = await this.ensureAuthenticated();
    if (isAuthenticated) {
      return useAuthStore.getState().accessToken;
    }
    return null;
  }
}

// Export singleton instance
export const autoLoginService = AutoLoginService.getInstance();

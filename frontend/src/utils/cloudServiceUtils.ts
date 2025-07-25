import { postActionCloudServiceConstructor, PostServiceEC2Cloud } from '../api/cloud/api-cloud';
import { autoLoginService } from '../services/AutoLoginService';

/**
 * Utility functions for making authenticated API calls to cloud services
 */
export class CloudServiceUtils {
  /**
   * Creates a service in the cloud with automatic authentication
   * @param serviceData - The service data to create
   * @returns Promise<PostServiceEC2Cloud>
   */
  static async createService(serviceData: PostServiceEC2Cloud): Promise<PostServiceEC2Cloud> {
    try {
      // This will automatically handle authentication
      return await postActionCloudServiceConstructor(serviceData);
    } catch (error: any) {
      console.error('Failed to create cloud service:', error);
      throw error;
    }
  }

  /**
   * Gets the current authentication status
   * @returns boolean indicating if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    return await autoLoginService.ensureAuthenticated();
  }

  /**
   * Forces a re-authentication attempt
   * @returns boolean indicating if authentication was successful
   */
  static async forceReAuthentication(): Promise<boolean> {
    return await autoLoginService.autoLogin();
  }

  /**
   * Gets a valid access token
   * @returns string | null - The access token or null if not authenticated
   */
  static async getAccessToken(): Promise<string | null> {
    return await autoLoginService.getValidAccessToken();
  }
}

// Export individual functions for convenience
export const createCloudService = CloudServiceUtils.createService;
export const isCloudAuthenticated = CloudServiceUtils.isAuthenticated;
export const forceCloudReAuthentication = CloudServiceUtils.forceReAuthentication;
export const getCloudAccessToken = CloudServiceUtils.getAccessToken;

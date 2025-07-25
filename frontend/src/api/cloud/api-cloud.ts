import axios, { AxiosInstance, AxiosResponse } from 'axios';

/* 
 AWS Cloud actions section of the code
*/

/** 
 * Post Service to AWS Cloud
 * @param {PostServiceEC2Cloud} data - Data to post to AWS Cloud
 * @returns {Promise<PostServiceEC2Cloud>} - Response from AWS Cloud
**/
const instanceCloudCreateService: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_EXPRESS_PROD_ENDPOINT + '/service/createService',
});

export interface PostServiceEC2Cloud {
  machineId: string,
  type: string,
  alcohol?: string,
  bib?: string,
  price: number
  paymentType: string,
  cardId: string,
  cardNumber: string,
  sessions: number,
}

export const postActionCloudServiceConstructor = async (data: PostServiceEC2Cloud, authToken?: string): Promise<PostServiceEC2Cloud> => {
  try {
    // If no token provided, try to get it from the auto-login service
    let token = authToken;
    if (!token) {
      const { autoLoginService } = await import('../../services/AutoLoginService');
      const validToken = await autoLoginService.getValidAccessToken();
      
      if (!validToken) {
        throw new Error('No valid access token available. Authentication required.');
      }
      token = validToken;
    }

    const response: AxiosResponse<PostServiceEC2Cloud> = await instanceCloudCreateService.post('/', data, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};


/* 
 AWS Cloud actions section of the code
*/

/** 
 * Post Login to AWS Cloud
 * @param {PostEC2CloudLogin} data - Data to post to AWS Cloud
 * @returns {Promise<PostEC2CloudLogin>} - Response from AWS Cloud
**/

const instanceCloudLogin: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_EXPRESS_PROD_ENDPOINT + '/auth/login',
});

export interface PostEC2CloudLogin {
  email: string,
  password: string,
}

export interface PostEC2CloudLoginResponse {
  foundUser: { email: string },
  accessToken?: string,
  refreshToken?: string,
}

export const postActionCloudLoginConstructor = async (data: PostEC2CloudLogin): Promise<PostEC2CloudLoginResponse> => {
  try {
    const response: AxiosResponse<PostEC2CloudLoginResponse> = await instanceCloudLogin.post('/', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

/** 
 * Post Refresh Token to AWS Cloud
 * @param {PostEC2CloudLogin} data - Data to post to AWS Cloud
 * @returns {Promise<PostEC2CloudLogin>} - Response from AWS Cloud
**/

const instanceCloudRefreshToken: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_EXPRESS_PROD_ENDPOINT + '/auth/refresh',
});

export interface PostEC2CloudLRefreshToken {
  email: string,
  refreshToken: string,
  accessToken?: string | undefined,
}

export const postActionCloudRefreshTokenConstructor = async (data: PostEC2CloudLRefreshToken): Promise<PostEC2CloudLRefreshToken> => {
  try {
    const response: AxiosResponse<PostEC2CloudLRefreshToken> = await instanceCloudRefreshToken.post('/', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
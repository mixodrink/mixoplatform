// src/api/axiosController.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthToken, DrinkModel, User } from 'models';

class AxiosController {
  private instance: AxiosInstance;

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.instance = axios.create({
      baseURL,
      ...config,
    });

    this.instance.interceptors.request.use(
      (request) => {
        return request;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public get<T = AuthToken | User>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public post<T = DrinkModel | User>(
    url: string,
    data?: DrinkModel | User,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }
}

const baseURL = 'http://localhost:3000';
const api = new AxiosController(baseURL);

export default api;

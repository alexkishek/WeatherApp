import apiClient from "../config/axios";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export async function createUser(data: User): Promise<void> {
  try {
    await apiClient.post(`/user`, data);
  } catch (error) {
    throw error;
  }
}

export async function loginUser(data: { email: string; password: string }): Promise<LoginResponse> {
  try {
    const response = await apiClient.post(`/auth/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

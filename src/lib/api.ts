import axios from 'axios';
import { Project, Message } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const projectApi = {
  list: (userId: string) => api.get<Project[]>('/projects', { headers: { 'x-user-id': userId } }),
  create: (data: Partial<Project>) => api.post<Project>('/projects', data),
  update: (id: string, data: Partial<Project>) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const userApi = {
  getStats: (userId: string) => api.get<any>('/analytics', { headers: { 'x-user-id': userId } }),
};

export const chatApi = {
  send: (messages: Message[], model?: string) => 
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model }),
    }),
};

export const checkoutApi = {
  createSession: (priceId: string, successUrl: string, cancelUrl: string, userId: string) =>
    api.post<{ url: string }>('/checkout', { priceId, successUrl, cancelUrl, userId }),
};

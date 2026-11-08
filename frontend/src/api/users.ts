import { api } from './client';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  tenantId?: string;
  wardNumber?: number;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return Array.isArray(response) ? response : (response as any).data || [];
  },
  
  toggleActive: async (id: string): Promise<User> => {
    const response = await api.patch(`/users/${id}/toggle-active`);
    return (response as any).data || response;
  },
  
  create: async (data: Partial<User> & { password?: string }): Promise<User> => {
    const response = await api.post('/users', data);
    return (response as any).data || response;
  },

  update: async (id: string, data: Partial<User> & { password?: string }): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return (response as any).data || response;
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await api.get('/users/roles');
    return Array.isArray(response) ? response : (response as any).data || [];
  },

  updateRolePermissions: async (name: string, permissions: string[]): Promise<Role> => {
    const response = await api.put(`/users/roles/${name}`, { permissions });
    return (response as any).data || response;
  }
};

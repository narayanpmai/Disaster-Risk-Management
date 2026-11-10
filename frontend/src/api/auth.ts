import { api } from './client';
import type { AuthResponse, User } from '../types/auth';

export const authApi = {
  login: async (email: string, password: string, tenantId?: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
      tenant_subdomain: tenantId || 'panchpokhari',
      tenantId: tenantId || 'panchpokhari',
    });
    if (res.accessToken) {
      localStorage.setItem('p5_token', res.accessToken);
      localStorage.setItem('p5_user', JSON.stringify(res.user));
      localStorage.setItem('p5_role', res.user.role || 'admin');
      localStorage.setItem('p5_email', res.user.email || '');
      localStorage.setItem('p5_name', res.user.fullName || '');
      
      // Automatically set tenant from user's actual account tenant
      const effectiveTenant = res.tenantSubdomain || (tenantId && tenantId !== 'all' ? tenantId : 'panchpokhari');
      if (effectiveTenant) {
        localStorage.setItem('tenant_id', effectiveTenant);
      } else {
        localStorage.removeItem('tenant_id');
      }
    }
    return res;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('p5_token');
      localStorage.removeItem('p5_user');
      localStorage.removeItem('tenant_id');
    }
  },

  getProfile: async (): Promise<User> => {
    return await api.get<User>('/auth/profile');
  },
};


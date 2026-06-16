import { api } from '../../../lib/api';
import type { Admin, CriarAdminPayload } from '../types/adminTypes';

export const adminService = {
  async criarAdmin(payload: CriarAdminPayload) {
    const response = await api.post<Admin>('/admins', payload);
    return response.data;
  },
};

import { api } from './api';
import { Admission } from '../types';

export const admissionsApi = {
    async getNextNumbers(token?: string) {
        return api.get<{ formNumber: string; enrollmentNumber: string }>('/admissions/next-numbers', token);
    },

    async submitAdmission(formData: FormData, token?: string) {
        return api.post<Admission>('/admissions', formData, token);
    },

    async getMyAdmission(token?: string) {
        return api.get<Admission>('/admissions/me', token);
    },

    async getAllAdmissions(token?: string) {
        return api.get<Admission[]>('/admissions', token);
    },

    async approveAdmission(id: string, token?: string) {
        return api.patch<Admission>(`/admissions/${id}/approve`, {}, token);
    }
};

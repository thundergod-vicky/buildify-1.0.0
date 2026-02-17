import { api } from './api';
import { auth } from './auth';

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    teacher: {
      name: string;
    };
    _count: {
      chapters: number;
    }
  };
}

const enrollmentsApi = {
  enroll: (courseId: string) => {
    const token = auth.getToken();
    return api.post<Enrollment>('/enrollments', { courseId }, token || undefined);
  },

  withdraw: (courseId: string) => {
    const token = auth.getToken();
    return api.delete<{ success: boolean }>(`/enrollments/${courseId}`, token || undefined);
  },

  getMyCourses: () => {
    const token = auth.getToken();
    return api.get<Enrollment[]>('/enrollments', token || undefined);
  },

  checkEnrollment: (courseId: string) => {
    const token = auth.getToken();
    return api.get<{ enrolled: boolean }>(`/enrollments/${courseId}/check`, token || undefined);
  }
};

export default enrollmentsApi;

import { api } from './api';
import { Course, Chapter, Lesson } from '@/types';
import { auth } from './auth';

export const coursesApi = {
  getAll: () => api.get<Course[]>('/courses', auth.getToken() || undefined),
  getByTeacher: () => api.get<Course[]>('/courses/teacher', auth.getToken() || undefined),
  getById: (id: string) => api.get<Course>(`/courses/${id}`, auth.getToken() || undefined),
  create: (data: Partial<Course>) => api.post<Course>('/courses', data, auth.getToken() || undefined),
  
  createChapter: (courseId: string, data: Partial<Chapter>) => 
    api.post<Chapter>(`/courses/${courseId}/chapters`, data, auth.getToken() || undefined),
    
  uploadMedia: (formData: FormData) => {
    const token = auth.getToken();
    return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/content/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    }).then(res => res.json());
  },

  createLesson: (chapterId: string, data: any) => 
      api.post<Lesson>(`/courses/chapters/${chapterId}/lessons`, data, auth.getToken() || undefined)
};

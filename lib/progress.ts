import { api } from './api';
import { auth } from './auth';

export interface LessonProgress {
  id: string;
  studentId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
}

const progressApi = {
  markAsComplete: (lessonId: string) => {
    const token = auth.getToken();
    return api.post<LessonProgress>(`/progress/complete/${lessonId}`, {}, token || undefined);
  },

  getCourseProgress: (courseId: string) => {
    const token = auth.getToken();
    return api.get<LessonProgress[]>(`/progress/course/${courseId}`, token || undefined);
  }
};

export default progressApi;

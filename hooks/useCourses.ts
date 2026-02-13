import { useState, useEffect } from 'react';
import { Course } from '@/types';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = auth.getToken();
      const data = await api.get<Course[]>('/courses', token || undefined);
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const getCourseById = async (id: string): Promise<Course | null> => {
    try {
      const token = auth.getToken();
      return await api.get<Course>(`/courses/${id}`, token || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course');
      return null;
    }
  };

  const enrollInCourse = async (courseId: string): Promise<boolean> => {
    try {
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');
      
      await api.post(`/courses/${courseId}/enroll`, {}, token);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll');
      return false;
    }
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    getCourseById,
    enrollInCourse,
  };
}

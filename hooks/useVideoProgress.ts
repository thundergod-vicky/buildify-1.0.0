import { useState, useEffect, useCallback } from 'react';
import { StudentProgress } from '@/types';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';

export function useVideoProgress(lessonId: string) {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [lessonId]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const token = auth.getToken();
      if (!token) return;

      const data = await api.get<StudentProgress>(
        `/progress/lesson/${lessonId}`,
        token
      );
      setProgress(data);
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = useCallback(
    async (watchedDuration: number, completed: boolean = false) => {
      try {
        const token = auth.getToken();
        if (!token) return;

        const data = await api.post<StudentProgress>(
          `/progress/lesson/${lessonId}`,
          { watchedDuration, completed },
          token
        );
        setProgress(data);
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    },
    [lessonId]
  );

  return {
    progress,
    loading,
    updateProgress,
    fetchProgress,
  };
}

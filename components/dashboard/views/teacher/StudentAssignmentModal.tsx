'use client';

import { useState, useEffect } from 'react';
import { XIcon, Loader2Icon, UserPlusIcon, CalendarIcon, TrashIcon } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { auth } from '@/lib/auth';
import { api } from '@/lib/api';

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Assignment {
  id: string;
  studentId: string;
  deadline: string | null;
  assignedAt: string;
  student: Student;
}

interface StudentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

export function StudentAssignmentModal({ isOpen, onClose, courseId, courseTitle }: StudentAssignmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        setIsFetching(true);
        await Promise.all([fetchStudents(), fetchAssignments()]);
        setIsFetching(false);
      };
      loadData();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      const token = auth.getToken();
      if (!token) throw new Error('No authentication token found');
      
      const data = await api.get<Student[]>('/users/students', token);
      
      if (Array.isArray(data)) setStudents(data);
      else setStudents([]);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setStudents([]);
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = auth.getToken();
      if (!token) return; // Silent fail or handle error
      
      const data = await api.get<Assignment[]>(`/courses/${courseId}/assignments`, token);
      
      if (Array.isArray(data)) setAssignments(data);
      else setAssignments([]);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      setAssignments([]);
    }
  };

  const handleAssign = async () => {
    if (selectedStudents.length === 0) {
      showToast.error('Please select at least one student');
      return;
    }

    setIsLoading(true);
    try {
      const token = auth.getToken();
      if (!token) {
          showToast.error('Authentication required');
          return;
      }

      await api.post(`/courses/${courseId}/assign`, {
          studentIds: selectedStudents,
          deadline: deadline || undefined
      }, token);

      showToast.success(`Assigned ${selectedStudents.length} student(s) successfully`);
      setSelectedStudents([]);
      setDeadline('');
      fetchAssignments();
    } catch (error) {
      console.error('Failed to assign students:', error);
      showToast.error('Failed to assign students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (studentId: string) => {
    try {
      const token = auth.getToken();
      if (!token) return;

      await api.delete(`/courses/${courseId}/assign/${studentId}`, token);

      showToast.success('Assignment removed');
      fetchAssignments();
    } catch (error) {
      console.error('Failed to remove assignment:', error);
      showToast.error('Failed to remove assignment');
    }
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAll = () => {
    const unassignedStudents = students.filter(
      s => !assignments.some(a => a.studentId === s.id)
    );
    if (selectedStudents.length === unassignedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(unassignedStudents.map(s => s.id));
    }
  };

  if (!isOpen) return null;

  const unassignedStudents = students.filter(
    s => !assignments.some(a => a.studentId === s.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Assign Students</h2>
            <p className="text-sm text-gray-500 mt-1">{courseTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XIcon className="size-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isFetching ? (
            <div className="space-y-4">
              {/* Skeleton Loader */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
              <div className="space-y-2 pt-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Currently Assigned Students */}
              {assignments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Currently Assigned ({assignments.length})</h3>
                  <div className="space-y-2">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{assignment.student.name}</p>
                          <p className="text-sm text-gray-500">{assignment.student.email}</p>
                          {assignment.deadline && (
                            <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                              <CalendarIcon className="size-3" />
                              Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(assignment.studentId)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assign New Students */}
              {unassignedStudents.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Available Students ({unassignedStudents.length})</h3>
                    <button
                      onClick={toggleAll}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {selectedStudents.length === unassignedStudents.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {unassignedStudents.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudent(student.id)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="size-4" />
                      Completion Deadline (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {assignments.length > 0 ? 'All students have been assigned' : 'No students available'}
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
          >
            Close
          </button>
          {!isFetching && unassignedStudents.length > 0 && (
            <button
              onClick={handleAssign}
              disabled={isLoading || selectedStudents.length === 0}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : <UserPlusIcon className="size-4" />}
              Assign Selected ({selectedStudents.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

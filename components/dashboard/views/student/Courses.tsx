import React, { useEffect, useState } from 'react';
import { Course } from '@/types';
import { coursesApi } from '@/lib/courses';
import enrollmentsApi, { Enrollment } from '@/lib/enrollments';
import { CourseCard } from './CourseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ClockIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/toast';
import { auth } from '@/lib/auth';

export const StudentCourses = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        coursesApi.getAll(),
        enrollmentsApi.getMyCourses()
      ]);
      setAllCourses(coursesRes);
      setMyEnrollments(enrollmentsRes);
      
      // Fetch assigned courses
      try {
        const token = auth.getToken();
        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/student/all`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            setAssignedCourses(Array.isArray(data.assignedCourses) ? data.assignedCourses : []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch assigned courses", error);
      }
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId: string) => {
      try {
          await enrollmentsApi.enroll(courseId);
          // Refresh data
          fetchData();
      } catch (error) {
          console.error("Enrollment failed", error);
          showToast.error("Failed to enroll. Please try again.");
      }
  };

  const handleWithdraw = async (courseId: string) => {
      try {
          await enrollmentsApi.withdraw(courseId);
          showToast.success("Withdrawn from course successfully");
          fetchData();
      } catch (error) {
          console.error("Withdrawal failed", error);
          showToast.error("Failed to withdraw from course");
      }
  };

  const handleViewCourse = (courseId: string) => {
      // Navigate to player
      router.push(`/player/${courseId}`);
  };

  if (loading) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  // Helper to check enrollment
  const isEnrolled = (courseId: string) => myEnrollments.some(e => e.courseId === courseId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
      </div>

      <Tabs defaultValue="my-courses">
        <TabsList className="mb-6">
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="my-courses">
            {myEnrollments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>You haven&apos;t enrolled in any courses yet.</p>
                    <Button variant="link" onClick={() => document.getElementById('browse-trigger')?.click()}>Browse Courses</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myEnrollments.map(enrollment => (
                        <CourseCard 
                            key={enrollment.id} 
                            course={enrollment.course as Course} 
                            isEnrolled={true}
                            onView={handleViewCourse}
                            onWithdraw={handleWithdraw}
                        />
                    ))}
                </div>
            )}
        </TabsContent>

        <TabsContent value="browse">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map(course => (
                    <CourseCard 
                        key={course.id} 
                        course={course} 
                        isEnrolled={isEnrolled(course.id)}
                        onEnrollRaw={handleEnroll}
                        onView={handleViewCourse}
                        onWithdraw={handleWithdraw}
                    />
                ))}
             </div>
         </TabsContent>

        <TabsContent value="assigned">
          {assignedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="bg-gray-50 p-4 rounded-full">
                <div className="bg-white p-3 rounded-full shadow-sm">
                   <ClockIcon className="size-8 text-indigo-300" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">No Assignments Yet</h3>
                <p className="text-gray-500 max-w-sm">You don&apos;t have any assigned courses at the moment. Check back later!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedCourses.map((assignedCourse: any) => {
                const daysRemaining = assignedCourse.deadline 
                  ? Math.ceil((new Date(assignedCourse.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : null;
                
                // Enhanced urgency colors with borders and backgrounds
                const urgencyStyle = daysRemaining === null 
                  ? 'bg-gray-50 text-gray-600 border-gray-200'
                  : daysRemaining > 7 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : daysRemaining >= 3
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200';

                return (
                  <div 
                    key={assignedCourse.id} 
                    className="group relative bg-white rounded-[2rem] p-1 border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-rose-50/30 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative h-full bg-white/50 backdrop-blur-sm rounded-[1.8rem] p-5 flex flex-col overflow-hidden">
                      {/* Decorative top gradient */}
                      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none" />

                      <div className="relative flex justify-between items-start mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-indigo-600 border border-indigo-100 shadow-sm">
                           <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                          </span>
                          Assigned
                        </span>
                        {assignedCourse.deadline && (
                          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border shadow-sm ${urgencyStyle}`}>
                            <ClockIcon className="size-3.5" />
                            {daysRemaining !== null && daysRemaining > 0 ? `${daysRemaining} days left` : daysRemaining === 0 ? 'Due today' : 'Overdue'}
                          </div>
                        )}
                      </div>
                      
                      <div className="relative space-y-2 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                          {assignedCourse.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-10">
                          {assignedCourse.description || 'No description provided for this course.'}
                        </p>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100/50 relative">
                        {assignedCourse.assignedBy && (
                          <div className="flex items-center gap-2 mb-4">
                             <div className="size-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                               {assignedCourse.assignedBy.name[0]}
                             </div>
                             <p className="text-xs text-gray-500">
                               Assigned by <span className="font-semibold text-gray-700">{assignedCourse.assignedBy.name}</span>
                             </p>
                          </div>
                        )}
                        
                        {isEnrolled(assignedCourse.id) ? (
                          <button
                            onClick={() => handleViewCourse(assignedCourse.id)}
                            className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-[0.98]"
                          >
                            Continue Learning
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnroll(assignedCourse.id)}
                            className="group/btn w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                          >
                            <span>Enroll Now</span>
                            <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

import { Button } from '@/components/ui/button';

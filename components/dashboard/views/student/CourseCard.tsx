import React from 'react';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, User as UserIcon } from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onEnrollRaw?: (courseId: string) => void;
  onView?: (courseId: string) => void;
  onWithdraw?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled, onEnrollRaw, onView, onWithdraw }) => {
  const [loading, setLoading] = React.useState(false);
  const [withdrawing, setWithdrawing] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleEnroll = async () => {
      if (onEnrollRaw) {
          setLoading(true);
          await onEnrollRaw(course.id);
          setLoading(false);
      }
  };

  const handleWithdraw = async (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (onWithdraw) {
          setWithdrawing(true);
          await onWithdraw(course.id);
          setWithdrawing(false);
          setIsModalOpen(false);
      }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      {course.thumbnail && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500 line-clamp-3 mb-4">
          {course.description || "No description available."}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
                <UserIcon size={14} />
                <span>{course.teacher?.name || 'Instructor'}</span>
            </div>
            <div className="flex items-center gap-1">
                <BookOpen size={14} />
                {/* We need chapter count from API, assume it might be there */}
                 <span>{course._count?.chapters || 0} Chapters</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {isEnrolled ? (
          <>
            <Button className="flex-grow" onClick={() => onView && onView(course.id)}>
              Go to Course
            </Button>
            <Button 
              variant="outline" 
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              disabled={withdrawing}
            >
              {withdrawing ? '...' : 'Withdraw'}
            </Button>
          </>
        ) : (
          <Button 
            className="w-full" 
            onClick={handleEnroll} 
            disabled={loading}
          >
            {loading ? 'Enrolling...' : 'Enroll Now'}
          </Button>
        )}
      </CardFooter>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleWithdraw()}
        title="Withdraw from Course"
        message={`Are you sure you want to withdraw from "${course.title}"? Your progress will be saved, but you will lose access until you re-enroll.`}
        confirmText="Withdraw"
        variant="danger"
      />
    </Card>
  );
};

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types";
import { useSearchParams } from "next/navigation";

// Student Views
import { StudentHome } from "@/components/dashboard/views/student/Home";
import { StudentCourses } from "@/components/dashboard/views/student/Courses";
import { StudentTests } from "@/components/dashboard/views/student/Tests";
import { StudentPerformance } from "@/components/dashboard/views/student/Performance";
import { StudentSchedule } from "@/components/dashboard/views/student/Schedule";
import { StudentSettings } from "@/components/dashboard/views/student/Settings";

// Teacher Views
import { TeacherHome } from "@/components/dashboard/views/teacher/Home";
import { TeacherCourses } from "@/components/dashboard/views/teacher/Courses";
import { TeacherTests } from "@/components/dashboard/views/teacher/PracticeTests";
import { TeacherStudentManagement } from "@/components/dashboard/views/teacher/StudentManagement";
import { TeacherSettings } from "@/components/dashboard/views/teacher/Settings";

// Parent Views
import { ParentHome } from "@/components/dashboard/views/parent/Home";
import { ParentSettings } from "@/components/dashboard/views/parent/Settings";
import { ParentPerformance } from "@/components/dashboard/views/parent/Performance";

// Admin Views
import { AdminHome } from "@/components/dashboard/views/admin/Home";
import { AdminSettings } from "@/components/dashboard/views/admin/Settings";
import { AdminUserManagement } from "@/components/dashboard/views/admin/UserManagement";
import { AdminCourseManagement } from "@/components/dashboard/views/admin/CourseManagement";
import { AdminPracticeTestManagement } from "@/components/dashboard/views/admin/PracticeTestManagement";
import { AdminRequests } from "@/components/dashboard/views/admin/Requests";

// Shared Views
import { NotificationsView } from "@/components/dashboard/views/shared/Notifications";

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view");

    if (isLoading) return null;
    if (!user) return null;

    if (user.role === Role.STUDENT) {
        switch (currentView) {
            case 'courses': return <StudentCourses />;
            case 'tests': return <StudentTests />;
            case 'performance': return <StudentPerformance />;
            case 'schedule': return <StudentSchedule />;
            case 'settings': return <StudentSettings />;
            case 'notifications': return <NotificationsView />;
            default: return <StudentHome />;
        }
    }

    if (user.role === Role.TEACHER) {
        switch (currentView) {
            case 'courses': return <TeacherCourses />;
            case 'tests': return <TeacherTests />;
            case 'students': return <TeacherStudentManagement />;
            case 'settings': return <TeacherSettings />;
            case 'notifications': return <NotificationsView />;
            default: return <TeacherHome />;
        }
    }

    if (user.role === Role.PARENT) {
        switch (currentView) {
            case 'performance': return <ParentPerformance />;
            case 'settings': return <ParentSettings />;
            case 'notifications': return <NotificationsView />;
            default: return <ParentHome />;
        }
    }

    if (user.role === Role.ADMIN) {
         switch (currentView) {
            case 'users': return <AdminUserManagement />;
            case 'manage-courses': return <AdminCourseManagement />;
            case 'practice-tests': return <AdminPracticeTestManagement />;
            case 'revenue': return <div className="p-8">Revenue & Payments View (Coming Soon)</div>;
            case 'requests': return <AdminRequests />;
            case 'settings': return <AdminSettings />;
            case 'notifications': return <NotificationsView />;
            default: return <AdminHome />;
        }
    }

    return <div className="p-8">Unknown Role</div>;
}

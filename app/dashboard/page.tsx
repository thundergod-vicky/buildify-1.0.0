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
import { StudentBatches } from "@/components/dashboard/views/student/Batches";

// Teacher Views
import { TeacherHome } from "@/components/dashboard/views/teacher/Home";
import { TeacherCourses } from "@/components/dashboard/views/teacher/Courses";
import { TeacherTests } from "@/components/dashboard/views/teacher/PracticeTests";
import { TeacherStudentManagement } from "@/components/dashboard/views/teacher/StudentManagement";
import { TeacherSettings } from "@/components/dashboard/views/teacher/Settings";
import { TeacherBatches } from "@/components/dashboard/views/teacher/Batches";
import { OmrDashboard } from "@/components/dashboard/views/teacher/omr/OmrDashboard";
import { TeacherSchedule } from "@/components/dashboard/views/teacher/Schedule";

// Parent Views
import { ParentHome } from "@/components/dashboard/views/parent/Home";
import { ParentSettings } from "@/components/dashboard/views/parent/Settings";
import { ParentPerformance } from "@/components/dashboard/views/parent/Performance";

// Admin Views
import { AdminHome } from "@/components/dashboard/views/admin/Home";
import { AdminUserManagement } from "@/components/dashboard/views/admin/UserManagement";
import { AdminCourseManagement } from "@/components/dashboard/views/admin/CourseManagement";
import { AdminPracticeTestManagement } from "@/components/dashboard/views/admin/PracticeTestManagement";
import { AdminRequests } from "@/components/dashboard/views/admin/Requests";
import { AdminBatchManagement } from "@/components/dashboard/views/admin/BatchManagement";

// Academic Views
import { AcademicHome } from "@/components/dashboard/views/academic/Home";
import { ClassRoutine } from "@/components/dashboard/views/academic/Routine";
import { AcademicSchedule } from "@/components/dashboard/views/academic/Schedule";
import { ExamSchedules } from "@/components/dashboard/views/academic/Exams";
import { DoubtAccess } from "@/components/dashboard/views/academic/Doubts";
import { TeacherAccess } from "@/components/dashboard/views/academic/TeacherAccess";

// Accounts Views
import { AccountsHome } from "@/components/dashboard/views/accounts/Home";
import { AccountsRevenue } from "@/components/dashboard/views/accounts/Revenue";
import { StudentDetails } from "@/components/dashboard/views/accounts/StudentDetails";
import { BillingTemplate } from "@/components/dashboard/views/accounts/Billing";

// Shared Views
import { NotificationsView } from "@/components/dashboard/views/shared/Notifications";
import { MessagesView } from "@/components/dashboard/views/shared/Messages";
import { AdminSettings } from "@/components/dashboard/views/admin/Settings";

import { ZoomMeeting } from "@/components/dashboard/views/academic/ZoomMeeting";
import { Suspense } from "react";

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="p-8">Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardContent() {
    const { user, isLoading } = useAuth();
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view");

    console.log("Current View:", currentView);
    console.log("User Role:", user?.role);

    if (isLoading) return <div className="p-8">Syncing user session...</div>;
    if (!user) return <div className="p-8 text-red-500 font-bold underline cursor-pointer" onClick={() => window.location.href='/auth'}>Session expired. Please login again.</div>;

    if (currentView === 'zoom-meeting') {
        return <ZoomMeeting />;
    }

    // Student
    if (user.role === Role.STUDENT) {
        switch (currentView) {
            case 'courses': return <StudentCourses />;
            case 'tests': return <StudentTests />;
            case 'performance': return <StudentPerformance />;
            case 'schedule': return <StudentSchedule />;
            case 'settings': return <StudentSettings />;
            case 'notifications': return <NotificationsView />;
            case 'messages': return <MessagesView />;
            case 'batches': return <StudentBatches />;
            default: return <StudentHome />;
        }
    }

    // Teacher
    if (user.role === Role.TEACHER) {
        switch (currentView) {
            case 'courses': return <TeacherCourses />;
            case 'tests': return <TeacherTests />;
            case 'students': return <TeacherStudentManagement />;
            case 'settings': return <TeacherSettings />;
            case 'notifications': return <NotificationsView />;
            case 'messages': return <MessagesView />;
            case 'batches': return <TeacherBatches />;
            case 'omr': return <OmrDashboard />;
            case 'schedule': return <TeacherSchedule />;
            default: return <TeacherHome />;
        }
    }

    if (user.role === Role.PARENT) {
        switch (currentView) {
            case 'performance': return <ParentPerformance />;
            case 'settings': return <ParentSettings />;
            case 'notifications': return <NotificationsView />;
            case 'messages': return <MessagesView />;
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
            case 'messages': return <MessagesView />;
            case 'manage-batches': return <AdminBatchManagement />;
            default: return <AdminHome />;
        }
    }

    if (user.role === Role.ACADEMIC_OPERATIONS) {
        switch (currentView) {
            case 'routine': return <ClassRoutine />;
            case 'schedule': return <AcademicSchedule />;
            case 'exams': return <ExamSchedules />;
            case 'doubts': return <DoubtAccess />;
            case 'teachers': return <TeacherAccess />;
            case 'students': return <TeacherStudentManagement />;
            case 'manage-batches': return <AdminBatchManagement />;
            case 'settings': return <TeacherSettings />;
            case 'messages': return <MessagesView />;
            case 'omr': return <OmrDashboard />;
            default: return <AcademicHome />;
        }
    }

    if (user.role === Role.ACCOUNTS) {
        switch (currentView) {
            case 'revenue': return <AccountsRevenue />;
            case 'student-details': return <StudentDetails />;
            case 'billing': return <BillingTemplate />;
            case 'settings': return <AdminSettings />;
            case 'messages': return <MessagesView />;
            default: return <AccountsHome />;
        }
    }

    return <div className="p-8">Unknown Role</div>;
}

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
import { TeacherSettings } from "@/components/dashboard/views/teacher/Settings";

// Parent Views
import { ParentHome } from "@/components/dashboard/views/parent/Home";
import { ParentSettings } from "@/components/dashboard/views/parent/Settings";

// Admin Views
import { AdminHome } from "@/components/dashboard/views/admin/Home";
import { AdminSettings } from "@/components/dashboard/views/admin/Settings";

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
            default: return <StudentHome />;
        }
    }

    if (user.role === Role.TEACHER) {
        switch (currentView) {
            case 'settings': return <TeacherSettings />;
            default: return <TeacherHome />;
        }
    }

    if (user.role === Role.PARENT) {
        switch (currentView) {
            case 'settings': return <ParentSettings />;
            default: return <ParentHome />;
        }
    }

    if (user.role === Role.ADMIN) {
         switch (currentView) {
            case 'settings': return <AdminSettings />;
            default: return <AdminHome />;
        }
    }

    return <div className="p-8">Unknown Role</div>;
}

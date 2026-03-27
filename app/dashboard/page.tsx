"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { admissionsApi } from "@/lib/admissions";
import { auth } from "@/lib/auth";

// Student Views
import { StudentHome } from "@/components/dashboard/views/student/Home";
import { StudentCourses } from "@/components/dashboard/views/student/Courses";
import { StudentTests } from "@/components/dashboard/views/student/Tests";
import { StudentPerformance } from "@/components/dashboard/views/student/Performance";
import { StudentSchedule } from "@/components/dashboard/views/student/Schedule";
import { StudentSettings } from "@/components/dashboard/views/student/Settings";
import { StudentBatches } from "@/components/dashboard/views/student/Batches";
import { StudentExams } from "@/components/dashboard/views/student/Exams";
import { ExamInterface } from "@/components/dashboard/views/student/ExamInterface";

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

// Accounts Views
import { AccountsHome } from "@/components/dashboard/views/accounts/Home";
import { AccountsRevenue } from "@/components/dashboard/views/accounts/Revenue";
import { StudentDetails } from "@/components/dashboard/views/accounts/StudentDetails";
import { BillingTemplate } from "@/components/dashboard/views/accounts/Billing";
import { AccountsInvoices } from "@/components/dashboard/views/accounts/Invoices";

// Shared Views
import { NotificationsView } from "@/components/dashboard/views/shared/Notifications";
import { MessagesView } from "@/components/dashboard/views/shared/Messages";
import { AdminSettings } from "@/components/dashboard/views/admin/Settings";
import { BatchDetailsView } from "@/components/dashboard/views/shared/BatchDetails";

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
  const router = useRouter();
  const currentView = searchParams.get("view");
  const examId = searchParams.get("id");
  const batchId = searchParams.get("batchId");
  const [admissionChecked, setAdmissionChecked] = useState(false);
  const [hasAdmission, setHasAdmission] = useState(false);

  console.log("Current View:", currentView);
  console.log("User Role:", user?.role);

  // For students: call /admissions/me to check if they have submitted admission
  useEffect(() => {
    if (isLoading || !user) return;
    if (user.role !== Role.STUDENT) {
      setHasAdmission(true);
      setAdmissionChecked(true);
      return;
    }
    const token = auth.getToken();
    admissionsApi
      .getMyAdmission(token || undefined)
      .then(() => {
        setHasAdmission(true);
      })
      .catch(() => {
        setHasAdmission(false);
      })
      .finally(() => {
        setAdmissionChecked(true);
      });
  }, [user, isLoading]);

  useEffect(() => {
    if (admissionChecked && !hasAdmission) {
      router.push("/admission-form");
    }
  }, [admissionChecked, hasAdmission, router]);

  if (isLoading || !admissionChecked)
    return <div className="p-8">Syncing user session...</div>;
  if (!user)
    return (
      <div
        className="p-8 text-red-500 font-bold underline cursor-pointer"
        onClick={() => (window.location.href = "/auth")}
      >
        Session expired. Please login again.
      </div>
    );
  if (user.role === Role.STUDENT && !hasAdmission)
    return <div className="p-8">Redirecting to admission form...</div>;

  if (currentView === "zoom-meeting") {
    return <ZoomMeeting />;
  }

  // Student
  if (user.role === Role.STUDENT) {
    switch (currentView) {
      case "courses":
        return <StudentCourses />;
      case "tests":
        return <StudentTests />;
      case "performance":
        return <StudentPerformance />;
      case "schedule":
        return <StudentSchedule />;
      case "settings":
        return <StudentSettings />;
      case "notifications":
        return <NotificationsView />;
      case "messages":
        return <MessagesView />;
      case "batches":
        return <StudentBatches />;
      case "batch-details":
        return batchId ? (
          <BatchDetailsView batchId={batchId} />
        ) : (
          <StudentBatches />
        );
      case "exams":
        return <StudentExams />;
      case "take-exam":
        return examId ? (
          <ExamInterface
            examId={examId}
            onBack={() => (window.location.href = "/dashboard?view=exams")}
          />
        ) : (
          <StudentExams />
        );
      default:
        return <StudentHome />;
    }
  }

  // Teacher
  if (user.role === Role.TEACHER) {
    switch (currentView) {
      case "courses":
        return <TeacherCourses />;
      case "tests":
        return <TeacherTests />;
      case "students":
        return <TeacherStudentManagement />;
      case "settings":
        return <TeacherSettings />;
      case "notifications":
        return <NotificationsView />;
      case "messages":
        return <MessagesView />;
      case "batches":
        return <TeacherBatches />;
      case "batch-details":
        return batchId ? (
          <BatchDetailsView batchId={batchId} />
        ) : (
          <TeacherBatches />
        );
      case "omr":
        return <OmrDashboard />;
      case "schedule":
        return <TeacherSchedule />;
      case "exams":
        return <ExamSchedules />;
      default:
        return <TeacherHome />;
    }
  }

  if (user.role === Role.PARENT) {
    switch (currentView) {
      case "performance":
        return <ParentPerformance />;
      case "settings":
        return <ParentSettings />;
      case "notifications":
        return <NotificationsView />;
      case "messages":
        return <MessagesView />;
      default:
        return <ParentHome />;
    }
  }

  if (user.role === Role.ADMIN) {
    switch (currentView) {
      case "users":
        return <AdminUserManagement />;
      case "manage-courses":
        return <AdminCourseManagement />;
      case "practice-tests":
        return <AdminPracticeTestManagement />;
      case "revenue":
        return <div className="p-8">Revenue & Payments View (Coming Soon)</div>;
      case "requests":
        return <AdminRequests />;
      case "settings":
        return <AdminSettings />;
      case "notifications":
        return <NotificationsView />;
      case "messages":
        return <MessagesView />;
      case "manage-batches":
        return <AdminBatchManagement />;
      case "batch-details":
        return batchId ? (
          <BatchDetailsView batchId={batchId} />
        ) : (
          <AdminBatchManagement />
        );
      case "exams":
        return <ExamSchedules />;
      default:
        return <AdminHome />;
    }
  }

  if (user.role === Role.ACADEMIC_OPERATIONS) {
    switch (currentView) {
      case "routine":
        return <ClassRoutine />;
      case "schedule":
        return <AcademicSchedule />;
      case "exams":
        return <ExamSchedules />;
      case "users":
        return <AdminUserManagement />;
      case "requests":
        return <AdminRequests />;
      case "students":
        return <TeacherStudentManagement />;
      case "manage-courses":
        return <AdminCourseManagement />;
      case "manage-batches":
        return <AdminBatchManagement />;
      case "batch-details":
        return batchId ? (
          <BatchDetailsView batchId={batchId} />
        ) : (
          <AdminBatchManagement />
        );
      case "settings":
        return <AdminSettings />;
      case "messages":
        return <MessagesView />;
      case "omr":
        return <OmrDashboard />;
      default:
        return <AcademicHome />;
    }
  }

  if (user.role === Role.ACCOUNTS) {
    switch (currentView) {
      case "revenue":
        return <AccountsRevenue />;
      case "student-details":
        return <StudentDetails />;
      case "billing":
        return <BillingTemplate />;
      case "invoices":
        return <AccountsInvoices />;
      case "settings":
        return <AdminSettings />;
      case "messages":
        return <MessagesView />;
      default:
        return <AccountsHome />;
    }
  }

  return <div className="p-8">Unknown Role</div>;
}

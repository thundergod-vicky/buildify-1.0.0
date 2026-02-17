import { LucideIcon } from "lucide-react";

export interface ILink {
    name: string;
    href: string;
};

export interface ICustomIcon {
    icon: LucideIcon;
    dir?: 'left' | 'right';
};

export interface ISectionTitle {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    dir?: 'left' | 'center';
};

export interface IFeature {
    icon: LucideIcon;
    title: string;
    description: string;
    cardBg?: string;
    iconBg?: string;
};

export interface IFaq {
    question: string;
    answer: string;
};

export interface ITeamMember {
    name: string;
    image: string;
    role: string;
};

export interface IPricingPlan {
    icon: LucideIcon;
    name: string;
    type?: 'enterprise' | 'popular';
    description: string;
    price: number;
    linkText: string;
    linkUrl: string;
    features: string[];
};

export interface ITestimonial {
    quote: string;
    name: string;
    handle: string;
    image: string;
    rating: 5 | 4 | 3 | 2 | 1;
};

// Backend-aligned types
export enum Role {
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
    ADMIN = 'ADMIN',
    PARENT = 'PARENT'
}

export enum LessonType {
    RECORDED = 'RECORDED',
    LIVE = 'LIVE'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export interface ParentRequest {
    id: string;
    parentId: string;
    studentEmail: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
}

export interface ParentStudent {
    id: string;
    parentId: string;
    studentId: string;
    student: User;
    parent: User;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'INFO' | 'WARNING' | 'ALERT';
    isRead: boolean;
    createdAt: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: Role;
    grade?: string;
    medal?: string;
    createdAt: Date;
    updatedAt: Date;
    parentOf?: ParentStudent[];
    studentOf?: ParentStudent[];
    parentRequests?: ParentRequest[];
    notifications?: Notification[];
}

export enum CourseType {
  PUBLIC = 'PUBLIC',
  PREMIUM = 'PREMIUM'
}

export interface CourseAssignment {
  id: string;
  courseId: string;
  studentId: string;
  assignedBy: string;
  deadline: string | null;
  assignedAt: string;
  student?: {
    id: string;
    name: string;
    email: string;
  };
  teacher?: {
    name: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  courseType: CourseType;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[];
  teacher?: {
    name: string;
  };
  _count?: {
    chapters: number;
    lessons?: number;
    enrollments?: number;
  };
}

export interface Chapter {
    id: string;
    courseId: string;
    title: string;
    order: number;
    lessons?: Lesson[];
}

export interface Lesson {
    id: string;
    chapterId: string;
    title: string;
    type: LessonType;
    driveFileId?: string;
    mimeType?: string;
    videoUrl?: string;
    pdfUrl?: string;
    duration?: number;
    pages?: number;
    order: number;
    mandatoryQuestionSetId?: string;
    completed?: boolean;
}

export interface QuestionSet {
    id: string;
    lessonId?: string;
    title: string;
    questions: Question[];
}

export interface Question {
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

export interface StudentProgress {
    id: string;
    studentId: string;
    lessonId: string;
    watchedDuration: number;
    completed: boolean;
    score?: number;
    completedAt?: Date;
}

export interface Test {
    id: string;
    title: string;
    description: string;
    courseId?: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
    questions: Question[];
    createdAt: Date;
}

export interface TestResult {
    id: string;
    testId: string;
    studentId: string;
    score: number;
    totalMarks: number;
    percentage: number;
    rank?: number;
    answers: Record<string, number>;
    submittedAt: Date;
}

export interface Payment {
    id: string;
    userId: string;
    courseId: string;
    amount: number;
    status: PaymentStatus;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    createdAt: Date;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
    createdAt: Date;
    sender?: User;
}

export interface Enrollment {
    id: string;
    studentId: string;
    courseId: string;
    enrolledAt: Date;
    expiresAt?: Date;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: Role;
}

export interface PracticeQuestion {
    id: number;
    category: string;
    difficulty: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

export interface PracticeTest {
    id: string;
    title: string;
    totalQuestions: number;
    questions: PracticeQuestion[];
    timeLimit?: number; // In minutes
    teacherId: string;
    teacher?: {
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface PracticeTestResult {
    id: string;
    studentId: string;
    testId: string;
    score: number;
    total: number;
    timeTaken?: number;
    rating?: number;
    status: 'COMPLETED' | 'CHEATED';
    answers?: any;
    test?: PracticeTest;
    createdAt: string;
}
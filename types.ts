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

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    teacherId: string;
    teacher?: User;
    thumbnail?: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
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
    videoUrl?: string;
    pdfUrl?: string;
    duration?: number;
    order: number;
    mandatoryQuestionSetId?: string;
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
import { VideoIcon, FileQuestionIcon, PlayCircleIcon, ShieldCheckIcon, ClipboardCheckIcon, BarChartIcon } from "lucide-react";
import { IFeature } from "../types";

export const features: IFeature[] = [
    {
        title: "Live Sessions with IIT Teachers",
        description:
            "Join real-time classes led by 21 expert IIT educators. Interact, ask questions and learn in a structured live environment.",
        icon: VideoIcon,
        cardBg: "bg-orange-100",
        iconBg: "bg-orange-500"
    },
    {
        title: "1000s of Test Papers & Q&A",
        description:
            "Access a huge library of test papers and solved question-answers. Practice and revise with exam-style problems.",
        icon: FileQuestionIcon,
        cardBg: "bg-green-100",
        iconBg: "bg-green-500"
    },
    {
        title: "Live Recordings",
        description:
            "Missed a class? Watch full recordings of live sessions anytime and learn at your own pace.",
        icon: PlayCircleIcon,
        cardBg: "bg-indigo-100",
        iconBg: "bg-indigo-500"
    },
    {
        title: "Parental Controls & Notifications",
        description:
            "Parents get notified about attendance, progress and activity. Stay in control with visibility and safety settings.",
        icon: ShieldCheckIcon,
        cardBg: "bg-pink-100",
        iconBg: "bg-pink-500"
    },
    {
        title: "Fully Proctored Examinations",
        description:
            "Completely watched, fair exams with proctoring so every test reflects true understanding and progress.",
        icon: ClipboardCheckIcon,
        cardBg: "bg-lime-100",
        iconBg: "bg-lime-500"
    },
    {
        title: "Progress Reports",
        description:
            "Clear progress reports and analytics so students and parents can track performance and improvement over time.",
        icon: BarChartIcon,
        cardBg: "bg-gray-50",
        iconBg: "bg-orange-500",
    },
];

import CourseDetails, { CourseData } from "@/components/course/course-details";

const class6Data: CourseData = {
    name: "AARAMBH",
    classRange: "Class VI",
    tagline: "Building a strong academic foundation through conceptual clarity, curiosity-driven learning, and disciplined study habits.",
    description: "AARAMBH for Class VI is designed to introduce students to structured learning while nurturing curiosity and conceptual understanding. The course focuses on building strong fundamentals in core subjects, preparing students for higher academic challenges.",
    forWho: {
        newStarters: "Students entering Class VI looking for a head start.",
        foundationSeekers: "Students needing to strengthen their core basics.",
        futureAimers: "Curious learners aiming for academic excellence."
    },
    subjects: [
        { name: "Mathematics", icon: "CalculatorIcon" },
        { name: "Mental Ability", icon: "MicroscopeIcon" },
        { name: "Physics", icon: "SpellCheckIcon" },
        { name: "Social Science", icon: "BrainCircuitIcon" },
        { name: "Biology", icon: "CalculatorIcon" },
        { name: "Chemistry", icon: "MicroscopeIcon" },
        { name: "English", icon: "SpellCheckIcon" },
    ],
    timings: [
        { class: "Class 6", stream: "CBSE", morning: "N/A", evening: "5:00 PM – 8:20 PM", weekend: "2:20 PM – 6:50 PM" },
        { class: "Class 6", stream: "ICSE", morning: "N/A", evening: "5:00 PM – 8:20 PM", weekend: "N/A" },
    ],
    feeStructure: {
        admissionFee: "₹ 3,000",
        tuitionFee: "₹ 38,000",
        totalFee: "₹ 41,000",
        plan1Installments: [
            { details: "[1ST] At Admission", amount: "₹ 25,800" },
            { details: "[2ND] 01-05-2026", amount: "₹ 15,200" }
        ],
        plan2Total: "₹ 46,000",
        plan2Installments: [
            { details: "[1ST] At Admission", amount: "₹ 15,900" },
            { details: "[2ND] 01-04-2026", amount: "₹ 12,900" },
            { details: "[3RD] 01-05-2026", amount: "₹ 10,750" },
            { details: "[4TH] 01-06-2026", amount: "₹ 6,450" }
        ]
    }
};

export default function CourseClasses() {
    return <CourseDetails data={class6Data} />;
}

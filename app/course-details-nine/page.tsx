import CourseDetails, { CourseData } from "@/components/course/course-details";

const class9Data: CourseData = {
    name: "AARADHANA",
    classRange: "Class IX",
    tagline: "Building a strong academic foundation through conceptual clarity, curiosity-driven learning, and disciplined study habits.",
    description: "AARADHANA for Class IX is designed to introduce students to structured learning while nurturing curiosity and conceptual understanding. The course focuses on building strong fundamentals in core subjects, preparing students for higher academic challenges.",
    forWho: {
        newStarters: "Students entering Class IX looking for a head start.",
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
        { class: "Class 9", stream: "CBSE", morning: "N/A", evening: "4:00 PM – 8:30 PM", weekend: "12:00 PM – 5:40 PM" },
        { class: "Class 9", stream: "ICSE", morning: "N/A", evening: "N/A", weekend: "12:00 PM – 5:40 PM" },
    ],
    feeStructure: {
        admissionFee: "₹ 4,000",
        tuitionFee: "₹ 50,000",
        totalFee: "₹ 54,000",
        plan1Installments: [
            { details: "[1ST] At Admission", amount: "₹ 34,000" },
            { details: "[2ND] 01-05-2026", amount: "₹ 20,000" }
        ],
        plan2Total: "₹ 59,000",
        plan2Installments: [
            { details: "[1ST] At Admission", amount: "₹ 20,500" },
            { details: "[2ND] 01-04-2026", amount: "₹ 16,500" },
            { details: "[3RD] 01-05-2026", amount: "₹ 13,750" },
            { details: "[4TH] 01-06-2026", amount: "₹ 8,250" }
        ]
    }
};

export default function CourseClasses() {
    return <CourseDetails data={class9Data} />;
}

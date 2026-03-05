import CourseDetails, { CourseData } from "@/components/course/course-details";

const class12Data: CourseData = {
    name: "AAKRITI",
    classRange: "Class XII",
    tagline: "Building a strong academic foundation through conceptual clarity, curiosity-driven learning, and disciplined study habits.",
    description: "AAKRITI for Class XII is designed to introduce students to structured learning while nurturing curiosity and conceptual understanding. The course focuses on building strong fundamentals in core subjects, preparing students for higher academic challenges.",
    forWho: {
        newStarters: "Students entering Class XII looking for a head start.",
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
        { class: "Class 11", stream: "NEET", morning: "8:00 AM – 2:10 PM", evening: "4:00 PM – 8:20 PM", weekend: "9:30 AM – 5:20 PM" },
        { class: "Class 11", stream: "JEE", morning: "8:00 AM – 2:10 PM", evening: "4:00 PM – 8:20 PM", weekend: "9:30 AM – 5:20 PM" },
    ],
    feeStructure: {
        admissionFee: "₹ 5,000",
        tuitionFee: "₹ 1,05,000",
        totalFee: "₹ 1,10,000",
        plan1Installments: [
            { details: "[1ST] At Admission", amount: "₹ 68,000" },
            { details: "[2ND] 01-05-2026", amount: "₹ 42,000" }
        ],
        plan2Total: "₹ 1,20,000",
        plan2Installments: [
            { details: "[1ST] At Admission", amount: "₹ 39,500" },
            { details: "[2ND] 01-04-2026", amount: "₹ 34,500" },
            { details: "[3RD] 01-05-2026", amount: "₹ 28,750" },
            { details: "[4TH] 01-06-2026", amount: "₹ 17,250" }
        ]
    }
};

export default function CourseClasses() {
    return <CourseDetails data={class12Data} />;
}

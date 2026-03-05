import CourseDetails, { CourseData } from "@/components/course/course-details";

const class10Data: CourseData = {
    name: "AARADHANA",
    classRange: "Class X",
    tagline: "Building a strong academic foundation through conceptual clarity, curiosity-driven learning, and disciplined study habits.",
    description: "AARADHANA for Class X is designed to introduce students to structured learning while nurturing curiosity and conceptual understanding. The course focuses on building strong fundamentals in core subjects, preparing students for higher academic challenges.",
    forWho: {
        newStarters: "Students entering Class X looking for a head start.",
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
        { class: "Class 10", stream: "CBSE", morning: "N/A", evening: "4:00 PM – 8:30 PM", weekend: "12:00 PM – 5:40 PM" },
        { class: "Class 10", stream: "ICSE", morning: "N/A", evening: "N/A", weekend: "12:00 PM – 5:40 PM" },
    ],
    feeStructure: {
        admissionFee: "₹ 4,000",
        tuitionFee: "₹ 57,000",
        totalFee: "₹ 61,000",
        plan1Installments: [
            { details: "[1ST] At Admission", amount: "₹ 38,200" },
            { details: "[2ND] 01-05-2026", amount: "₹ 22,800" }
        ],
        plan2Total: "₹ 66,000",
        plan2Installments: [
            { details: "[1ST] At Admission", amount: "₹ 22,600" },
            { details: "[2ND] 01-04-2026", amount: "₹ 18,600" },
            { details: "[3RD] 01-05-2026", amount: "₹ 15,500" },
            { details: "[4TH] 01-06-2026", amount: "₹ 9,300" }
        ]
    }
};

export default function CourseClasses() {
    return <CourseDetails data={class10Data} />;
}

import CourseDetails, { CourseData } from "@/components/course/course-details";

const classPassedData: CourseData = {
    name: "ABHYAAS",
    classRange: "12th Passed",
    tagline: "Building a strong academic foundation through conceptual clarity, curiosity-driven learning, and disciplined study habits.",
    description: "ABHYAAS for 12th Passed is designed to introduce students to structured learning while nurturing curiosity and conceptual understanding. The course focuses on building strong fundamentals in core subjects, preparing students for higher academic challenges.",
    forWho: {
        newStarters: "Students entering 12th Passed looking for a head start.",
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
    timings: [],
    feeStructure: {
        admissionFee: "₹ 10,000",
        tuitionFee: "₹ 1,10,000",
        totalFee: "₹ 1,20,000",
        plan1Installments: [
            { details: "[1ST] At Admission", amount: "₹ 76,000" },
            { details: "[2ND] 01-05-2026", amount: "₹ 44,000" }
        ],
        plan2Total: "₹ 1,30,000",
        plan2Installments: [
            { details: "[1ST] At Admission", amount: "₹ 46,000" },
            { details: "[2ND] 01-04-2026", amount: "₹ 36,000" },
            { details: "[3RD] 01-05-2026", amount: "₹ 30,000" },
            { details: "[4TH] 01-06-2026", amount: "₹ 18,000" }
        ]
    }
};

export default function CourseClasses() {
    return <CourseDetails data={classPassedData} />;
}

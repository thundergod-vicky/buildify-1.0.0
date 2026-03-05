import ProgramOverview, { ProgramData } from "@/components/program/program-overview";

const abhyaasData: ProgramData = {
  name: "ABHYAAS",
  tagline: "Building a strong academic foundation through conceptual clarity, curiosity-driven learning, and disciplined study habits.",
  aboutTitle: "About ABHYAAS",
  aboutDescription: (
    <>
      <p>
        Abhyaas is an intensive program for students who have completed Class XII and 
        seek to elevate their entrance exam performance.
      </p>
      <p className="mt-4">
        The course emphasizes <strong> in-depth revision, updated study material, and continuous practice</strong>, helping
        students strengthen weak areas, improve accuracy, and achieve measurable score
        improvement and enhance accuracy through disciplined and targeted preparation.
      </p>
    </>
  ),
  aboutImage: "/assets/images/abc.jpeg",
  levelsTitle: "Classes Covered",
  levelsDescription: "Carefully structured curriculum designed to build strong fundamentals and prepare students for future academic success.",
  levels: [
    {
      level: "XII",
      title: "12th Passed",
      description: "A strong foundation focusing on curiosity, logical thinking, and interactive learning to develop academic confidence.",
      link: "/course-details-passed",
      color: "from-[#2945aa] to-blue-600"
    }
  ],
  whyChoose: [
    "Experienced Faculty",
    "Small Batch Size",
    "Strong Academic Discipline",
    "Exam-Oriented Preparation",
    "Continuous Assessment",
    "Parent Feedback System"
  ],
  enrollText: "Enroll now for ABHYAAS – 12th Passed"
};

export default function AbhyaasPage() {
  return <ProgramOverview data={abhyaasData} />;
}

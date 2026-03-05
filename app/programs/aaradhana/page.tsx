import ProgramOverview, { ProgramData } from "@/components/program/program-overview";

const aaradhanaData: ProgramData = {
  name: "AARADHANA",
  tagline: "Building a strong academic foundation through conceptual clarity, curiosity-driven learning, and disciplined study habits.",
  aboutTitle: "About AARADHANA",
  aboutDescription: (
    <>
      <p>
        Aaradhana is a comprehensive program crafted to ensure 
        <strong> academic excellence in Class IX and X board examinations</strong>.
      </p>
      <p className="mt-4">
        With a strong emphasis on conceptual depth, structured learning, and systematic practice, the program aligns
        seamlessly with board exam patterns, enabling students to achieve consistency, confidence, and superior results. The
        course follows a structured approach aligned with board exam patterns, ensuring thorough syllabus coverage, regular
        practice, and performance improvement. Students gain clarity, consistency, and confidence to achieve excellent board
        results.
      </p>
    </>
  ),
  aboutImage: "/assets/images/abc.jpeg",
  levelsTitle: "Classes Covered",
  levelsDescription: "Carefully structured curriculum designed to build strong fundamentals and prepare students for future academic success.",
  levels: [
    {
      level: "IX",
      title: "Class IX",
      description: "A strong foundation focusing on curiosity, logical thinking, and interactive learning to develop academic confidence.",
      link: "/course-details-nine",
      color: "from-[#2945aa] to-blue-600"
    },
    {
      level: "X",
      title: "Class X",
      description: "Concept strengthening with structured practice and regular assessments to enhance analytical and problem-solving skills.",
      link: "/course-details-ten",
      color: "from-[#faa819] to-yellow-400"
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
  enrollText: "Enroll now for AARADHANA – Classes IX to X"
};

export default function AaradhanaPage() {
  return <ProgramOverview data={aaradhanaData} />;
}

import ProgramOverview, { ProgramData } from "@/components/program/program-overview";

const aakritiData: ProgramData = {
  name: "AAKRITI",
  tagline: "Building a strong academic foundation through conceptual clarity, curiosity-driven learning, and disciplined study habits.",
  aboutTitle: "About AAKRITI",
  aboutDescription: (
    <>
      <p>
        Aakriti is an advanced academic program designed for students of Classes XI and XII 
        who aspire to excel in <strong> board
        examinations along with national-level competitive entrance tests</strong> such as <strong> NEET, 
        JEE MAINS, and JEE ADVANCE</strong>.
      </p>
      <p className="mt-4">
        The program offers a well-structured curriculum, expert faculty guidance, rigorous and focused practice, equipping
        students with strong subject mastery and advanced problem-solving capabilities. The program helps students handle
        complex concepts, manage vast syllabi, and build strong problem-solving skills essential for future career paths.
      </p>
    </>
  ),
  aboutImage: "/assets/images/abc.jpeg",
  levelsTitle: "Classes Covered",
  levelsDescription: "Carefully structured curriculum designed to build strong fundamentals and prepare students for future academic success.",
  levels: [
    {
      level: "XI",
      title: "Class XI",
      description: "A strong foundation focusing on curiosity, logical thinking, and interactive learning to develop academic confidence.",
      link: "/course-details-eleven",
      color: "from-[#2945aa] to-blue-600"
    },
    {
      level: "XII",
      title: "Class XII",
      description: "Concept strengthening with structured practice and regular assessments to enhance analytical and problem-solving skills.",
      link: "/course-details-twelve",
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
  enrollText: "Enroll now for AAKRITI – Classes XI to XII"
};

export default function AakritiPage() {
  return <ProgramOverview data={aakritiData} />;
}

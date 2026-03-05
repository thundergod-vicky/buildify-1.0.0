import ProgramOverview, { ProgramData } from "@/components/program/program-overview";

const aarambhData: ProgramData = {
  name: "AARAMBH",
  tagline: "Building a strong academic foundation through conceptual clarity, curiosity-driven learning, and disciplined study habits.",
  aboutTitle: "About AARAMBH",
  aboutDescription: (
    <>
      <p>
        Aarambh is a meticulously designed foundation program that focuses on developing
        <strong> conceptual clarity, logical reasoning, and analytical thinking</strong> at an early stage.
      </p>
      <p className="mt-4">
        By nurturing curiosity and strengthening fundamentals, the program prepares students
        to confidently transition into higher academic challenges and competitive learning
        environments. Through interactive teaching and structured guidance, students develop
        confidence, analytical skills, and a love for learning—preparing them for higher
        classes and competitive academics ahead.
      </p>
    </>
  ),
  aboutImage: "/assets/images/abc.jpeg",
  levelsTitle: "Classes Covered",
  levelsDescription: "Carefully structured curriculum designed to build strong fundamentals and prepare students for future academic success.",
  levels: [
    {
      level: "VI",
      title: "Class VI",
      description: "A strong foundation focusing on curiosity, logical thinking, and interactive learning to develop academic confidence.",
      link: "/course-details-six",
      color: "from-[#2945aa] to-blue-600"
    },
    {
      level: "VII",
      title: "Class VII",
      description: "Concept strengthening with structured practice and regular assessments to enhance analytical and problem-solving skills.",
      link: "/course-details-seven",
      color: "from-[#faa819] to-yellow-400"
    },
    {
      level: "VIII",
      title: "Class VIII",
      description: "A bridge towards higher classes and competitive preparation, ensuring conceptual clarity and disciplined study habits.",
      link: "/course-details-eight",
      color: "from-indigo-600 to-purple-600"
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
  enrollText: "Enroll now for AARAMBH – Classes VI to VIII"
};

export default function AarambhPage() {
  return <ProgramOverview data={aarambhData} />;
}

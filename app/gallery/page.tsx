import SectionTitle from "@/components/section-title";
import AnimatedContent from "@/components/animated-content";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

const galleryItems = [
    {
        title: "Live Physics Session",
        description: "Concept building with real-time problem solving.",
        src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=900&auto=format&fit=crop",
    },
    {
        title: "Focused Study Time",
        description: "Students revising with Adhyayan test papers.",
        src: "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=900&auto=format&fit=crop",
    },
    {
        title: "Doubt Clearing",
        description: "Interactive Q&A with IIT teachers.",
        src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=900&auto=format&fit=crop",
    },
    {
        title: "Exam-like Practice",
        description: "Proctored tests that feel like the real exam.",
        src: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=900&auto=format&fit=crop",
    },
    {
        title: "Progress Reviews",
        description: "Teachers and parents reviewing performance trends.",
        src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=900&auto=format&fit=crop",
    },
    {
        title: "Learning from Anywhere",
        description: "Students joining live sessions from home.",
        src: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=900&auto=format&fit=crop",
    },
];

export default function GalleryPage() {
    return (
        <main className="px-4 md:px-16 lg:px-24 xl:px-32 pt-32 pb-24">
            <div className="max-w-7xl mx-auto border-x border-gray-200 px-4 md:px-12 pb-24">
                <section className="pt-12 pb-10 flex flex-col items-center">
                    <SectionTitle
                        icon={ImageIcon}
                        title="Inside Adhyayan"
                        subtitle="A glimpse into how students learn, practice and grow with live IIT sessions, tests and reviews."
                    />
                </section>
                <section className="grid gap-8 md:grid-cols-3">
                    {galleryItems.map((item, index) => (
                        <AnimatedContent key={index} delay={index * 0.06} className="flex flex-col">
                            <div className="relative w-full h-60 overflow-hidden rounded-xl">
                                <Image
                                    src={item.src}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="mt-4 text-lg font-medium">{item.title}</h3>
                            <p className="text-sm text-zinc-500">{item.description}</p>
                        </AnimatedContent>
                    ))}
                </section>
            </div>
        </main>
    );
}


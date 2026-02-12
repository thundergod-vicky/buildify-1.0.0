import SectionTitle from "@/components/section-title";
import AnimatedContent from "@/components/animated-content";
import { team } from "@/data/team";
import { UsersIcon, GraduationCapIcon, StarIcon } from "lucide-react";

export default function TeamsPage() {
    return (
        <main className="px-4 md:px-16 lg:px-24 xl:px-32 pt-32 pb-24">
            <div className="max-w-7xl mx-auto border-x border-gray-200 px-4 md:px-12 pb-24">
                <section className="pt-12 pb-16 flex flex-col items-center">
                    <SectionTitle
                        icon={UsersIcon}
                        title="The Adhyayan Teachers"
                        subtitle="Learn from 21 experienced IIT educators who specialise in live problem solving, exam strategy and doubt clearing."
                    />
                    <AnimatedContent className="mt-8 grid gap-6 md:grid-cols-3 text-sm text-zinc-600">
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
                            <GraduationCapIcon className="text-orange-500 mt-1" />
                            <p>
                                Every Adhyayan teacher has cleared top competitive exams and brings years of classroom
                                and online teaching experience.
                            </p>
                        </div>
                        <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 flex items-start gap-3">
                            <StarIcon className="text-violet-500 mt-1" />
                            <p>
                                Live sessions are focused on concepts, previous year questions and exam patterns so that
                                students know exactly what to expect.
                            </p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 md:col-span-1 md:row-span-1">
                            <UsersIcon className="text-emerald-500 mt-1" />
                            <p>
                                Small, interactive batches with live chat and doubts ensure that every student gets
                                attention and clarity.
                            </p>
                        </div>
                    </AnimatedContent>
                </section>

                <section className="pb-8">
                    <h3 className="text-2xl font-semibold font-urbanist mb-6">Featured IIT Faculty</h3>
                    <div className="grid gap-8 md:grid-cols-3">
                        {team.map((member, index) => (
                            <AnimatedContent key={index} delay={index * 0.08} className="flex flex-col">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-64 object-cover rounded-xl"
                                />
                                <h4 className="mt-4 text-lg font-medium">{member.name}</h4>
                                <p className="text-zinc-500 text-sm">{member.role}</p>
                            </AnimatedContent>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}


import SectionTitle from "@/components/section-title";
import AnimatedContent from "@/components/animated-content";
import { MailIcon, PhoneIcon, MessageCircleIcon, MapPinIcon } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="px-4 md:px-16 lg:px-24 xl:px-32 pt-32 pb-24">
            <div className="max-w-7xl mx-auto border-x border-gray-200 px-4 md:px-12 pb-24">
                <section className="pt-12 pb-10 flex flex-col items-center">
                    <SectionTitle
                        icon={MailIcon}
                        title="Contact Adhyayan"
                        subtitle="Have questions about batches, pricing or how Adhyayan works? Reach out and our team will guide you."
                    />
                </section>

                <section className="grid gap-10 md:grid-cols-[2fr,1fr]">
                    <AnimatedContent className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
                        <h3 className="text-lg font-semibold mb-4">Send us a message</h3>
                        <form className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 mb-1">Student name</label>
                                    <input
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                                        placeholder="Enter student name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 mb-1">Parent email</label>
                                    <input
                                        type="email"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 mb-1">Phone number</label>
                                    <input
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                                        placeholder="+91 ..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 mb-1">Class / Exam</label>
                                    <input
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                                        placeholder="Class 11, JEE Main, etc."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 mb-1">How can we help?</label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400 resize-none"
                                    placeholder="Share your questions about batches, demo classes or pricing."
                                />
                            </div>
                            <button
                                type="button"
                                className="mt-2 inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-2.5 text-sm font-medium text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)]"
                            >
                                Submit enquiry
                            </button>
                            <p className="mt-2 text-xs text-zinc-500">
                                This is a demo form. In a production app, this would send your enquiry to the Adhyayan team.
                            </p>
                        </form>
                    </AnimatedContent>

                    <AnimatedContent className="space-y-4 text-sm text-zinc-600">
                        <h3 className="text-lg font-semibold mb-2">Other ways to reach us</h3>
                        <div className="flex items-start gap-3">
                            <MailIcon className="text-orange-500 mt-1" />
                            <div>
                                <p className="font-medium text-zinc-800">Email</p>
                                <p>support@adhyayan.app</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <PhoneIcon className="text-orange-500 mt-1" />
                            <div>
                                <p className="font-medium text-zinc-800">Phone</p>
                                <p>+91-98XX-XXX-XXX</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MessageCircleIcon className="text-orange-500 mt-1" />
                            <div>
                                <p className="font-medium text-zinc-800">WhatsApp</p>
                                <p>Chat with our counsellor for quick queries.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPinIcon className="text-orange-500 mt-1" />
                            <div>
                                <p className="font-medium text-zinc-800">Location</p>
                                <p>Online-first platform with support teams across India.</p>
                            </div>
                        </div>
                    </AnimatedContent>
                </section>
            </div>
        </main>
    );
}


import SectionTitle from "@/components/section-title";
import AnimatedContent from "@/components/animated-content";
import { pricing } from "@/data/pricing";
import { CircleDollarSignIcon, PiggyBankIcon, BadgePercentIcon, ShieldCheckIcon } from "lucide-react";

export default function BudgetPage() {
    return (
        <main className="px-4 md:px-16 lg:px-24 xl:px-32 pt-32 pb-24">
            <div className="max-w-7xl mx-auto border-x border-gray-200 px-4 md:px-12 pb-24">
                <section className="pt-12 pb-10 flex flex-col items-center">
                    <SectionTitle
                        icon={CircleDollarSignIcon}
                        title="Plan Your Budget"
                        subtitle="Understand exactly what you pay for with Adhyayan – from free trial access to full-featured plans for serious exam preparation."
                    />
                </section>

                <section className="grid gap-6 md:grid-cols-3 mb-12 text-sm text-zinc-600">
                    <AnimatedContent className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex items-start gap-3">
                        <PiggyBankIcon className="text-orange-500 mt-1" />
                        <p>
                            Start free and upgrade only when you are ready. Our plans are designed to support long-term
                            preparation without surprise fees.
                        </p>
                    </AnimatedContent>
                    <AnimatedContent className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-start gap-3">
                        <BadgePercentIcon className="text-emerald-500 mt-1" />
                        <p>
                            Save more with yearly plans. Families planning full-year preparation can reduce their
                            average monthly cost significantly.
                        </p>
                    </AnimatedContent>
                    <AnimatedContent className="bg-violet-50 border border-violet-100 rounded-xl p-5 flex items-start gap-3">
                        <ShieldCheckIcon className="text-violet-500 mt-1" />
                        <p>
                            No hidden charges. Live sessions, recordings, tests and proctored exams are included as
                            mentioned in each plan.
                        </p>
                    </AnimatedContent>
                </section>

                <section>
                    <h3 className="text-2xl font-semibold font-urbanist mb-4">Plans & Inclusions</h3>
                    <p className="text-zinc-500 text-sm mb-6">
                        Compare what each plan offers and pick the one that best matches your child&apos;s current
                        stage of preparation.
                    </p>
                    <div className="grid gap-8 md:grid-cols-4">
                        {pricing.map((plan, index) => (
                            <AnimatedContent
                                key={index}
                                delay={index * 0.08}
                                className={`p-5 rounded-xl border ${
                                    plan.type === "enterprise"
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : plan.type === "popular"
                                        ? "bg-linear-to-br from-orange-50 to-orange-100 border-orange-100"
                                        : "bg-white border-gray-200"
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <plan.icon className={plan.type === "enterprise" ? "text-white" : "text-orange-500"} />
                                    <h4 className="text-lg font-medium">{plan.name}</h4>
                                </div>
                                <p className={plan.type === "enterprise" ? "text-white/90 text-sm" : "text-zinc-500 text-sm"}>
                                    {plan.description}
                                </p>
                                <p className="mt-3 text-xl font-semibold">
                                    ${plan.price}
                                    <span className="text-xs font-normal text-zinc-500"> /month</span>
                                </p>
                                <ul className="mt-4 space-y-1 text-xs">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className={plan.type === "enterprise" ? "text-white/90" : "text-zinc-600"}>
                                            • {feature}
                                        </li>
                                    ))}
                                </ul>
                            </AnimatedContent>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}


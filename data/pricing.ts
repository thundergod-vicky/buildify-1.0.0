import { IPricingPlan } from "@/types";
import { RocketIcon, UserIcon, UsersIcon } from "lucide-react";

export const pricing: IPricingPlan[] = [
    {
        icon: RocketIcon,
        name: "Free",
        description: "Explore Adhyayan and attend a few live sessions.",
        price: 0,
        linkText: "Start Free",
        linkUrl: "#",
        features: [
            "Limited live sessions",
            "Sample test papers",
            "Community support",
            "Basic progress view",
            "Email support",
        ],
    },
    {
        icon: UserIcon,
        name: "Starter",
        description: "For students building a strong foundation.",
        price: 19,
        linkText: "Get Started",
        linkUrl: "#",
        features: [
            "More live sessions",
            "1000+ test papers & Q&A",
            "Live session recordings",
            "Progress reports",
            "Email support",
        ],
    },
    {
        icon: UsersIcon,
        name: "Pro",
        type: "popular",
        description: "Best for serious students and exam prep.",
        price: 49,
        linkText: "Upgrade to Pro",
        linkUrl: "#",
        features: [
            "All live sessions",
            "Full test & Q&A library",
            "All recordings",
            "Proctored exams",
            "Parental controls & notifications",
        ],
    },
    {
        icon: UserIcon,
        name: "Enterprise",
        type: "enterprise",
        description: "For schools and institutions.",
        price: 149,
        linkText: "Contact Sales",
        linkUrl: "#",
        features: [
            "Custom batch size",
            "Dedicated IIT faculty support",
            "Bulk progress reports",
            "SLA & compliance",
            "Dedicated account manager",
        ],
    },
];

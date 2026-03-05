import { ILink } from "@/types";

export const links: ILink[] = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "About Us",
        href: "/about",
    },
    {
        name: "Courses",
        href: "#",
        subLinks: [
            { name: "Aarambh (VI-VIII)", href: "/programs/aarambh" },
            { name: "Aaradhana (IX-X)", href: "/programs/aaradhana" },
            { name: "Aakriti (XI-XII)", href: "/programs/aakriti" },
            { name: "Abhyaas (12th Passed)", href: "/programs/abhyaas" },
            { name: "Aakankha (Crash Course)", href: "/programs/aakankha" },
        ]
    },
    {
        name: "Learning",
        href: "/learning-experience",
    },
    {
        name: "Admission",
        href: "/admission-counselling",
        subLinks: [
            { name: "Apply Online", href: "/admission-form" },
            { name: "Fee Deposition Modes", href: "/fee-deposition-modes" },
            { name: "Refund Rules", href: "/refund-rules" },
        ]
    },
    {
        name: "Adhyayan SAT",
        href: "/adsat",
    },
    {
        name: "Contact Us",
        href: "/contact",
    },
];

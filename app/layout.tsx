import { Inter, Urbanist } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import Navbar from "@/components/navbar";
import LenisScroll from "@/components/lenis";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

const urbanist = Urbanist({
    variable: "--font-urbanist",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Adhyayan – Live Sessions with IIT Teachers",
        template: "%s | Adhyayan",
    },
    description:
        "Adhyayan is a study platform with live sessions by IIT teachers, 1000s of test papers and Q&A, live recordings, proctored exams, progress reports and parental controls.",
    keywords: [
        "IIT teachers",
        "live classes",
        "test papers",
        "JEE preparation",
        "online learning",
        "proctored exams",
        "parental controls",
        "progress report",
    ],
    authors: [{ name: "Adhyayan" }],
    creator: "Adhyayan",
    applicationName: "Adhyayan",
    appleWebApp: {
        title: "Adhyayan",
        capable: true,
        statusBarStyle: "default",
    },
    openGraph: {
        title: "Adhyayan – Live Sessions with IIT Teachers, Tests & Progress",
        description:
            "Study with IIT teachers live. Thousands of test papers, recordings, proctored exams and progress reports. Parental controls and notifications included.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Adhyayan – Live Sessions with IIT Teachers",
        description:
            "Live classes, 1000s of tests, recordings and proctored exams. Learn with IIT teachers and track progress.",
    },
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${urbanist.variable}`}>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Bounce}
                />
                <AuthProvider>
                    <NotificationProvider>
                        <LenisScroll />
                        <Navbar />
                        {children}
                        <Footer />
                    </NotificationProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

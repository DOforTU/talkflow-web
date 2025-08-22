"use client";

import Footer from "@/components/footers/Footer";
import SmartHeader from "@/components/headers/SmartHeader";
import WebHeader from "@/components/headers/WebHeader";

export default function AboutLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SmartHeader>
                <WebHeader />
            </SmartHeader>
            {children}
            <Footer />
        </>
    );
}

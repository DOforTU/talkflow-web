"use client";

import AppHeader from "@/components/headers/AppHeader";
import BottomNav from "@/components/navigation/BottomNav";

export default function UserPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="page-container">
            <AppHeader />

            {children}
            <BottomNav />
        </div>
    );
}

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AppHeader from "@/components/headers/AppHeader";
import BottomNav from "@/components/navigation/BottomNav";
import PageTransition from "@/components/transitions/PageTransition";
import { useAuth } from "@/context/Auth";

function AppLayoutContent({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { currentUser, currentProfile, isLoading } = useAuth();

    useEffect(() => {
        // 온보딩 페이지는 체크하지 않음
        if (pathname === "/app" || isLoading) return;

        // 온보딩 미완료 체크: 이름 또는 언어 설정이 안되어 있으면 온보딩 페이지로 리다이렉트
        const isOnboardingIncomplete = !currentUser?.firstName || !currentUser?.lastName || !currentProfile?.language;

        if (isOnboardingIncomplete) {
            router.push("/app");
        }
    }, [currentUser, currentProfile, pathname, router, isLoading]);

    // 온보딩 미완료이고 온보딩 페이지가 아니면 로딩 표시
    const isOnboardingIncomplete = !currentUser?.firstName || !currentUser?.lastName || !currentProfile?.language;

    if (!isLoading && pathname !== "/app" && isOnboardingIncomplete) {
        return (
            <div className="app-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    // 온보딩 페이지에서는 header와 nav 숨기기
    const isOnboardingPage = pathname === "/app";

    return (
        <>
            {!isOnboardingPage && <AppHeader />}
            <PageTransition>{children}</PageTransition>
            {!isOnboardingPage && <BottomNav />}
        </>
    );
}

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <AppLayoutContent>{children}</AppLayoutContent>;
}

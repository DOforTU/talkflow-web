"use client";

import AppHeader from "@/components/headers/AppHeader";
import SmartHeader from "@/components/headers/SmartHeader";
import BottomNav from "@/components/navigation/BottomNav";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { currentUser, currentProfile, isLoading } = useAuth();
    const router = useRouter();

    const isOnboardingComplete = useCallback(() => {
        return currentProfile?.language && currentUser?.firstName && currentUser?.lastName;
    }, [currentProfile?.language, currentUser?.firstName, currentUser?.lastName]);

    // 로그인하지 않은 사용자는 메인 페이지로 리다이렉트
    useEffect(() => {
        if (!isLoading && !currentUser) {
            router.push("/");
        }
        if (!isLoading && currentUser && !isOnboardingComplete()) {
            router.push("/onboarding");
        }
    }, [currentUser, isLoading, isOnboardingComplete, router]);

    // 로딩 중이거나 로그인하지 않은 사용자면 로딩 화면 표시
    if (isLoading || !currentUser) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <>
            <SmartHeader>
                <AppHeader />
            </SmartHeader>
            {children}
            <BottomNav />
        </>
    );
}

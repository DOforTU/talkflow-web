"use client";

import AppHeader from "@/components/headers/AppHeader";
import BottomNav from "@/components/navigation/BottomNav";
import { useAuthStore } from "@/store/authStore";
import { useCurrentUser } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import SmartHeader from "@/components/headers/SmartHeader";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, profile } = useAuthStore();
    const { isLoading } = useCurrentUser();
    const router = useRouter();

    const isOnboardingComplete = useCallback(() => {
        return profile?.language && user?.firstName && user?.lastName;
    }, [profile?.language, user?.firstName, user?.lastName]);

    // 로그인하지 않은 사용자는 메인 페이지로 리다이렉트
    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/");
        }
        if (!isLoading && user && !isOnboardingComplete()) {
            router.push("/onboarding");
        }
    }, [user, isLoading, isOnboardingComplete, router]);

    // 로딩 중이거나 로그인하지 않은 사용자면 로딩 화면 표시
    if (isLoading || !user) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <AppHeader />

            {children}
            <BottomNav />
        </div>
    );
}

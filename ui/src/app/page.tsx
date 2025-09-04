"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import SmartHeader from "@/components/headers/SmartHeader";
import LanguageSelector from "@/components/LanguageSelector";
import { useAuthStore } from "@/store/authStore";
import { useGoogleLogin } from "@/hooks/useAuth";
import { useLanguage } from "@/context/Language";
import { mainPageTexts } from "@/text/main/MainPage";
import "./MainPage.css";
import SimpleFooter from "@/components/footers/SimpleFooter";

export default function MainPage() {
    const router = useRouter();
    const { user, profile, isAuthenticated } = useAuthStore();
    const { currentLanguage } = useLanguage();
    const { login: googleLogin } = useGoogleLogin();

    const texts = mainPageTexts[currentLanguage];

    const isOnboardingComplete = useCallback(() => {
        return profile?.language && user?.firstName && user?.lastName;
    }, [profile?.language, user?.firstName, user?.lastName]);

    useEffect(() => {
        // 로그인했지만 온보딩이 안된 사용자는 /onboarding으로 리다이렉트
        if (isAuthenticated && user) {
            if (!isOnboardingComplete()) {
                router.push("/onboarding");
            } else {
                // 온보딩이 되었다면 /home으로 리다이렉트
                router.push("/home");
            }
        }
    }, [user, isAuthenticated, isOnboardingComplete, router]);

    const handleGoogleLogin = () => {
        googleLogin();
    };

    // 로그인한 사용자면 빈 화면 표시 (리다이렉트 중)
    if (isAuthenticated && user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="main-page">
            {/* Simple Header */}
            <SmartHeader>
                <header className="simple-header">
                    <LanguageSelector />
                </header>
            </SmartHeader>

            {/* Main Content */}
            <main className="main-section">
                <div className="main-container">
                    <div className="main-intro">
                        <Image
                            width={262}
                            height={568}
                            src="/temp_ui.png"
                            alt="Mobile UI Example"
                            className="example-ui"
                        />
                    </div>
                    <div className="main-divider"></div>
                    <div className="main-content">
                        <div className="main-text">
                            {/* Logo */}
                            <div className="main-logo">
                                <Image
                                    width={180}
                                    height={60}
                                    src="/web_logo_shadow.png"
                                    alt="Silhouette Logo"
                                    className="simple-footer-logo"
                                />
                                {/* Silhouette */}
                            </div>

                            {/* Description */}
                            <p className="main-description">
                                {texts.description.split("\n").map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        {index < texts.description.split("\n").length - 1 && <br />}
                                    </span>
                                ))}
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="main-actions">
                            <Link href="/about" className="main-btn-primary">
                                {texts.learnMoreButton}
                            </Link>

                            <button className="main-btn-google" onClick={handleGoogleLogin}>
                                <svg className="main-google-icon" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                {texts.signInButton}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <SimpleFooter />
        </div>
    );
}

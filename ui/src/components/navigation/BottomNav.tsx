"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./BottomNav.css";
import { use } from "react";
import { useAuthStore } from "@/store/authStore";

export default function BottomNav() {
    const pathname = usePathname();
    const { user, profile, isAuthenticated } = useAuthStore();

    const isActive = (path: string) => {
        return pathname === path;
    };

    // 로그인하지 않은 상태의 네비게이션
    if (!isAuthenticated) {
        return (
            <nav className="bottom-nav">
                <Link href="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                    </svg>
                    <span>로그인 하기</span>
                </Link>
                <Link href="/about" className={`nav-item ${isActive("/about") ? "active" : ""}`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Learn more</span>
                </Link>
            </nav>
        );
    }

    // 로그인한 상태의 기존 네비게이션
    return (
        <nav className="bottom-nav">
            <Link href="/home" className={`nav-item ${isActive("/home") ? "active" : ""}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
                <span>홈</span>
            </Link>
            <Link href="/memoir" className={`nav-item ${isActive("/memoir") ? "active" : ""}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
                <span>메모아</span>
            </Link>
            <Link href="/silhouettes" className={`nav-item ${isActive("/silhouettes") ? "active" : ""}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
                </svg>
                <span>실루엣</span>
            </Link>
            <Link href="/ai" className={`nav-item ${isActive("/ai") ? "active" : ""}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
                <span>AI</span>
            </Link>
            <Link href="/all" className={`nav-item ${isActive("/all") ? "active" : ""}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>전체</span>
            </Link>
        </nav>
    );
}

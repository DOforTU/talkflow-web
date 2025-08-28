"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./BottomNav.css";

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

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
            <Link href="/map" className={`nav-item ${isActive("/map") ? "active" : ""}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
                <span>지도</span>
            </Link>
            <Link href="/silhouette" className={`nav-item ${isActive("/silhouette") ? "active" : ""}`}>
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

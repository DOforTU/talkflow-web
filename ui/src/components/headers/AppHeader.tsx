"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import "./AppHeader.css";

export default function AppHeader() {
    const { profile, isAuthenticated } = useAuthStore();
    const router = useRouter();

    const handleProfileClick = () => {
        if (profile?.nickname) {
            router.push(`/users/${profile.nickname}`);
        }
    };

    const handleLoginClick = () => {
        router.push("/");
    };

    return (
        <header className="app-header">
            <div className="header-title">
                {/* Silhouette */}
                <Image
                    width={96}
                    height={24}
                    src="/web_logo.png"
                    alt="Silhouette Logo"
                    className="simple-footer-logo"
                    onClick={() => router.push("/home")}
                />
            </div>
            <div className="header-actions">
                {isAuthenticated ? (
                    <>
                        <div className="header-profile" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
                            {profile?.avatarUrl ? (
                                <Image
                                    width={40}
                                    height={40}
                                    src={profile.avatarUrl}
                                    alt="Profile"
                                    className="profile-image"
                                />
                            ) : (
                                <div
                                    className="profile-image"
                                    style={{
                                        backgroundColor: "var(--accent)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                ></div>
                            )}
                        </div>
                        <button className="header-notification" onClick={() => alert("")}>
                            <svg fill="none" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-5 5-5-5h5V3h0v14z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                                />
                            </svg>
                        </button>
                    </>
                ) : (
                    <button className="login-button" onClick={handleLoginClick}>
                        로그인
                    </button>
                )}
            </div>
        </header>
    );
}

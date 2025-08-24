"use client";

import Image from "next/image";
import { useAuth } from "@/context/Auth";
import "./AppHeader.css";

export default function AppHeader() {
    const { currentProfile } = useAuth();

    return (
        <header className="app-header">
            <div className="header-title">TalkFlow</div>
            <div className="header-actions">
                <div className="header-profile">
                    {currentProfile?.avatarUrl ? (
                        <Image
                            width={40}
                            height={40}
                            src={currentProfile.avatarUrl}
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
            </div>
        </header>
    );
}

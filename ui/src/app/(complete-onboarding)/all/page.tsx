"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import "./AllPage.css";

export default function AllPage() {
    const router = useRouter();
    const { user, profile } = useAuthStore();
    const { mutate: logout } = useLogout();

    const handleProfileSettings = () => {
        router.push("/all/settings/profile");
    };

    const handleAccountSettings = () => {
        router.push("/all/settings/account");
    };

    const handleLogout = () => {
        if (confirm("로그아웃 하시겠습니까?")) {
            logout();
        }
    };

    return (
        <div className="all-page">
            <main className="all-main">
                {/* User Profile Section */}
                <section className="user-profile-section">
                    <div className="user-profile-card">
                        <div className="user-avatar">
                            {profile?.avatarUrl ? (
                                <Image
                                    src={profile.avatarUrl}
                                    alt="Profile"
                                    width={80}
                                    height={80}
                                    className="avatar-image"
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="user-info">
                            <h2 className="user-name">
                                {user?.firstName && user?.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : profile?.nickname || "사용자"}
                            </h2>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    </div>
                    {/* Logout Section */}
                    <button className="logout-btn" onClick={handleLogout}>
                        <div className="logout-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16,17 21,12 16,7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </div>
                        <span>로그아웃</span>
                    </button>
                </section>

                {/* Settings Menu */}
                <section className="settings-section">
                    <div className="settings-menu">
                        <button className="settings-item" onClick={handleProfileSettings}>
                            <div className="settings-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <div className="settings-content">
                                <div className="settings-label">프로필 설정</div>
                                <div className="settings-description">닉네임, 프로필 사진 등</div>
                            </div>
                            <div className="settings-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </div>
                        </button>

                        <button className="settings-item" onClick={handleAccountSettings}>
                            <div className="settings-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.79a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                                </svg>
                            </div>
                            <div className="settings-content">
                                <div className="settings-label">계정 설정</div>
                                <div className="settings-description">비밀번호, 개인정보 등</div>
                            </div>
                            <div className="settings-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

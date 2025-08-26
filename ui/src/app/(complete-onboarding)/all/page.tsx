"use client";

import { useState } from "react";
import "./AllPage.css";

export default function AllPage() {
    const [activeTab, setActiveTab] = useState("schedules");

    const scheduleData = [
        { id: 1, time: "09:00", title: "팀 회의", location: "회의실 A", date: "2024-08-20" },
        { id: 2, time: "14:00", title: "프로젝트 검토", location: "온라인", date: "2024-08-20" },
        { id: 3, time: "16:30", title: "클라이언트 미팅", location: "강남역", date: "2024-08-21" },
        { id: 4, time: "10:00", title: "디자인 리뷰", location: "회의실 B", date: "2024-08-22" },
    ];

    const menuItems = [
        { id: "profile", label: "프로필 설정", icon: "👤" },
        { id: "notifications", label: "알림 설정", icon: "🔔" },
        { id: "theme", label: "테마 설정", icon: "🎨" },
        { id: "backup", label: "데이터 백업", icon: "💾" },
        { id: "help", label: "도움말", icon: "❓" },
        { id: "about", label: "앱 정보", icon: "ℹ️" },
    ];

    return (
        <div className="all-page">
            <main className="all-main">
                <div className="all-header">
                    <h1 className="all-title">전체</h1>
                    <p className="all-subtitle">모든 일정과 설정을 관리하세요</p>
                </div>

                <div className="tab-container">
                    <div className="tab-buttons">
                        <button
                            className={`tab-button ${activeTab === "schedules" ? "active" : ""}`}
                            onClick={() => setActiveTab("schedules")}
                        >
                            📅 전체 일정
                        </button>
                        <button
                            className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
                            onClick={() => setActiveTab("settings")}
                        >
                            ⚙️ 설정
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === "schedules" && (
                            <div className="schedules-section">
                                <div className="section-header">
                                    <h2>전체 일정 목록</h2>
                                    <button className="add-schedule-btn">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        일정 추가
                                    </button>
                                </div>

                                <div className="schedule-list">
                                    {scheduleData.map((schedule) => (
                                        <div key={schedule.id} className="schedule-card">
                                            <div className="schedule-time">
                                                <div className="time">{schedule.time}</div>
                                                <div className="date">{schedule.date}</div>
                                            </div>
                                            <div className="schedule-details">
                                                <h3 className="schedule-title">{schedule.title}</h3>
                                                <p className="schedule-location">📍 {schedule.location}</p>
                                            </div>
                                            <div className="schedule-actions">
                                                <button className="edit-btn">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button className="delete-btn">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div className="settings-section">
                                <h2>설정</h2>
                                <div className="settings-menu">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.id}
                                            className="settings-item"
                                            onClick={() => alert(`${item.label} 기능 준비중입니다!`)}
                                        >
                                            <div className="settings-icon">{item.icon}</div>
                                            <div className="settings-label">{item.label}</div>
                                            <svg
                                                className="settings-arrow"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                    ))}
                                </div>

                                <div className="logout-section">
                                    <button
                                        className="logout-btn"
                                        onClick={() => alert("로그아웃 기능 준비중입니다!")}
                                    >
                                        🚪 로그아웃
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
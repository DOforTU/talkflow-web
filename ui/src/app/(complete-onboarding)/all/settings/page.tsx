"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
    const [currentDate, setCurrentDate] = useState(new Date());

    // 캘린더 관련 함수들
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear()
        );
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    // 캘린더 날짜 배열 생성
    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // 이전 달의 날짜들
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
        const daysInPrevMonth = getDaysInMonth(prevMonth);
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
            });
        }

        // 현재 달의 날짜들
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                day,
                isCurrentMonth: true,
            });
        }

        // 다음 달의 날짜들 (42개 채우기 위해)
        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            days.push({
                day,
                isCurrentMonth: false,
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

    return (
        <div className="home-page">
            {/* Main Content */}
            <main className="home-main">
                {/* Calendar Section */}
                <section className="calendar-section">
                    <div className="calendar-header">
                        <h2 className="calendar-title">{formatMonth(currentDate)}</h2>
                        <div className="calendar-nav">
                            <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <button className="calendar-nav-btn" onClick={goToNextMonth}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        {/* 요일 헤더 */}
                        {dayNames.map((day) => (
                            <div key={day} className="calendar-day-header">
                                {day}
                            </div>
                        ))}

                        {/* 날짜 */}
                        {calendarDays.map((dateInfo, index) => (
                            <div
                                key={index}
                                className={`calendar-day ${!dateInfo.isCurrentMonth ? "other-month" : ""} ${
                                    dateInfo.isCurrentMonth && isToday(dateInfo.day) ? "today" : ""
                                } ${
                                    Math.random() > 0.8 ? "has-event" : "" // 랜덤으로 일정 표시
                                }`}
                                onClick={() => {
                                    if (dateInfo.isCurrentMonth) {
                                        alert(
                                            `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${
                                                dateInfo.day
                                            }일 클릭`
                                        );
                                    }
                                }}
                            >
                                {dateInfo.day}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="quick-actions">
                    <h2 className="quick-actions-title">빠른 작업</h2>
                    <div className="actions-grid">
                        <Link href="/voice" className="action-card">
                            <span className="action-card-icon">🎤</span>
                            <h3 className="action-card-title">음성 일정</h3>
                        </Link>
                        <Link href="/schedule" className="action-card">
                            <span className="action-card-icon">📝</span>
                            <h3 className="action-card-title">일정 작성</h3>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

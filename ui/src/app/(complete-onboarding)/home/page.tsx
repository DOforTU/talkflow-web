"use client";

import { useState } from "react";
import { useAuthLanguage } from "@/context/Language";
import { homeTexts } from "@/text/app/home";
import { SupportedLanguage } from "@/lib/types/user.interface";
import "./HomePage.css";

export default function HomePage() {
    const { currentLanguage } = useAuthLanguage();
    const [currentDate, setCurrentDate] = useState(new Date());

    const texts = homeTexts[currentLanguage];

    // 캘린더 관련 함수들
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatMonth = (date: Date) => {
        // 언어에 따라 다른 locale 사용
        const locale = currentLanguage === SupportedLanguage.EN ? "en-US" : "ko-KR";
        return date.toLocaleDateString(locale, { year: "numeric", month: "long" });
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
    const dayNames = [
        texts.calendar.dayNames.sunday,
        texts.calendar.dayNames.monday,
        texts.calendar.dayNames.tuesday,
        texts.calendar.dayNames.wednesday,
        texts.calendar.dayNames.thursday,
        texts.calendar.dayNames.friday,
        texts.calendar.dayNames.saturday,
    ];

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
                                        strokeWidth={3}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <button className="calendar-nav-btn" onClick={goToNextMonth}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        {/* 요일 헤더 */}
                        {dayNames.map((day, index) => (
                            <div key={day} className={`calendar-day-header ${index === 0 ? "sunday" : ""}`}>
                                {day}
                            </div>
                        ))}

                        {/* 날짜 */}
                        {calendarDays.map((dateInfo, index) => {
                            const dayOfWeek = index % 7; // 0=일요일, 1=월요일, ...
                            return (
                                <div
                                    key={index}
                                    className={`calendar-day ${!dateInfo.isCurrentMonth ? "other-month" : ""} ${
                                        dateInfo.isCurrentMonth && isToday(dateInfo.day) ? "today" : ""
                                    } ${dayOfWeek === 0 ? "sunday" : ""}`}
                                    onClick={() => {
                                        if (dateInfo.isCurrentMonth) {
                                            const alertMessage =
                                                currentLanguage === SupportedLanguage.EN
                                                    ? texts.alerts.dateClick
                                                          .replace("{year}", currentDate.getFullYear().toString())
                                                          .replace("{month}", (currentDate.getMonth() + 1).toString())
                                                          .replace("{day}", dateInfo.day.toString())
                                                    : texts.alerts.dateClick
                                                          .replace("{year}", currentDate.getFullYear().toString())
                                                          .replace("{month}", (currentDate.getMonth() + 1).toString())
                                                          .replace("{day}", dateInfo.day.toString());
                                            alert(alertMessage);
                                        }
                                    }}
                                >
                                    {dateInfo.day}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Today's Schedule */}
                <section className="today-schedule">
                    <h2 className="today-schedule-title">{texts.schedule.title}</h2>
                    <div className="schedule-list">
                        {/* 임시 일정 데이터 */}
                        <div className="schedule-item">
                            <div className="schedule-time">09:00</div>
                            <div className="schedule-content">{texts.schedule.sampleSchedules.teamMeeting}</div>
                        </div>
                        <div className="schedule-item">
                            <div className="schedule-time">14:00</div>
                            <div className="schedule-content">{texts.schedule.sampleSchedules.projectReview}</div>
                        </div>
                        <div className="schedule-item">
                            <div className="schedule-time">16:30</div>
                            <div className="schedule-content">{texts.schedule.sampleSchedules.clientMeeting}</div>
                        </div>
                        {/* 일정이 없을 때 */}
                        {/* <div className="no-schedule">
                            {texts.schedule.noSchedule}
                        </div> */}
                    </div>
                </section>
                {/* Voice Recording Button */}
                <button
                    className="voice-record-btn"
                    onClick={() => alert(texts.voice.recordingReady)}
                    aria-label={texts.voice.ariaLabel}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                </button>
            </main>
        </div>
    );
}

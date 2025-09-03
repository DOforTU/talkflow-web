"use client";

import { useState } from "react";
import { useAuthLanguage } from "@/context/Language";
import { homeTexts } from "@/text/app/home";
import { ResponseEventDto } from "@/lib/types/event.interface";
import { getEventsForDateIncludingMultiDay, getMultiDayEventPosition, isMultiDayEvent } from "@/lib/utils/eventUtils";
import { getDaysInMonth, getFirstDayOfMonth, formatMonth, isSelected, getDayNames } from "@/lib/utils/calendarUtils";
import { isTodayInMonth } from "@/lib/utils/dateUtils";

interface CalendarProps {
    events: ResponseEventDto[];
    onDateSelect: (date: Date) => void;
}

export default function Calendar({ events, onDateSelect }: CalendarProps) {
    const { currentLanguage } = useAuthLanguage();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const texts = homeTexts[currentLanguage];

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleDateClick = (dateInfo: any) => {
        // 다른 달의 날짜를 클릭했을 때 해당 달로 이동
        if (!dateInfo.isCurrentMonth) {
            setCurrentDate(new Date(dateInfo.date.getFullYear(), dateInfo.date.getMonth()));
        }
        setSelectedDate(dateInfo.date);
        onDateSelect(dateInfo.date);
    };

    // 유연한 캘린더 일수 생성 (필요한 주만큼만 표시)
    const generateFlexibleCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // 이전 달의 날짜들 (첫 번째 주 채우기)
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
        const daysInPrevMonth = getDaysInMonth(prevMonth);
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i),
            });
        }

        // 현재 달의 날짜들
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                day,
                isCurrentMonth: true,
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
            });
        }

        // 다음 달의 날짜들 (마지막 주만 채우기)
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
        const totalCells = days.length;
        const weeksNeeded = Math.ceil(totalCells / 7);
        const cellsNeeded = weeksNeeded * 7;
        const remainingDays = cellsNeeded - totalCells;

        for (let day = 1; day <= remainingDays; day++) {
            days.push({
                day,
                isCurrentMonth: false,
                date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day),
            });
        }

        return days;
    };

    const calendarDays = generateFlexibleCalendarDays();
    const dayNames = getDayNames(texts);

    return (
        <section className="calendar-section">
            <div className="calendar-header">
                <h2 className="calendar-title">{formatMonth(currentDate, currentLanguage)}</h2>
                <div className="calendar-nav">
                    <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="calendar-nav-btn" onClick={goToNextMonth}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
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
                    const dayEvents = getEventsForDateIncludingMultiDay(events, dateInfo.date);
                    const hasEvents = dayEvents.length > 0;

                    return (
                        <div
                            key={index}
                            className={`calendar-day ${!dateInfo.isCurrentMonth ? "other-month" : ""} ${
                                dateInfo.isCurrentMonth && isTodayInMonth(dateInfo.day, currentDate) ? "today" : ""
                            } ${dayOfWeek === 0 ? "sunday" : ""} ${hasEvents ? "has-events" : ""} ${
                                dateInfo.isCurrentMonth && isSelected(dateInfo.date, selectedDate) ? "selected" : ""
                            }`}
                            onClick={() => handleDateClick(dateInfo)}
                        >
                            <div className="calendar-day-number">{dateInfo.day}</div>
                            {hasEvents && (
                                <div className="calendar-day-events">
                                    {dayEvents.slice(0, 3).map((event, eventIndex) => {
                                        const position = getMultiDayEventPosition(event, dateInfo.date);
                                        const isMultiDay = isMultiDayEvent(event.startTime, event.endTime);
                                        
                                        let eventTitle = event.title;
                                        let eventClassName = "calendar-event";
                                        
                                        if (isMultiDay) {
                                            if (position.isStart) {
                                                eventClassName += " multi-day-start";
                                                eventTitle = event.title.length > 8 ? event.title.substring(0, 8) + "..." : event.title;
                                            } else if (position.isEnd) {
                                                eventClassName += " multi-day-end";
                                                eventTitle = "..." + (event.title.length > 6 ? event.title.substring(event.title.length - 6) : event.title);
                                            } else if (position.isContinuation) {
                                                eventClassName += " multi-day-continuation";
                                                eventTitle = "...";
                                            }
                                        } else {
                                            eventTitle = event.title.length > 10 ? event.title.substring(0, 10) + "..." : event.title;
                                        }

                                        return (
                                            <div
                                                key={eventIndex}
                                                className={eventClassName}
                                                style={{ backgroundColor: event.colorCode }}
                                                title={event.title}
                                            >
                                                {eventTitle}
                                            </div>
                                        );
                                    })}
                                    {dayEvents.length > 3 && (
                                        <div className="calendar-event-more">+{dayEvents.length - 3}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

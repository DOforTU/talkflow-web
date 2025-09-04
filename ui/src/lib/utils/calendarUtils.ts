import { SupportedLanguage } from "@/lib/types/user.interface";
import { isTodayInMonth, isSameLocalDate } from "./dateUtils";

/**
 * 캘린더 관련 유틸리티 함수들
 */

/**
 * 월의 총 일수 계산
 */
export const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * 월의 첫 번째 날의 요일 계산
 */
export const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

/**
 * 월을 언어에 맞게 포맷
 */
export const formatMonth = (date: Date, language: SupportedLanguage): string => {
    const locale = language === SupportedLanguage.EN ? "en-US" : "ko-KR";
    return date.toLocaleDateString(locale, { year: "numeric", month: "long" });
};

/**
 * 두 날짜가 선택된 상태인지 확인
 */
export const isSelected = (date: Date, selectedDate: Date): boolean => {
    return isSameLocalDate(date, selectedDate);
};

/**
 * 캘린더 일수 생성 (42개 셀을 채우기 위해 이전/다음 달 포함)
 */
export const generateCalendarDays = (currentDate: Date) => {
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

    // 다음 달의 날짜들 (42개 채우기 위해)
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
        days.push({
            day,
            isCurrentMonth: false,
            date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day),
        });
    }

    return days;
};

/**
 * 요일 이름 배열 생성
 */
export const getDayNames = (texts: any) => [
    texts.calendar.dayNames.sunday,
    texts.calendar.dayNames.monday,
    texts.calendar.dayNames.tuesday,
    texts.calendar.dayNames.wednesday,
    texts.calendar.dayNames.thursday,
    texts.calendar.dayNames.friday,
    texts.calendar.dayNames.saturday,
];

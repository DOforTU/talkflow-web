/**
 * 날짜 관련 유틸리티 함수들
 */

/**
 * 로컬 시간대 기준으로 날짜 문자열 생성 (YYYY-MM-DD 형식)
 * 시간대 변환 문제를 피하기 위해 toISOString() 대신 직접 포맷팅
 */
export const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

/**
 * "YYYY-MM-DD HH:mm" 형식의 문자열에서 날짜 부분만 추출
 * 시간대 변환 문제를 피하기 위해 문자열 직접 파싱
 */
export const extractDateFromDateTimeString = (dateTimeString: string): string => {
    return dateTimeString.split(" ")[0];
};

/**
 * "YYYY-MM-DD HH:mm" 형식의 문자열에서 시간 부분만 추출
 */
export const extractTimeFromDateTimeString = (dateTimeString: string): string => {
    return dateTimeString.split(" ")[1];
};

/**
 * 두 날짜가 같은 날인지 비교 (시간대 변환 문제를 피함)
 * @param date1 비교할 첫 번째 날짜
 * @param date2 비교할 두 번째 날짜
 */
export const isSameLocalDate = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

/**
 * 특정 날짜와 "YYYY-MM-DD" 형식의 문자열이 같은 날인지 비교
 */
export const isDateMatchesString = (date: Date, dateString: string): boolean => {
    return getLocalDateString(date) === dateString;
};

/**
 * 특정 날짜와 "YYYY-MM-DD HH:mm" 형식의 이벤트 시간이 같은 날인지 비교
 */
export const isEventOnDate = (eventDateTime: string, targetDate: Date): boolean => {
    const eventDateStr = extractDateFromDateTimeString(eventDateTime);
    const targetDateStr = getLocalDateString(targetDate);
    return eventDateStr === targetDateStr;
};

/**
 * Date 객체를 "YYYY-MM-DD HH:mm" 형식으로 변환
 */
export const formatDateTimeString = (date: Date, time: string): string => {
    return `${getLocalDateString(date)} ${time}`;
};

/**
 * 오늘 날짜인지 확인
 */
export const isToday = (date: Date): boolean => {
    const today = new Date();
    return isSameLocalDate(date, today);
};

/**
 * 특정 일(day)이 오늘인지 확인 (월 캘린더에서 사용)
 */
export const isTodayInMonth = (day: number, currentMonth: Date): boolean => {
    const today = new Date();
    return (
        today.getDate() === day &&
        today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear()
    );
};

import { ResponseEventDto } from "@/lib/types/event.interface";
import { isEventOnDate } from "./dateUtils";

/**
 * 이벤트 관련 유틸리티 함수들
 */

/**
 * 특정 날짜의 이벤트들을 필터링
 */
export const getEventsForDate = (events: ResponseEventDto[], targetDate: Date): ResponseEventDto[] => {
    return events.filter((event) => isEventOnDate(event.startTime, targetDate));
};

/**
 * 이벤트들을 시간순으로 정렬 (하루종일 이벤트를 맨 위로)
 */
export const sortEventsByTime = (events: ResponseEventDto[]): ResponseEventDto[] => {
    return events.sort((a, b) => {
        // 하루종일 이벤트를 맨 위로, 나머지는 시간순
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        return a.startTime.localeCompare(b.startTime);
    });
};

/**
 * 특정 날짜의 이벤트들을 가져와서 시간순으로 정렬
 */
export const getSelectedDateEvents = (events: ResponseEventDto[], selectedDate: Date): ResponseEventDto[] => {
    const filteredEvents = getEventsForDate(events, selectedDate);
    return sortEventsByTime(filteredEvents);
};

/**
 * 두 지점 간 직선 거리 계산 (Haversine formula)
 * @param lat1 첫 번째 지점의 위도
 * @param lon1 첫 번째 지점의 경도
 * @param lat2 두 번째 지점의 위도
 * @param lon2 두 번째 지점의 경도
 * @returns 미터 단위의 거리
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // 지구 반지름 (미터)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 미터 단위
};

/**
 * 거리를 적절한 단위로 포맷
 * @param distance 미터 단위의 거리
 * @returns 포맷된 거리 문자열
 */
export const formatDistance = (distance: number): string => {
    if (distance >= 1000) {
        return `${(distance / 1000).toFixed(1)}km`;
    } else {
        return `${Math.round(distance)}m`;
    }
};

/**
 * 이벤트가 여러 날에 걸쳐있는지 확인
 * @param startTime "YYYY-MM-DD HH:mm" 형식의 시작 시간
 * @param endTime "YYYY-MM-DD HH:mm" 형식의 종료 시간
 * @returns 여러 날에 걸쳐있으면 true
 */
export const isMultiDayEvent = (startTime: string, endTime: string): boolean => {
    if (!endTime) return false;
    const startDate = startTime.split(" ")[0];
    const endDate = endTime.split(" ")[0];
    return startDate !== endDate;
};

/**
 * 이벤트가 특정 날짜에 속하는지 확인 (다중일 이벤트 포함)
 * @param event 이벤트 객체
 * @param targetDate 확인할 날짜
 * @returns 해당 날짜에 이벤트가 있으면 true
 */
export const isEventOnDateIncludingMultiDay = (event: ResponseEventDto, targetDate: Date): boolean => {
    // endTime이 없으면 기존 로직 사용
    if (!event.endTime) {
        return isEventOnDate(event.startTime, targetDate);
    }
    
    const startDate = new Date(event.startTime.replace(" ", "T"));
    const endDate = new Date(event.endTime.replace(" ", "T"));
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const eventStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const eventEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
    return target >= eventStartDate && target <= eventEndDate;
};

/**
 * 특정 날짜의 이벤트들을 필터링 (다중일 이벤트 포함)
 */
export const getEventsForDateIncludingMultiDay = (events: ResponseEventDto[], targetDate: Date): ResponseEventDto[] => {
    return events.filter((event) => isEventOnDateIncludingMultiDay(event, targetDate));
};

/**
 * 이벤트가 특정 날짜에서 시작하는지 확인
 */
export const isEventStartOnDate = (event: ResponseEventDto, targetDate: Date): boolean => {
    return isEventOnDate(event.startTime, targetDate);
};

/**
 * 이벤트가 특정 날짜에서 종료하는지 확인
 */
export const isEventEndOnDate = (event: ResponseEventDto, targetDate: Date): boolean => {
    if (!event.endTime) return false;
    return isEventOnDate(event.endTime, targetDate);
};

/**
 * 다중일 이벤트의 표시 위치 정보 가져오기
 */
export const getMultiDayEventPosition = (event: ResponseEventDto, targetDate: Date): {
    isStart: boolean;
    isEnd: boolean;
    isContinuation: boolean;
} => {
    const isStart = isEventStartOnDate(event, targetDate);
    const isEnd = isEventEndOnDate(event, targetDate);
    const isContinuation = !isStart && !isEnd && isEventOnDateIncludingMultiDay(event, targetDate);
    
    return { isStart, isEnd, isContinuation };
};

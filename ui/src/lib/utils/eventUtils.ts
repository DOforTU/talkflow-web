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

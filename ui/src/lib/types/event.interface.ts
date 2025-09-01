// ===== Create Event DTO =====
export interface CreateEventDto {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    isAllDay: boolean;
    colorCode: string;

    // parts of relations
    location?: CreateLocationDto;
    recurring?: CreateRecurringRuleDto;
}

export interface CreateLocationDto {
    nameEn?: string;
    nameKo?: string;
    address: string;
    latitude: number;
    longitude: number;
}

export interface CreateRecurringRuleDto {
    // TODO: 반복 일정 관련 필드들 추가 예정
}

// ===== Location Response DTO =====
export interface ResponseLocationDto {
    id: number;
    nameEn: string | null;
    nameKo: string | null;
    address: string;
    latitude: number;
    longitude: number;
}

// ===== Event Response DTO =====
export interface ResponseEventDto {
    id: number;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    isAllDay: boolean;
    colorCode: string;
    version: number;

    // time columns: Date는 JSON으로 전송시 string으로 변환됨
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

    // parts of relations
    userId: number;
    location: ResponseLocationDto | null;
    recurringEventId: number | null;
}

export interface ResponseEvent {
    id: number;
    title: string;
    description: string | null;
    startTime: string; // "2025-09-01 19:30" 형식
    endTime: string; // "2025-09-01 21:00" 형식
    isAllDay: boolean;
    colorCode: string;
    version: number;

    // time columns: Date는 JSON으로 전송시 string으로 변환됨
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    // parts of relations
    userId: number;
    location: ResponseLocationDto | null;
    recurringEventId: number | null;
}

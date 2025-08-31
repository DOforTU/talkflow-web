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
    startTime: string; // Date는 JSON으로 전송시 string으로 변환됨
    endTime: string; // Date는 JSON으로 전송시 string으로 변환됨
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
    startTime: Date; // Date는 JSON으로 전송시 string으로 변환됨
    endTime: Date; // Date는 JSON으로 전송시 string으로 변환됨
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

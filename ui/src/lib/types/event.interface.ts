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
    rule: string;
    startDate: string;
    endDate?: string;
}

// ===== Update Event DTO =====

export interface UpdateEventDto {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    isAllDay?: boolean;
    colorCode?: string;

    // parts of relations
    location?: UpdateLocationDto;
    recurring?: UpdateRecurringRuleDto;
}

export interface UpdateLocationDto {
    nameEn?: string;
    nameKo?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
}

export interface UpdateRecurringRuleDto {
    rule?: string;
    startDate?: string;
    endDate?: string;
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

// ===== Recurring Response DTO =====
export interface ResponseRecurringDto {
    id: number;
    rule: string;
    startDate: string;
    endDate: string | null;
    title: string;
    description: string | null;
    colorCode: string;
    version: number;
    location: ResponseLocationDto | null;
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
    recurringEvent: ResponseRecurringDto | null;
}

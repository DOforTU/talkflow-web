import { CreateEventDto, ResponseEvent, ResponseEventDto } from "../types/event.interface";
import apiClient from "./client";

export const eventApi = {
    // 본인 이벤트 조회
    getMyEvents: async (): Promise<ResponseEvent[]> => {
        const response = await apiClient.get(`api/events`);
        const responseEventsDto: ResponseEventDto[] = response.data.data;

        // 여기서 ResponseEvent[]로 변환
        const responseEvents: ResponseEvent[] = responseEventsDto.map((event) => ({
            ...event,
            startTime: event.startTime, // 이제 문자열 그대로 사용
            endTime: event.endTime, // 이제 문자열 그대로 사용
            createdAt: new Date(event.createdAt),
            updatedAt: new Date(event.updatedAt),
            deletedAt: event.deletedAt ? new Date(event.deletedAt) : null,
        }));

        return responseEvents;
    },

    createEvent: async (eventData: CreateEventDto): Promise<ResponseEvent> => {
        const response = await apiClient.post(`api/events`, eventData);
        const responseEventDto: ResponseEventDto = response.data.data;

        // 여기서 ResponseEvent로 변환
        const responseEvent: ResponseEvent = {
            ...responseEventDto,
            startTime: responseEventDto.startTime,
            endTime: responseEventDto.endTime,
            createdAt: new Date(responseEventDto.createdAt),
            updatedAt: new Date(responseEventDto.updatedAt),
            deletedAt: responseEventDto.deletedAt ? new Date(responseEventDto.deletedAt) : null,
        };

        return responseEvent;
    },
};

import { ResponseEvent, ResponseEventDto } from "../types/event.interface";
import apiClient from "./client";

export const eventApi = {
    // 본인 이벤트 조회
    getMyEvents: async (): Promise<ResponseEvent[]> => {
        const response = await apiClient.get(`api/events`);
        const responseEventsDto: ResponseEventDto[] = response.data.data;

        // 여기서 ResponseEvent[]로 변환
        const responseEvents: ResponseEvent[] = responseEventsDto.map((event) => ({
            ...event,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime),
            createdAt: new Date(event.createdAt),
            updatedAt: new Date(event.updatedAt),
            deletedAt: event.deletedAt ? new Date(event.deletedAt) : null,
        }));

        return responseEvents;
    },
};

import { CreateEventDto, ResponseEventDto, UpdateEventDto } from "../types/event.interface";
import apiClient from "./client";

export const eventApi = {
    // 본인 이벤트 조회
    getMyEvents: async (): Promise<ResponseEventDto[]> => {
        const response = await apiClient.get(`api/events`);
        return response.data.data;
    },

    createEvent: async (eventData: CreateEventDto): Promise<ResponseEventDto> => {
        const response = await apiClient.post(`api/events`, eventData);
        return response.data.data;
    },

    updateEvent: async (eventId: number, eventData: UpdateEventDto): Promise<ResponseEventDto> => {
        const response = await apiClient.patch(`api/events/${eventId}`, eventData);
        return response.data.data;
    },

    deleteSingleEvent: async (eventId: number): Promise<void> => {
        await apiClient.delete(`api/events/${eventId}`);
    },

    deleteRecurringEvents: async (eventId: number): Promise<void> => {
        await apiClient.delete(`api/events/${eventId}/recurring/all`);
    },
};

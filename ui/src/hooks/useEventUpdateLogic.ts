import { useState } from "react";
import {
    UpdateLocationDto,
    UpdateRecurringRuleDto,
    CreateEventDto,
    ResponseEventDto,
    UpdateEventDto,
} from "@/lib/types/event.interface";
import { eventApi } from "@/lib/api/event";

interface FormData {
    title: string;
    description: string;
    isAllDay: boolean;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    colorCode: string;
}

interface UseEventUpdateLogicProps {
    event: ResponseEventDto | null;
    formData: FormData;
    location: UpdateLocationDto | null;
    recurring: UpdateRecurringRuleDto | null;
    onEventUpdated: () => void;
    onClose: () => void;
    setShowUpdateOptionsModal: (show: boolean) => void;
    hasRecurringChanged: () => boolean;
}

export const useEventUpdateLogic = ({
    event,
    formData,
    location,
    recurring,
    onEventUpdated,
    onClose,
    setShowUpdateOptionsModal,
    hasRecurringChanged,
}: UseEventUpdateLogicProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helper: UpdateEventDto 생성
    const buildUpdateEventDto = (): UpdateEventDto => {
        let startTime, endTime;
        if (formData.isAllDay) {
            startTime = `${formData.startDate} 00:00`;
            endTime = `${formData.endDate} 23:59`;
        } else {
            startTime = `${formData.startDate} ${formData.startTime}`;
            endTime = `${formData.endDate} ${formData.endTime}`;
        }

        const updateEventDto: UpdateEventDto = {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            startTime,
            endTime,
            isAllDay: formData.isAllDay,
            colorCode: formData.colorCode,
        };

        // location 추가
        if (location) {
            updateEventDto.location = location;
        }

        // recurring 추가
        if (recurring) {
            updateEventDto.recurring = recurring;
        }

        return updateEventDto;
    };

    // Helper: CreateEventDto 생성
    const buildCreateEventDto = (): CreateEventDto => {
        let startTime, endTime;
        if (formData.isAllDay) {
            startTime = `${formData.startDate} 00:00`;
            endTime = `${formData.endDate} 23:59`;
        } else {
            startTime = `${formData.startDate} ${formData.startTime}`;
            endTime = `${formData.endDate} ${formData.endTime}`;
        }

        const createEventDto: CreateEventDto = {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            startTime,
            endTime,
            isAllDay: formData.isAllDay,
            colorCode: formData.colorCode,
        };

        // location 추가
        if (location) {
            createEventDto.location = {
                nameEn: location.nameEn,
                nameKo: location.nameKo,
                address: location.address || "",
                latitude: location.latitude || 0,
                longitude: location.longitude || 0,
            };
        }

        // recurring 추가
        if (recurring && recurring.rule && recurring.startDate) {
            createEventDto.recurring = {
                rule: recurring.rule,
                startDate: recurring.startDate,
                endDate: recurring.endDate,
            };
        }

        return createEventDto;
    };

    // Main submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!event) return;

        const wasRecurring = !!event.recurringEventId;
        const willBeRecurring = !!recurring && !!recurring.rule && !!recurring.startDate;

        if (!wasRecurring && !willBeRecurring) {
            // Case 1: 단일 → 단일
            await updateSingleEventDirectly();
        } else if (!wasRecurring && willBeRecurring) {
            // Case 2: 단일 → 반복
            await deleteAndCreateRecurringEvent();
        } else if (wasRecurring && !willBeRecurring) {
            // Case 3: 반복 → 단일
            await deleteRecurringAndCreateSingleEvent();
        } else {
            // Case 4: 반복 → 반복 (기본 동작: 관련 일정 모두 수정)
            await handleUpdateRecurring();
        }
    };

    // Case 1: 단일 → 단일
    const updateSingleEventDirectly = async () => {
        if (!event) return;

        setIsSubmitting(true);
        try {
            const updateEventDto = buildUpdateEventDto();
            await eventApi.updateEvent(event.id, updateEventDto);
            onEventUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to update single event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Case 2: 단일 → 반복
    const deleteAndCreateRecurringEvent = async () => {
        if (!event) return;

        setIsSubmitting(true);
        try {
            // 기존 단일 일정 삭제
            await eventApi.deleteSingleEvent(event.id);

            // 새로운 반복 일정 생성
            const createEventDto = buildCreateEventDto();
            await eventApi.createEvent(createEventDto);

            onEventUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to delete single and create recurring event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Case 3: 반복 → 단일
    const deleteRecurringAndCreateSingleEvent = async () => {
        if (!event) return;

        setIsSubmitting(true);
        try {
            // 기존 반복 일정 모두 삭제
            await eventApi.deleteRecurringEvents(event.id);

            // 새로운 단일 일정 생성
            const createEventDto = buildCreateEventDto();
            await eventApi.createEvent(createEventDto);

            onEventUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to delete recurring and create single event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Case 4,5: 반복 → 반복 업데이트 옵션별 처리
    const handleUpdateSingle = async () => {
        // "이 일정만 수정": updateSingleEvent 호출, recurringEventId => null로 변경
        if (!event) return;

        setIsSubmitting(true);
        try {
            const updateEventDto = buildUpdateEventDto();
            // 이 일정만 단일 이벤트로 변경 (recurringEventId를 null로 설정)
            await eventApi.updateEvent(event.id, updateEventDto);
            onEventUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to update single event from recurring:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateRecurring = async () => {
        // "관련 일정 모두 수정"
        if (!event) return;

        setIsSubmitting(true);
        try {
            const updateEventDto = buildUpdateEventDto();

            if (hasRecurringChanged()) {
                // 반복 패턴이 변경된 경우: 모두 삭제 후 새로 생성
                await eventApi.deleteRecurringEvents(event.id);
                const createEventDto = buildCreateEventDto();
                await eventApi.createEvent(createEventDto);
            } else {
                // 반복 패턴 변경 없음: 모든 관련 일정 업데이트
                await eventApi.updateRecurringEvents(event.id, updateEventDto);
            }

            onEventUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to update recurring events:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateFromThis = async () => {
        // "이 일정 이후 수정": 이 일정 이후 삭제 후 새로운 반복 일정 생성
        if (!event) return;

        setIsSubmitting(true);
        try {
            // 이 일정 이후의 모든 반복 일정 삭제
            await eventApi.deleteEventsFromThis(event.id);

            // 새로운 반복 일정 생성
            const createEventDto = buildCreateEventDto();
            await eventApi.createEvent(createEventDto);

            onEventUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to update events from this:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        handleSubmit,
        updateSingleEventDirectly,
        deleteAndCreateRecurringEvent,
        deleteRecurringAndCreateSingleEvent,
        handleUpdateSingle,
        handleUpdateRecurring,
        handleUpdateFromThis,
        isSubmitting,
    };
};

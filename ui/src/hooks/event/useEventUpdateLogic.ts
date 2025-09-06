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
    // TODO: 삭제 예정 - 미사용 파라미터
    handleRecurringFromThisApply?: (recurringData: any) => void;
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
    // TODO: 삭제 예정 - 미사용 파라미터
    handleRecurringFromThisApply,
}: UseEventUpdateLogicProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* 기본 일정 수정을 위한 UpdateEventDto 생성 (단일 → 단일 업데이트에 사용) */
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

    /* 새로운 일정 생성을 위한 CreateEventDto 생성 (단일 → 반복, 반복 → 단일, 반복 → 반복에 사용) */
    const buildCreateEventDto = (forceRecurringStartDate?: string): CreateEventDto => {
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
            let startDate = recurring.startDate;

            // forceRecurringStartDate가 있으면 무조건 그 값을 사용 ("이 일정 이후 수정"용)
            if (forceRecurringStartDate) {
                startDate = forceRecurringStartDate;
            }
            // formData.startDate가 이전일 경우에 formData.startDate 사용
            else if (new Date(formData.startDate) < new Date(recurring.startDate)) {
                startDate = formData.startDate;
            }

            createEventDto.recurring = {
                rule: recurring.rule,
                startDate: startDate,
                endDate: recurring.endDate,
            };
        }

        return createEventDto;
    };

    /* 메인 제출 핸들러: 이벤트 상태에 따라 적절한 업데이트 방식을 결정 */
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

    /* Case 1: 단일 일정 → 단일 일정 업데이트 (기존 단일 일정의 내용만 수정) */
    const updateSingleEventDirectly = async () => {
        if (!event) return;

        setIsSubmitting(true);
        try {
            // 단일 이벤트 업데이트하고 끝냄
            const updateEventDto = buildUpdateEventDto();
            await eventApi.updateSingleEvent(event.id, updateEventDto);
            onEventUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to update single event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* Case 2: 단일 일정 → 반복 일정 변환 (기존 단일 일정 삭제 후 반복 일정 생성) */
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

    /* Case 3: 반복 일정 → 단일 일정 변환 (모든 반복 일정 삭제 후 단일 일정 생성) */
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

    /** Case 4: 반복 -> 반복 */
    /* "이 일정만 수정" 옵션: 선택된 반복 일정 하나만 단일 일정으로 변환하여 수정 */
    const handleUpdateSingle = async () => {
        if (!event) return;

        setIsSubmitting(true);
        try {
            const updateEventDto = buildUpdateEventDto();
            // 이 일정만 단일 이벤트로 변경 (recurringEventId를 null로 설정)
            await eventApi.updateSingleEvent(event.id, updateEventDto);
            onEventUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to update single event from recurring:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* "관련 일정 모두 수정" 옵션: 모든 반복 일정을 삭제하고 새로운 설정으로 반복 일정 재생성 */
    const handleUpdateRecurring = async () => {
        if (!event) return;

        setIsSubmitting(true);
        try {
            // 관련 일정 모두 삭제 후 새로 생성
            await eventApi.deleteRecurringEvents(event.id);
            const createEventDto = buildCreateEventDto();
            await eventApi.createEvent(createEventDto);

            onEventUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to update recurring events:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* "이 일정 이후 수정" 옵션: 선택된 일정 이후의 모든 반복 일정을 삭제하고 새로운 설정으로 재생성 */
    const handleUpdateFromThis = async () => {
        if (!event || !recurring) return;

        setIsSubmitting(true);
        try {
            // 이 일정 이후의 모든 반복 일정 삭제
            await eventApi.deleteEventsFromThis(event.id);

            // 현재 이벤트 날짜를 추출하여 직접 전달
            const [startDateStr] = event.startTime.split(" ");

            // 새로운 반복 일정 생성 (현재 이벤트 날짜를 시작 날짜로 강제 적용)
            const createEventDto = buildCreateEventDto(startDateStr);
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
        // TODO: 삭제 예정 - 미사용 함수들 (내부에서만 사용됨)
        updateSingleEventDirectly,
        deleteAndCreateRecurringEvent,
        deleteRecurringAndCreateSingleEvent,
        handleUpdateSingle,
        handleUpdateRecurring,
        handleUpdateFromThis,
        isSubmitting,
    };
};

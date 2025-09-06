import { useState } from "react";
import {
    CreateLocationDto,
    CreateRecurringRuleDto,
    CreateEventDto,
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

interface UseEventCreateLogicProps {
    formData: FormData;
    location: CreateLocationDto | null;
    recurring: CreateRecurringRuleDto | null;
    onEventCreated: () => void;
    onClose: () => void;
}

export const useEventCreateLogic = ({
    formData,
    location,
    recurring,
    onEventCreated,
    onClose,
}: UseEventCreateLogicProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            createEventDto.location = location;
        }

        // recurring 추가
        if (recurring && recurring.rule && recurring.startDate) {
            let startDate = recurring.startDate;

            // formData.startDate가 이전일 경우에 formData.startDate 사용
            if (new Date(formData.startDate) < new Date(recurring.startDate)) {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) return;

        setIsSubmitting(true);

        try {
            const createEventDto = buildCreateEventDto();
            await eventApi.createEvent(createEventDto);
            onEventCreated();
            onClose();
        } catch (error) {
            console.error("Failed to create event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        handleSubmit,
        isSubmitting,
    };
};
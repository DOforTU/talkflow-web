import { useState, useEffect } from "react";
import {
    UpdateLocationDto,
    UpdateRecurringRuleDto,
    CreateLocationDto,
    CreateRecurringRuleDto,
    ResponseEventDto,
    ResponseRecurringEventDto,
} from "@/lib/types/event.interface";
import { eventApi } from "@/lib/api/event";
import { COLOR_OPTIONS } from "@/lib/utils/eventFormUtils";

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

interface UseUpdateEventFormProps {
    event: ResponseEventDto | null;
    isOpen: boolean;
}

export const useUpdateEventForm = ({ event, isOpen }: UseUpdateEventFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        isAllDay: false,
        startDate: new Date().toISOString().split("T")[0],
        startTime: "10:00",
        endDate: new Date().toISOString().split("T")[0],
        endTime: "12:00",
        colorCode: COLOR_OPTIONS[0],
    });

    const [location, setLocation] = useState<UpdateLocationDto | null>(null);
    const [recurring, setRecurring] = useState<UpdateRecurringRuleDto | null>(null);
    const [recurringEventData, setRecurringEventData] = useState<ResponseRecurringEventDto | null>(null);

    // 모달 상태들
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showRecurringModal, setShowRecurringModal] = useState(false);

    useEffect(() => {
        if (event) {
            // isOpen 조건 제거
            // 시간대 변환 문제를 피하기 위해 문자열 직접 파싱
            const [startDateStr, startTimeStr] = event.startTime.split(" ");
            const [endDateStr, endTimeStr] = event.endTime.split(" ");

            setFormData({
                title: event.title,
                description: event.description || "",
                isAllDay: event.isAllDay,
                startDate: startDateStr, // 직접 날짜 문자열 사용
                startTime: event.isAllDay ? "10:00" : startTimeStr,
                endDate: endDateStr, // 직접 날짜 문자열 사용
                endTime: event.isAllDay ? "12:00" : endTimeStr,
                colorCode: event.colorCode,
            });

            // 업데이트 요청을 보내기 위해서 Response Type -> Update DTO Type으로 변환
            if (event.location) {
                setLocation({
                    nameEn: event.location.nameEn || undefined,
                    nameKo: event.location.nameKo || undefined,
                    address: event.location.address,
                    latitude: event.location.latitude,
                    longitude: event.location.longitude,
                });
            } else {
                setLocation(null);
            }

            // recurringEventId가 있는 경우에만 반복 일정 데이터 조회
            if (event.recurringEventId) {
                eventApi
                    .getRecurringEventById(event.recurringEventId)
                    .then((data) => {
                        setRecurringEventData(data);
                        setRecurring({
                            rule: data.rule,
                            startDate: data.startDate,
                            endDate: data.endDate || undefined,
                        });
                    })
                    .catch((error) => {
                        console.error("Failed to fetch recurring event:", error);
                        setRecurringEventData(null);
                        setRecurring(null);
                    });
            } else {
                setRecurringEventData(null);
                setRecurring(null);
            }
        }
    }, [event]); // isOpen 제거

    const updateFormData = (field: string, value: string | boolean) => {
        setFormData((prev) => {
            const newData = { ...prev, [field]: value };

            // 끝나는 시간이 시작 시간보다 빠르지 않도록 조정
            if (field === "startDate" || field === "startTime" || field === "endDate" || field === "endTime") {
                const startDateTime = new Date(`${newData.startDate}T${newData.startTime}`);
                const endDateTime = new Date(`${newData.endDate}T${newData.endTime}`);

                if (endDateTime <= startDateTime) {
                    // 끝 시간이 시작 시간보다 빠르면, 끝 시간을 시작 시간과 같도록 설정
                    newData.endDate = newData.startDate;
                    newData.endTime = newData.startTime;
                }
            }

            return newData;
        });
    };

    const selectColor = (color: string) => {
        updateFormData("colorCode", color);
    };

    const handleLocationAdd = (locationData: CreateLocationDto) => {
        // CreateLocationDto를 UpdateLocationDto로 변환
        const updateLocationData: UpdateLocationDto = {
            nameEn: locationData.nameEn,
            nameKo: locationData.nameKo,
            address: locationData.address,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
        };
        setLocation(updateLocationData);
        setShowLocationModal(false);
    };

    const handleLocationRemove = () => {
        setLocation(null);
    };

    const handleRecurringApply = (recurringData: CreateRecurringRuleDto) => {
        // CreateRecurringRuleDto를 UpdateRecurringRuleDto로 변환
        const updateRecurringData: UpdateRecurringRuleDto = {
            rule: recurringData.rule,
            startDate: recurringData.startDate,
            endDate: recurringData.endDate,
        };
        setRecurring(updateRecurringData);
        setShowRecurringModal(false);
    };

    const handleRecurringRemove = () => {
        setRecurring(null);
    };

    // recurring 데이터가 변경되었는지 확인
    const hasRecurringChanged = () => {
        if (!recurring && !recurringEventData) return false;
        if (!recurring || !recurringEventData) return true;

        return (
            recurring.rule !== recurringEventData.rule ||
            recurring.startDate !== recurringEventData.startDate ||
            recurring.endDate !== (recurringEventData.endDate || undefined)
        );
    };

    const resetForm = () => {
        const today = new Date().toISOString().split("T")[0];
        setFormData({
            title: "",
            description: "",
            isAllDay: false,
            startDate: today,
            startTime: "10:00",
            endDate: today,
            endTime: "12:00",
            colorCode: COLOR_OPTIONS[0],
        });
        setLocation(null);
        setRecurring(null);
        setRecurringEventData(null);
    };

    return {
        formData,
        location,
        recurring,
        recurringEventData,
        showLocationModal,
        showRecurringModal,
        setShowLocationModal,
        setShowRecurringModal,
        updateFormData,
        selectColor,
        handleLocationAdd,
        handleLocationRemove,
        handleRecurringApply,
        handleRecurringRemove,
        hasRecurringChanged,
        resetForm,
    };
};

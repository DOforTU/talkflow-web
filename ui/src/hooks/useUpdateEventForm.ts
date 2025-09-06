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

    /* 폼 데이터 업데이트: 시작/종료 시간 유효성 검사 및 자동 조정 포함 */
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

    /* 일정 색상 선택: 선택된 색상을 formData에 적용 */
    const selectColor = (color: string) => {
        updateFormData("colorCode", color);
    };

    /* 위치 추가: CreateLocationDto를 UpdateLocationDto로 변환하여 저장 */
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

    /* 위치 제거: 일정에서 위치 정보 삭제 */
    const handleLocationRemove = () => {
        setLocation(null);
    };

    /* 반복 일정 적용: "관련 일정 모두 수정" 옵션에서 사용
     * 기존 recurring.startDate가 recurringData.startDate보다 이전일 경우에만 기존 startDate 유지하여 전체 반복 범위 보존 */
    const handleRecurringApply = (recurringData: CreateRecurringRuleDto) => {
        // 기존 recurring.startDate가 recurringData.startDate보다 이전일 경우에만 기존 startDate 사용
        let startDate = recurringData.startDate;
        if (recurring && recurring.startDate && new Date(recurring.startDate) < new Date(recurringData.startDate)) {
            startDate = recurring.startDate;
        }

        const updateRecurringData: UpdateRecurringRuleDto = {
            rule: recurringData.rule,
            startDate: startDate,
            endDate: recurringData.endDate,
        };
        setRecurring(updateRecurringData);
        setShowRecurringModal(false);
    };

    /* 반복 일정 "이 일정 이후 수정" 적용: "이 일정 이후 수정" 옵션에서 사용
     * recurringData.startDate를 그대로 사용하여 현재 선택된 날짜부터 새로운 반복 일정 시작 */
    const handleRecurringFromThisApply = (recurringData: CreateRecurringRuleDto) => {
        const updateRecurringData: UpdateRecurringRuleDto = {
            rule: recurringData.rule,
            startDate: recurringData.startDate,
            endDate: recurringData.endDate,
        };
        setRecurring(updateRecurringData);
        setShowRecurringModal(false);
    };

    /* 반복 일정 제거: 반복 설정을 null로 설정하여 단일 일정으로 변환 */
    const handleRecurringRemove = () => {
        setRecurring(null);
    };

    /* 반복 설정 변경 여부 확인: 기존 반복 데이터와 현재 설정 비교 */
    const hasRecurringChanged = () => {
        if (!recurring && !recurringEventData) return false;
        if (!recurring || !recurringEventData) return true;

        return (
            recurring.rule !== recurringEventData.rule ||
            recurring.startDate !== recurringEventData.startDate ||
            recurring.endDate !== (recurringEventData.endDate || undefined)
        );
    };

    /* 폼 재설정: 모든 입력 값을 초기값으로 되돌림 */
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
        handleRecurringFromThisApply,
        handleRecurringRemove,
        hasRecurringChanged,
        resetForm,
    };
};

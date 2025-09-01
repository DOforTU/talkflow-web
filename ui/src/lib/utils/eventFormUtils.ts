/**
 * 폼 관련 공통 유틸리티 함수들
 */

/**
 * 색상 옵션 상수
 */
export const COLOR_OPTIONS = [
    "#EC4899", // Pink
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#06B6D4", // Cyan
    "#64748B", // Slate
];

/**
 * 반복 규칙을 사용자 친화적인 문자열로 변환
 */
export const formatRecurringRule = (rrule: string | undefined): string => {
    if (!rrule) return "사용자 지정";
    if (rrule.includes("DAILY")) return "매일";
    if (rrule.includes("WEEKLY")) return "매주";
    if (rrule.includes("MONTHLY")) return "매월";
    if (rrule.includes("YEARLY")) return "매년";
    return "사용자 지정";
};

/**
 * 시간 검증: 끝나는 시간이 시작 시간보다 빠르지 않도록 조정
 */
export const validateAndAdjustDateTime = (formData: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
}): { endDate: string; endTime: string } => {
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (endDateTime <= startDateTime) {
        // 끝 시간이 시작 시간보다 빠르면, 끝 시간을 시작 시간과 같도록 설정
        return {
            endDate: formData.startDate,
            endTime: formData.startTime,
        };
    }

    return {
        endDate: formData.endDate,
        endTime: formData.endTime,
    };
};

/**
 * 기본 폼 데이터 생성
 */
export const createDefaultFormData = (dateString: string) => ({
    title: "",
    description: "",
    isAllDay: false,
    startDate: dateString,
    startTime: "10:00",
    endDate: dateString,
    endTime: "12:00",
    colorCode: COLOR_OPTIONS[0],
});

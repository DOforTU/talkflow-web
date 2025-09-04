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
    console.log('formatRecurringRule - input rrule:', rrule);
    if (!rrule) return "사용자 지정";
    
    // 기본 패턴 확인
    let basePattern = "";
    if (rrule.includes("FREQ=DAILY")) {
        basePattern = "매일";
    } else if (rrule.includes("FREQ=WEEKLY")) {
        // BYDAY가 있는지 확인
        const bydayMatch = rrule.match(/BYDAY=([^;]+)/);
        if (bydayMatch) {
            const days = bydayMatch[1].split(',');
            const dayMap: { [key: string]: string } = {
                'SU': '일', 'MO': '월', 'TU': '화', 'WE': '수', 
                'TH': '목', 'FR': '금', 'SA': '토'
            };
            
            // 모든 요일이 포함된 경우 "매일"
            if (days.length === 7) {
                basePattern = "매일";
            } else if (days.length === 1) {
                // 단일 요일
                const dayName = dayMap[days[0].trim()];
                basePattern = `매주 ${dayName}요일`;
            } else {
                // 여러 요일
                const dayNames = days.map(day => dayMap[day.trim()]).join(', ');
                basePattern = `매주 ${dayNames}요일`;
            }
        } else {
            basePattern = "매주";
        }
    } else if (rrule.includes("FREQ=MONTHLY")) {
        basePattern = "매월";
    } else if (rrule.includes("FREQ=YEARLY")) {
        basePattern = "매년";
    }
    
    // 기본 패턴이 없으면 사용자 지정
    if (!basePattern) return "사용자 지정";
    
    // UNTIL 날짜가 있으면 종료일 표시
    const untilMatch = rrule.match(/UNTIL=(\d{8})/);
    if (untilMatch) {
        const untilDateStr = untilMatch[1];
        const year = untilDateStr.substring(0, 4);
        const month = untilDateStr.substring(4, 6);
        const day = untilDateStr.substring(6, 8);
        return `${basePattern} (${year}.${month}.${day}까지)`;
    }
    
    return basePattern;
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

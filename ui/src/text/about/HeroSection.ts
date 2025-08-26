export interface HeroSectionTexts {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    tryFreeButton: string;
    aboutButton: string;
    voiceInputLabel: string;
    textInputLabel: string;
    demoInputText: string;
    dateLabel: string;
    dateValue: string;
    todoLabel: string;
    todoValue: string;
    locationLabel: string;
    locationValue: string;
}

export const heroSectionTexts: Record<"ENG" | "KOR", HeroSectionTexts> = {
    ENG: {
        titleLine1: "Shape Your Silhouette. ",
        titleLine2: "Share Your Silhouette.",
        subtitle:
            "The smart planner that adapts to you. Speak naturally or type freely — Silhouette understands both and creates perfect schedules with location optimization.",
        tryFreeButton: "Try Free Now",
        aboutButton: "Pricing Plan",
        voiceInputLabel: "Voice Input",
        textInputLabel: "Text Input",
        demoInputText: "Coffee with Sarah tomorrow at 3pm at Cafe in Gangnam",
        dateLabel: "Date:",
        dateValue: "Tomorrow, 3:00 PM",
        todoLabel: "TODO:",
        todoValue: "Drinking Coffee with Sarah",
        locationLabel: "Location:",
        locationValue: "Cafe in Gangnam",
    },
    KOR: {
        titleLine1: "당신의 실루엣을",
        titleLine2: "계획하고 남겨보세요.",
        subtitle:
            "당신에게 맞춰 적응하는 스마트 플래너입니다. 자연스럽게 말하거나 자유롭게 타이핑하세요. 실루엣이 모두 이해하고 위치 최적화와 함께 완벽한 일정을 만들어드립니다.",
        tryFreeButton: "무료로 시작하기",
        aboutButton: "가격 보기",
        voiceInputLabel: "음성 입력",
        textInputLabel: "텍스트 입력",
        demoInputText: "내일 3시에 강남 카페에서 사라와 커피 마시기",
        dateLabel: "일시:",
        dateValue: "내일, 오후 3:00",
        todoLabel: "할일:",
        todoValue: "사라와 커피 마시기",
        locationLabel: "장소:",
        locationValue: "강남 카페",
    },
};

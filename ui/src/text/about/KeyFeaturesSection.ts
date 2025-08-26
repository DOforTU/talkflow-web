export interface KeyFeaturesSectionTexts {
    title: string;
    subtitle: string;
    features: {
        planning: {
            title: string;
            description: string;
            items: string[];
        };
        routes: {
            title: string;
            description: string;
            items: string[];
        };
        expenses: {
            title: string;
            description: string;
            items: string[];
        };
        sharing: {
            title: string;
            description: string;
            items: string[];
        };
    };
}

export const keyFeaturesSectionTexts: Record<"ENG" | "KOR", KeyFeaturesSectionTexts> = {
    ENG: {
        title: "Plan Your Silhouette.",
        subtitle: "You can make your day more productive and enjoyable.",
        features: {
            planning: {
                title: "Plan Your Silhouette",
                description:
                    "Create your perfect schedule with both text and voice input. Plan your day naturally with our intelligent scheduling system.",
                items: ["Voice-powered scheduling", "Text input supported", "Smart time management"],
            },
            routes: {
                title: "Visual Route Planning",
                description:
                    "Set locations for your schedule items and visualize your daily route at a glance. Never miss an appointment or waste time on inefficient routes.",
                items: ["Location-based scheduling", "Route optimization", "Travel time estimates"],
            },
            expenses: {
                title: "Expense Tracking",
                description:
                    "Add costs to your schedule items and manage your spending seamlessly. Track expenses in real-time and maintain your budget effortlessly.",
                items: ["Schedule-integrated expenses", "Budget management tools", "Spending analytics"],
            },
            sharing: {
                title: "Record Your Silhouette",
                description:
                    "Share your daily moments with photos or 15-second videos. Get spontaneous sharing opportunities through random notifications - up to 2 shares per day.",
                items: ["Photo & video sharing", "Random notification prompts", "Limited daily shares"],
            },
        },
    },
    KOR: {
        title: "당신의 실루엣을 계획하세요.",
        subtitle: "더 생산적이고 즐거운 하루를 만들어보세요.",
        features: {
            planning: {
                title: "실루엣 계획하기",
                description:
                    "텍스트와 음성 입력 모두로 완벽한 일정을 만들어보세요. 지능적인 스케줄링 시스템으로 자연스럽게 하루를 계획하세요.",
                items: ["음성 기반 일정 관리", "텍스트 입력 지원", "스마트 시간 관리"],
            },
            routes: {
                title: "시각적 경로 계획",
                description:
                    "일정 항목에 위치를 설정하고 일일 동선을 한눈에 시각화하세요. 약속을 놓치지 않고 비효율적인 경로로 시간을 낭비하지 마세요.",
                items: ["위치 기반 스케줄링", "경로 최적화", "이동 시간 예측"],
            },
            expenses: {
                title: "지출 추적",
                description:
                    "일정 항목에 비용을 추가하고 지출을 원활하게 관리하세요. 실시간으로 지출을 추적하고 예산을 쉽게 유지하세요.",
                items: ["일정 연동 지출 관리", "예산 관리 도구", "지출 분석"],
            },
            sharing: {
                title: "실루엣 남기기",
                description:
                    "사진이나 15초 동영상으로 일상의 순간들을 공유하세요. 랜덤 알림을 통한 자연스러운 공유 기회 - 하루 최대 2회.",
                items: ["사진 및 동영상 공유", "랜덤 알림 프롬프트", "일일 공유 제한"],
            },
        },
    },
};

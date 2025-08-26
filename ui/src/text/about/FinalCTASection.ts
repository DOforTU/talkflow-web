export interface FinalCTASectionTexts {
    title: {
        main: string;
        accent: string;
    };
    subtitle: string;
    features: {
        voiceText: string;
        routePlanning: string;
        expenseTracking: string;
        momentSharing: string;
    };
    ctaButton: string;
    ctaSubtext: string;
    socialProof: {
        activeUsers: {
            number: string;
            label: string;
        };
        appRating: {
            number: string;
            label: string;
        };
        satisfaction: {
            number: string;
            label: string;
        };
    };
    finalMessage: string;
}

export const finalCTASectionTexts: Record<"ENG" | "KOR", FinalCTASectionTexts> = {
    ENG: {
        title: {
            main: "Ready to Create Your",
            accent: " Silhouette",
        },
        subtitle: "Join thousands who are already living more organized, productive lives",
        features: {
            voiceText: "Voice & Text Planning",
            routePlanning: "Smart Route Planning",
            expenseTracking: "Expense Tracking",
            momentSharing: "Moment Sharing",
        },
        ctaButton: "Start Your Journey",
        ctaSubtext: "Free to start • No credit card required",
        socialProof: {
            activeUsers: {
                number: "10K+",
                label: "Active Users",
            },
            appRating: {
                number: "4.9★",
                label: "App Rating",
            },
            satisfaction: {
                number: "99%",
                label: "Satisfaction",
            },
        },
        finalMessage: "Your perfect day is just one silhouette away",
    },
    KOR: {
        title: {
            main: "당신의",
            accent: " 실루엣을 만들어보세요",
        },
        subtitle: "이미 더 체계적이고 생산적인 삶을 살고 있는 수천 명과 함께하세요",
        features: {
            voiceText: "음성 & 텍스트 플래닝",
            routePlanning: "스마트 경로 계획",
            expenseTracking: "지출 추적",
            momentSharing: "순간 공유",
        },
        ctaButton: "여행을 시작하세요",
        ctaSubtext: "무료로 시작 • 신용카드 필요 없음",
        socialProof: {
            activeUsers: {
                number: "10K+",
                label: "활성 사용자",
            },
            appRating: {
                number: "4.9★",
                label: "앱 평점",
            },
            satisfaction: {
                number: "99%",
                label: "만족도",
            },
        },
        finalMessage: "완벽한 하루는 하나의 실루엣 차이입니다",
    },
};

export interface FinalCTASectionTexts {
    title: {
        line1: string;
        line2: string;
    };
    subtitle: string;
    benefits: {
        timeSaver: {
            title: string;
            text: string;
        };
        voiceFreedom: {
            title: string;
            text: string;
        };
        aiLearning: {
            title: string;
            text: string;
        };
    };
    buttons: {
        primary: string;
        secondary: string;
    };
    trustIndicators: string[];
}

export const finalCTASectionTexts: Record<"ENG" | "KOR", FinalCTASectionTexts> = {
    ENG: {
        title: {
            line1: "Ready to Transform",
            line2: "Your Planning?"
        },
        subtitle: "Join thousands of users who've already discovered the power of hybrid voice and text planning. Start your journey to effortless scheduling today.",
        benefits: {
            timeSaver: {
                title: "Save 30+ Minutes Daily",
                text: "Smart route optimization and AI assistance"
            },
            voiceFreedom: {
                title: "Voice + Text Freedom",
                text: "Adapt to any situation seamlessly"
            },
            aiLearning: {
                title: "AI That Learns",
                text: "Smarter suggestions over time"
            }
        },
        buttons: {
            primary: "Start Free Today",
            secondary: "Watch Demo First"
        },
        trustIndicators: [
            "No credit card required",
            "Setup in under 2 minutes",
            "Cancel anytime"
        ]
    },
    KOR: {
        title: {
            line1: "일정 관리를",
            line2: "혁신할 준비가 되셨나요?"
        },
        subtitle: "하이브리드 음성 및 텍스트 플래닝의 힘을 이미 발견한 수천 명의 사용자와 함께하세요. 오늘 손쉬운 일정 관리 여정을 시작하세요.",
        benefits: {
            timeSaver: {
                title: "매일 30분 이상 절약",
                text: "스마트 경로 최적화와 AI 어시스턴트"
            },
            voiceFreedom: {
                title: "음성 + 텍스트 자유도",
                text: "어떤 상황에도 원활하게 적응"
            },
            aiLearning: {
                title: "학습하는 AI",
                text: "시간이 지날수록 더 똑똑한 제안"
            }
        },
        buttons: {
            primary: "오늘 무료로 시작하기",
            secondary: "먼저 데모 보기"
        },
        trustIndicators: [
            "신용카드 필요 없음",
            "2분 이내 설정 완료",
            "언제든 취소 가능"
        ]
    }
};
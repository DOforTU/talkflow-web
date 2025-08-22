export interface PricingTeaserSectionTexts {
    title: string;
    subtitle: string;
    plans: {
        free: {
            name: string;
            amount: string;
            period: string;
            description: string;
            ctaButton: string;
            features: string[];
        };
        premium: {
            name: string;
            amount: string;
            period: string;
            description: string;
            ctaButton: string;
            popularBadge: string;
            features: string[];
        };
    };
    bottom: {
        title: string;
        text: string;
        button: string;
    };
    trustIndicators: string[];
}

export const pricingTeaserSectionTexts: Record<"ENG" | "KOR", PricingTeaserSectionTexts> = {
    ENG: {
        title: "Simple, Transparent Pricing",
        subtitle: "Start free and upgrade when you're ready for advanced AI features. No hidden fees, cancel anytime.",
        plans: {
            free: {
                name: "Free Plan",
                amount: "$0",
                period: "/month",
                description: "Perfect for getting started",
                ctaButton: "Get Started Free",
                features: [
                    "<strong>50</strong> voice-created schedules per month",
                    "<strong>Unlimited</strong> text input schedules",
                    "Basic Google Maps integration",
                    "Conflict detection",
                    "PWA mobile experience"
                ]
            },
            premium: {
                name: "Premium Plan",
                amount: "$7.99",
                period: "/month",
                description: "For power users & professionals",
                ctaButton: "Start 7-Day Free Trial",
                popularBadge: "Most Popular",
                features: [
                    "<strong>Unlimited</strong> schedules (voice & text)",
                    "<strong>Advanced AI</strong> with context memory",
                    "<strong>Smart route optimization</strong> & travel time",
                    "<strong>Pattern-based suggestions</strong>",
                    "<strong>Analytics & insights</strong>",
                    "<strong>Priority support</strong>"
                ]
            }
        },
        bottom: {
            title: "Not sure which plan is right for you?",
            text: "Compare all features, see detailed pricing information, and find the perfect plan for your needs.",
            button: "View Detailed Pricing"
        },
        trustIndicators: [
            "No setup fees",
            "Cancel anytime",
            "7-day free trial"
        ]
    },
    KOR: {
        title: "간단하고 투명한 가격",
        subtitle: "무료로 시작하고 고급 AI 기능이 필요할 때 업그레이드하세요. 숨겨진 요금 없음, 언제든 취소 가능.",
        plans: {
            free: {
                name: "무료 플랜",
                amount: "$0",
                period: "/월",
                description: "시작하기에 완벽",
                ctaButton: "무료로 시작하기",
                features: [
                    "월 <strong>50개</strong> 음성 생성 일정",
                    "<strong>무제한</strong> 텍스트 입력 일정",
                    "기본 Google Maps 연동",
                    "충돌 감지",
                    "PWA 모바일 경험"
                ]
            },
            premium: {
                name: "프리미엄 플랜",
                amount: "$7.99",
                period: "/월",
                description: "파워 유저 & 전문가용",
                ctaButton: "7일 무료 체험 시작",
                popularBadge: "가장 인기",
                features: [
                    "<strong>무제한</strong> 일정 (음성 & 텍스트)",
                    "상황 기억 기능의 <strong>고급 AI</strong>",
                    "<strong>스마트 경로 최적화</strong> & 이동 시간",
                    "<strong>패턴 기반 제안</strong>",
                    "<strong>분석 & 인사이트</strong>",
                    "<strong>우선 지원</strong>"
                ]
            }
        },
        bottom: {
            title: "어떤 플랜이 맞는지 확실하지 않으신가요?",
            text: "모든 기능을 비교하고, 자세한 가격 정보를 확인하며, 필요에 완벽한 플랜을 찾아보세요.",
            button: "자세한 가격 보기"
        },
        trustIndicators: [
            "설치 비용 없음",
            "언제든 취소 가능",
            "7일 무료 체험"
        ]
    }
};
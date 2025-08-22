export interface KeyFeaturesSectionTexts {
    title: string;
    subtitle: string;
    features: {
        hybrid: {
            title: string;
            description: string;
            items: string[];
            learnMore: string;
        };
        ai: {
            title: string;
            description: string;
            items: string[];
            learnMore: string;
        };
        location: {
            title: string;
            description: string;
            items: string[];
            learnMore: string;
        };
    };
    ctaButton: string;
}

export const keyFeaturesSectionTexts: Record<"ENG" | "KOR", KeyFeaturesSectionTexts> = {
    ENG: {
        title: "Why SayPlan Changes Everything",
        subtitle: "Three powerful features that make planning effortless, intelligent, and perfectly adapted to your lifestyle.",
        features: {
            hybrid: {
                title: "Hybrid Voice & Text",
                description: "The first planner that truly adapts to how you want to communicate. Speak when you're on the go, type when you need precision.",
                items: [
                    "Natural speech recognition with 95%+ accuracy",
                    "Seamless fallback to text input when needed",
                    "Context-aware parsing for both input methods"
                ],
                learnMore: "Learn More →"
            },
            ai: {
                title: "AI-Powered Intelligence",
                description: "Advanced AI that understands context, learns your patterns, and transforms natural language into perfect schedules.",
                items: [
                    "Automatic time, date, and location extraction",
                    "Smart conflict detection and resolution",
                    "Context memory for personalized suggestions"
                ],
                learnMore: "Learn More →"
            },
            location: {
                title: "Smart Location & Routes",
                description: "Integrated Google Maps intelligence that optimizes your daily routes and saves you time with smart travel planning.",
                items: [
                    "Automatic address recognition and mapping",
                    "Daily route optimization for efficiency",
                    "Real-time travel time calculations"
                ],
                learnMore: "Learn More →"
            }
        },
        ctaButton: "Explore All Features"
    },
    KOR: {
        title: "SayPlan이 모든 것을 바꾸는 이유",
        subtitle: "계획을 손쉽고 지능적으로 만들어주며 당신의 라이프스타일에 완벽하게 적응하는 세 가지 강력한 기능.",
        features: {
            hybrid: {
                title: "하이브리드 음성 & 텍스트",
                description: "소통 방식에 진정으로 적응하는 최초의 플래너. 이동 중에는 음성으로, 정확성이 필요할 때는 타이핑으로.",
                items: [
                    "95% 이상의 정확도를 가진 자연 음성 인식",
                    "필요시 텍스트 입력으로 원활한 전환",
                    "두 입력 방식 모두를 위한 상황 인식 파싱"
                ],
                learnMore: "더 알아보기 →"
            },
            ai: {
                title: "AI 기반 지능",
                description: "맥락을 이해하고 패턴을 학습하여 자연어를 완벽한 일정으로 변환하는 고급 AI.",
                items: [
                    "시간, 날짜, 위치 자동 추출",
                    "스마트 충돌 감지 및 해결",
                    "개인화된 제안을 위한 상황 기억"
                ],
                learnMore: "더 알아보기 →"
            },
            location: {
                title: "스마트 위치 & 경로",
                description: "일상 경로를 최적화하고 스마트 여행 계획으로 시간을 절약해주는 통합 Google Maps 지능.",
                items: [
                    "자동 주소 인식 및 매핑",
                    "효율성을 위한 일일 경로 최적화",
                    "실시간 이동 시간 계산"
                ],
                learnMore: "더 알아보기 →"
            }
        },
        ctaButton: "모든 기능 살펴보기"
    }
};
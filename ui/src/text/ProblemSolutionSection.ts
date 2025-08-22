export interface ProblemSolutionSectionTexts {
    title: string;
    subtitle: string;
    problemTitle: string;
    solutionTitle: string;
    problems: {
        switching: {
            title: string;
            description: string;
        };
        rigid: {
            title: string;
            description: string;
        };
        manual: {
            title: string;
            description: string;
        };
    };
    solutions: {
        allInOne: {
            title: string;
            description: string;
        };
        hybrid: {
            title: string;
            description: string;
        };
        smart: {
            title: string;
            description: string;
        };
    };
}

export const problemSolutionSectionTexts: Record<"ENG" | "KOR", ProblemSolutionSectionTexts> = {
    ENG: {
        title: "Planning Shouldn't Be This Hard",
        subtitle: "We've all been there — juggling multiple apps, struggling with rigid interfaces, and wasting time on manual scheduling.",
        problemTitle: "The Problem",
        solutionTitle: "Our Solution",
        problems: {
            switching: {
                title: "Switching Between Apps",
                description: "Calendar app, notes app, maps app — why can't it all be in one place?"
            },
            rigid: {
                title: "Rigid Input Methods",
                description: "Sometimes you want to quickly speak your schedule, sometimes you need to type quietly."
            },
            manual: {
                title: "Manual Route Planning",
                description: "Calculating travel time and optimizing your daily route shouldn't be your job."
            }
        },
        solutions: {
            allInOne: {
                title: "All-in-One Platform",
                description: "Schedule, location mapping, and AI assistance — everything you need in one place."
            },
            hybrid: {
                title: "Hybrid Input Freedom",
                description: "Speak when you're driving, type when you're in a meeting. We adapt to your situation."
            },
            smart: {
                title: "Smart Route Optimization",
                description: "AI automatically organizes your day for maximum efficiency and minimal travel time."
            }
        }
    },
    KOR: {
        title: "일정 관리가 이렇게 어려울 이유는 없습니다",
        subtitle: "우리 모두 경험해봤습니다 — 여러 앱을 오가며, 경직된 인터페이스와 씨름하고, 수동 일정 조정에 시간을 낭비하는 것을.",
        problemTitle: "문제점",
        solutionTitle: "우리의 해결책",
        problems: {
            switching: {
                title: "앱 간 이동의 번거로움",
                description: "캘린더 앱, 메모 앱, 지도 앱 — 왜 모든 것을 한 곳에서 할 수 없을까요?"
            },
            rigid: {
                title: "경직된 입력 방식",
                description: "때로는 빠르게 음성으로 일정을 말하고 싶고, 때로는 조용히 타이핑해야 할 때가 있습니다."
            },
            manual: {
                title: "수동 경로 계획",
                description: "이동 시간 계산과 하루 일정 최적화는 당신이 할 일이 아닙니다."
            }
        },
        solutions: {
            allInOne: {
                title: "올인원 플랫폼",
                description: "일정 관리, 위치 매핑, AI 어시스턴트 — 필요한 모든 것을 한 곳에서."
            },
            hybrid: {
                title: "하이브리드 입력 자유도",
                description: "운전할 때는 음성으로, 회의 중일 때는 타이핑으로. 상황에 맞춰 적응합니다."
            },
            smart: {
                title: "스마트 경로 최적화",
                description: "AI가 자동으로 하루를 최대 효율성과 최소 이동 시간으로 구성합니다."
            }
        }
    }
};
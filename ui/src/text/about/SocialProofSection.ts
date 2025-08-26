export interface SocialProofSectionTexts {
    title: string;
    subtitle: string;
    stats: {
        activeUsers: string;
        schedules: string;
        voiceAccuracy: string;
        userRating: string;
    };
    testimonials: {
        jessica: {
            name: string;
            title: string;
            text: string;
        };
        michael: {
            name: string;
            title: string;
            text: string;
        };
        anna: {
            name: string;
            title: string;
            text: string;
        };
    };
}

export const socialProofSectionTexts: Record<"ENG" | "KOR", SocialProofSectionTexts> = {
    ENG: {
        title: "Trusted by Productivity Enthusiasts",
        subtitle: "Join thousands of users who have already transformed their planning experience with SayPlan.",
        stats: {
            activeUsers: "Active Users",
            schedules: "Schedules Created",
            voiceAccuracy: "Voice Accuracy",
            userRating: "User Rating"
        },
        testimonials: {
            jessica: {
                name: "Jessica Smith",
                title: "Marketing Manager",
                text: "Finally, a planner that understands how I actually work. I can quickly voice my meetings while driving, then type detailed notes when I'm at my desk. Game-changer!"
            },
            michael: {
                name: "Michael Rodriguez",
                title: "Freelance Designer",
                text: "The route optimization feature saves me at least 30 minutes every day. SayPlan knows the best order for my client meetings better than I do!"
            },
            anna: {
                name: "Anna Park",
                title: "Startup Founder",
                text: "As a busy founder, I needed something that just works. SayPlan's AI is incredibly smart at understanding context. It rarely gets my schedule wrong."
            }
        }
    },
    KOR: {
        title: "생산성 애호가들의 신뢰를 받고 있습니다",
        subtitle: "SayPlan으로 이미 일정 관리 경험을 혁신한 수천 명의 사용자와 함께하세요.",
        stats: {
            activeUsers: "활성 사용자",
            schedules: "생성된 일정",
            voiceAccuracy: "음성 정확도",
            userRating: "사용자 평점"
        },
        testimonials: {
            jessica: {
                name: "제시카 스미스",
                title: "마케팅 매니저",
                text: "드디어 제가 실제로 일하는 방식을 이해하는 플래너를 찾았습니다. 운전하며 회의 일정을 빠르게 음성으로 입력하고, 책상에서는 자세한 메모를 타이핑할 수 있어요. 게임 체인저입니다!"
            },
            michael: {
                name: "마이클 로드리게즈",
                title: "프리랜스 디자이너",
                text: "경로 최적화 기능으로 매일 최소 30분을 절약하고 있습니다. SayPlan이 저보다 고객 미팅의 최적 순서를 더 잘 알고 있어요!"
            },
            anna: {
                name: "안나 박",
                title: "스타트업 창업자",
                text: "바쁜 창업자로서 그냥 잘 작동하는 것이 필요했습니다. SayPlan의 AI는 맥락을 이해하는데 놀랍도록 똑똑해요. 제 일정을 틀리는 경우가 거의 없습니다."
            }
        }
    }
};
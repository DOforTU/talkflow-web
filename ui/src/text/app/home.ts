import { SupportedLanguage } from "@/lib/types/users.interface";

export interface HomeTexts {
    calendar: {
        dayNames: {
            sunday: string;
            monday: string;
            tuesday: string;
            wednesday: string;
            thursday: string;
            friday: string;
            saturday: string;
        };
    };
    schedule: {
        title: string;
        noSchedule: string;
        sampleSchedules: {
            teamMeeting: string;
            projectReview: string;
            clientMeeting: string;
        };
    };
    voice: {
        recordingReady: string;
        ariaLabel: string;
    };
    alerts: {
        dateClick: string; // "{year}년 {month}월 {day}일 클릭" 형식
    };
}

export const homeTexts: Record<SupportedLanguage, HomeTexts> = {
    [SupportedLanguage.EN]: {
        calendar: {
            dayNames: {
                sunday: "Sun",
                monday: "Mon",
                tuesday: "Tue",
                wednesday: "Wed",
                thursday: "Thu",
                friday: "Fri",
                saturday: "Sat",
            },
        },
        schedule: {
            title: "Schedule",
            noSchedule: "No scheduled events for today",
            sampleSchedules: {
                teamMeeting: "Team Meeting",
                projectReview: "Project Review",
                clientMeeting: "Client Meeting",
            },
        },
        voice: {
            recordingReady: "Voice recording feature coming soon!",
            ariaLabel: "Add plan by voice",
        },
        alerts: {
            dateClick: "Clicked: {month}/{day}/{year}",
        },
    },
    [SupportedLanguage.KO]: {
        calendar: {
            dayNames: {
                sunday: "일",
                monday: "월",
                tuesday: "화",
                wednesday: "수",
                thursday: "목",
                friday: "금",
                saturday: "토",
            },
        },
        schedule: {
            title: "일정",
            noSchedule: "오늘 등록된 일정이 없습니다",
            sampleSchedules: {
                teamMeeting: "팀 회의",
                projectReview: "프로젝트 검토",
                clientMeeting: "클라이언트 미팅",
            },
        },
        voice: {
            recordingReady: "음성 녹음 기능 준비중입니다!",
            ariaLabel: "음성으로 계획 추가",
        },
        alerts: {
            dateClick: "{year}년 {month}월 {day}일 클릭",
        },
    },
};

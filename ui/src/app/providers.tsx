/**
 * 전체 앱의 글로벌 Provider 설정 파일
 *
 * 주요 역할:
 * 1. React Query 설정: 모든 서버 통신의 기본 동작 방식 정의
 * 2. 인증 시스템 초기화: 앱 시작시 자동으로 로그인 상태 확인
 * 3. 성능 최적화: 캐싱, 재시도, 에러 처리 전략 구현
 * 4. 자동 토큰 관리: 백그라운드에서 토큰 갱신 및 만료 처리
 *
 * 구조:
 * - QueryClientProvider: React Query 기능을 전체 앱에서 사용 가능하게 함
 * - AuthInitializer: 기존 AuthProvider 역할을 대체하는 경량화된 컴포넌트
 *
 * 실행 순서:
 * 1. QueryClient 생성 (캐싱 및 재시도 정책 설정)
 * 2. AuthInitializer 실행 (사용자 정보 자동 조회)
 * 3. 토큰 자동 갱신 시작 (10분마다)
 * 4. 에러 감지시 자동 로그아웃 처리
 *
 * Context API 대신 이 방식을 선택한 이유:
 * - 더 나은 성능 (불필요한 리렌더링 방지)
 * - 명확한 책임 분리 (서버 상태 vs 클라이언트 상태)
 * - 더 간단한 구조 (보일러플레이트 코드 감소)
 */

// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode, useEffect } from "react";
import { useCurrentUser, useAutoTokenRefresh } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

interface ProvidersProps {
    children: ReactNode;
}

// 🔐 인증 초기화 컴포넌트 (AuthProvider 기능 대체)
function AuthInitializer({ children }: { children: ReactNode }) {
    const { error } = useCurrentUser(); // 자동으로 사용자 정보 조회

    // 자동 토큰 갱신 기능
    useAutoTokenRefresh();

    // 에러 발생시 로그아웃 처리
    useEffect(() => {
        if (error) {
            const err = error as { response?: { status?: number } };
            if (err?.response?.status === 401 || err?.response?.status === 403) {
                useAuthStore.getState().clearAuth();
            }
        }
    }, [error]);

    return <>{children}</>;
}

export default function Providers({ children }: ProvidersProps) {
    // 🔧 QueryClient 인스턴스를 useState로 생성 (컴포넌트 리렌더링 시 재생성 방지)
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    // 📊 쿼리(데이터 조회) 관련 기본 설정
                    queries: {
                        // ⏰ staleTime: 데이터가 "신선한" 상태로 간주되는 시간
                        // → 1분 동안은 같은 데이터 요청시 서버에 재요청하지 않음
                        staleTime: 60 * 1000, // 1분

                        // 💾 gcTime: 캐시가 메모리에 보관되는 시간
                        // → 5분 동안 캐시된 데이터를 메모리에 유지
                        gcTime: 5 * 60 * 1000, // 5분 (구 cacheTime)

                        // 🔄 retry: API 요청 실패시 재시도 로직
                        retry: (failureCount, error) => {
                            // 네트워크 에러나 서버 에러만 재시도
                            const err = error as { response?: { status?: number } };
                            const status = err?.response?.status;

                            // ❌ 4xx 클라이언트 에러는 재시도하지 않음
                            // (400: 잘못된 요청, 401: 인증 실패, 404: 찾을 수 없음 등)
                            if (status && status >= 400 && status < 500) {
                                return false;
                            }

                            // ✅ 5xx 서버 에러나 네트워크 에러는 최대 3번 재시도
                            return failureCount < 3;
                        },

                        // 🖥️ 브라우저 창에 다시 포커스했을 때 자동으로 데이터 재요청하지 않음
                        // → 불필요한 API 요청을 줄여 성능 향상
                        refetchOnWindowFocus: false,
                    },

                    // ✏️ 뮤테이션(데이터 변경) 관련 기본 설정
                    mutations: {
                        // 🔄 뮤테이션 실패시 1번만 재시도
                        // → 데이터 변경 작업은 중복 실행 위험이 있어 최소한으로 제한
                        retry: 1,
                    },
                },
            })
    );

    return (
        // 🌐 QueryClientProvider: 하위 모든 컴포넌트에서 React Query 사용 가능하게 함
        <QueryClientProvider client={queryClient}>
            <AuthInitializer>{children}</AuthInitializer>
            {/* 🛠️ React Query DevTools 제거됨 (성능상 이유로 프로덕션에서 제거) */}
        </QueryClientProvider>
    );
}

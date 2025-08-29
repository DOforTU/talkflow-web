// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1분
                        gcTime: 5 * 60 * 1000, // 5분 (구 cacheTime)
                        retry: (failureCount, error) => {
                            // 네트워크 에러나 서버 에러만 재시도
                            const err = error as { response?: { status?: number } };
                            const status = err?.response?.status;

                            // 4xx 클라이언트 에러는 재시도하지 않음
                            if (status && status >= 400 && status < 500) {
                                return false;
                            }

                            return failureCount < 3;
                        },
                        refetchOnWindowFocus: false, // 윈도우 포커스시 refetch 비활성화
                    },
                    mutations: {
                        retry: 1, // 뮤테이션은 1번만 재시도
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* React Query DevTools 제거 */}
        </QueryClientProvider>
    );
}

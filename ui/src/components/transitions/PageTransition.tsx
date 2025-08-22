"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./PageTransition.css";

interface PageTransitionProps {
    children: React.ReactNode;
}

// 페이지 순서 정의
const PAGES = ["/app/home", "/app/map", "/app/ai", "/app/all"];

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();
    const [previousPath, setPreviousPath] = useState<string | null>(null);
    const [slideDirection, setSlideDirection] = useState<string>("");

    useEffect(() => {
        if (previousPath && previousPath !== pathname) {
            const prevIndex = PAGES.indexOf(previousPath);
            const currentIndex = PAGES.indexOf(pathname);
            
            if (prevIndex !== -1 && currentIndex !== -1) {
                // 인덱스가 증가하면 오른쪽으로 이동 (오른쪽에서 슬라이드인)
                // 인덱스가 감소하면 왼쪽으로 이동 (왼쪽에서 슬라이드인)
                if (currentIndex > prevIndex) {
                    setSlideDirection("slide-from-right");
                } else {
                    setSlideDirection("slide-from-left");
                }
                
                // 애니메이션 시간 후 클래스 제거
                setTimeout(() => {
                    setSlideDirection("");
                }, 300);
            }
        }
        
        setPreviousPath(pathname);
    }, [pathname, previousPath]);

    return (
        <div className="page-transition-container">
            <div 
                className={`page-content ${slideDirection}`}
                key={pathname}
            >
                {children}
            </div>
        </div>
    );
}

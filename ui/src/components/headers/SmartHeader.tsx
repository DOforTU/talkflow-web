"use client";

import { useState, useEffect } from "react";
import "./SmartHeader.css";

interface SmartHeaderProps {
    children: React.ReactNode;
}

export default function SmartHeader({ children }: SmartHeaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlHeader = () => {
            const currentScrollY = window.scrollY;

            // 맨 위에 있을 때는 항상 보이게
            if (currentScrollY === 0) {
                setIsVisible(true);
            }
            // 아래로 스크롤할 때 숨기기 (5px 이상의 변화가 있을 때)
            else if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            }
            // 위로 스크롤할 때 보이기 (조금만 위로 움직여도 바로 나타남)
            else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        // throttle을 위한 requestAnimationFrame 사용
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    controlHeader();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    return <header className={`smart-header ${isVisible ? "visible" : "hidden"}`}>{children}</header>;
}

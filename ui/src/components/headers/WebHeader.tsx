"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/context/Language";
import { webHeaderTexts } from "@/text/WebHeader";
import "./WebHeader.css";

export default function WebHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { currentLanguage } = useLanguage();
    const texts = webHeaderTexts[currentLanguage];
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/") return true;
        if (path !== "/" && pathname === path) return true;
        return false;
    };

    return (
        <div className="web-header-container">
            <nav className="web-header-nav">
                {/* Brand */}
                <Link href="/" className="web-header-brand" onClick={closeMenu}>
                    {/* <Image
                        width={120}
                        height={30}
                        src="/web_logo.png"
                        alt="Silhouette Logo"
                        className="simple-footer-logo"
                    /> */}
                    <p className="web-header-logo">Silhouette</p>
                </Link>

                {/* Desktop Menu */}
                <div className="web-header-menu desktop-menu">
                    <Link href="/" className={`web-header-start-btn ${isActive("/") ? "active" : ""}`}>
                        {texts.start}
                    </Link>
                    <Link href="/about" className={`web-header-link ${isActive("/about") ? "active" : ""}`}>
                        {texts.about}
                    </Link>
                    <Link
                        href="/about/features"
                        className={`web-header-link ${isActive("/about/features") ? "active" : ""}`}
                    >
                        {texts.features}
                    </Link>
                    <Link
                        href="/about/pricing"
                        className={`web-header-link ${isActive("/about/pricing") ? "active" : ""}`}
                    >
                        {texts.pricing}
                    </Link>
                    <LanguageSelector />
                </div>

                {/* Mobile Right Section */}
                <div className="web-header-mobile-right">
                    <Link
                        href="/"
                        className={`web-header-start-btn mobile-start ${isActive("/") ? "active" : ""}`}
                        onClick={closeMenu}
                    >
                        {texts.start}
                    </Link>
                    <button className="web-header-hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                        <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
                        <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
                        <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`web-header-mobile-menu ${isMenuOpen ? "open" : ""}`}>
                    <Link
                        href="/about"
                        className={`mobile-menu-link ${isActive("/about") ? "active" : ""}`}
                        onClick={closeMenu}
                    >
                        {texts.about}
                    </Link>
                    <Link
                        href="/about/features"
                        className={`mobile-menu-link ${isActive("/about/features") ? "active" : ""}`}
                        onClick={closeMenu}
                    >
                        {texts.features}
                    </Link>
                    <Link
                        href="/about/pricing"
                        className={`mobile-menu-link ${isActive("/about/pricing") ? "active" : ""}`}
                        onClick={closeMenu}
                    >
                        {texts.pricing}
                    </Link>
                    <div className="mobile-menu-language">
                        <LanguageSelector />
                    </div>
                </div>

                {/* Overlay */}
                {isMenuOpen && <div className="mobile-menu-overlay" onClick={closeMenu}></div>}
            </nav>
        </div>
    );
}

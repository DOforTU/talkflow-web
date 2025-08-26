"use client";

import { useLanguage } from "@/context/Language";
import { heroSectionTexts } from "@/text/about/HeroSection";
import "./HeroSection.css";
import Link from "next/link";

export default function HeroSection() {
    const { currentLanguage } = useLanguage();
    const texts = heroSectionTexts[currentLanguage];
    return (
        <section className="hero-section">
            <div className="hero-container">
                <h1 className="hero-title">
                    <span className="hero-title-accent">
                        {texts.titleLine1}
                        <br />
                        {texts.titleLine2}
                    </span>
                </h1>

                <p className="hero-subtitle">{texts.subtitle}</p>

                <div className="hero-cta">
                    <Link href="/" className="btn btn-primary">
                        {texts.tryFreeButton}
                    </Link>
                    <Link href="/about" className="btn btn-secondary">
                        {texts.aboutButton}
                    </Link>
                </div>
            </div>
        </section>
    );
}

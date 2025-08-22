"use client";

import { useLanguage } from "@/context/Language";
import { heroSectionTexts } from "@/text/HeroSection";
import "./HeroSection.css";
import Link from "next/link";

export default function HeroSection() {
    const { currentLanguage } = useLanguage();
    const texts = heroSectionTexts[currentLanguage];
    return (
        <section className="hero-section">
            <div className="hero-container">
                <h1 className="hero-title">
                    {texts.titleLine1}
                    <br />
                    <span className="hero-title-accent">{texts.titleLine2}</span>
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

                {/* Hero Visual */}
                <div className="hero-visual">
                    <div className="hero-demo-card">
                        <div className="demo-input-methods">
                            <div className="demo-method">
                                <div className="demo-icon voice">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                        />
                                    </svg>
                                </div>
                                <span className="demo-label">{texts.voiceInputLabel}</span>
                            </div>

                            <div className="demo-divider">or</div>

                            <div className="demo-method">
                                <div className="demo-icon text">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                </div>
                                <span className="demo-label">{texts.textInputLabel}</span>
                            </div>
                        </div>

                        <div className="demo-input">
                            <p className="demo-input-text">&ldquo;{texts.demoInputText}&rdquo;</p>
                        </div>

                        <div className="demo-arrow">
                            <div className="demo-arrow-icon">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="demo-output">
                            <div className="demo-result">
                                <div className="demo-result-item">
                                    <span className="demo-result-label">{texts.dateLabel}</span>
                                    <p className="demo-result-value">{texts.dateValue}</p>
                                </div>
                                <div className="demo-result-item">
                                    <span className="demo-result-label">{texts.todoLabel}</span>
                                    <p className="demo-result-value">{texts.todoValue}</p>
                                </div>
                                <div className="demo-result-item">
                                    <span className="demo-result-label">{texts.locationLabel}</span>
                                    <p className="demo-result-value">{texts.locationValue}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

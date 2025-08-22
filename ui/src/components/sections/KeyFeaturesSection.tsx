"use client";

import { useLanguage } from "@/context/Language";
import { keyFeaturesSectionTexts } from "@/text/KeyFeaturesSection";
import "./KeyFeaturesSection.css";
import Link from "next/link";

export default function KeyFeaturesSection() {
    const { currentLanguage } = useLanguage();
    const texts = keyFeaturesSectionTexts[currentLanguage];
    return (
        <section className="key-features-section">
            <div className="key-features-container">
                <div className="key-features-header">
                    <h2 className="key-features-title">{texts.title}</h2>
                    <p className="key-features-subtitle">{texts.subtitle}</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon orange">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v3m0 0v8a2 2 0 002 2h3M7 4h10M5 8h14"
                                />
                            </svg>
                        </div>
                        <h3 className="feature-title">{texts.features.hybrid.title}</h3>
                        <p className="feature-description">{texts.features.hybrid.description}</p>
                        <div className="feature-list">
                            {texts.features.hybrid.items.map((item, index) => (
                                <div key={index} className="feature-list-item">
                                    <div className="feature-bullet orange"></div>
                                    <p className="feature-list-text">{item}</p>
                                </div>
                            ))}
                        </div>
                        <div className="feature-link">
                            <Link href="/about/features/hybrid-input" className="learn-more orange">
                                {texts.features.hybrid.learnMore}
                            </Link>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon blue">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                            </svg>
                        </div>
                        <h3 className="feature-title">{texts.features.ai.title}</h3>
                        <p className="feature-description">{texts.features.ai.description}</p>
                        <div className="feature-list">
                            {texts.features.ai.items.map((item, index) => (
                                <div key={index} className="feature-list-item">
                                    <div className="feature-bullet blue"></div>
                                    <p className="feature-list-text">{item}</p>
                                </div>
                            ))}
                        </div>
                        <div className="feature-link">
                            <Link href="/about/features/ai-intelligence" className="feature-learn-more blue">
                                {texts.features.ai.learnMore}
                            </Link>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon green">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="feature-title">{texts.features.location.title}</h3>
                        <p className="feature-description">{texts.features.location.description}</p>
                        <div className="feature-list">
                            {texts.features.location.items.map((item, index) => (
                                <div key={index} className="feature-list-item">
                                    <div className="feature-bullet green"></div>
                                    <p className="feature-list-text">{item}</p>
                                </div>
                            ))}
                        </div>
                        <div className="feature-link">
                            <Link href="/about/features/location-intelligence" className="feature-learn-more green">
                                {texts.features.location.learnMore}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="features-cta">
                    <Link href="/about/features" className="features-cta-btn">
                        {texts.ctaButton}
                        <svg className="features-cta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}

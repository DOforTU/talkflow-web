"use client";

import { useLanguage } from "@/context/Language";
import { finalCTASectionTexts } from "@/text/FinalCTASection";
import "./FinalCTASection.css";

export default function FinalCTASection() {
    const { currentLanguage } = useLanguage();
    const texts = finalCTASectionTexts[currentLanguage];
    return (
        <section className="final-cta-section">
            <div className="final-cta-container">
                <div className="final-cta-header">
                    <h2 className="final-cta-title">
                        {texts.title.line1}
                        <br />
                        {texts.title.line2}
                    </h2>
                    <p className="final-cta-subtitle">{texts.subtitle}</p>
                </div>

                {/* Key benefits reminder */}
                <div className="final-cta-benefits">
                    <div className="benefit-card">
                        <div className="benefit-icon">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="benefit-title">{texts.benefits.timeSaver.title}</h3>
                        <p className="benefit-text">{texts.benefits.timeSaver.text}</p>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                />
                            </svg>
                        </div>
                        <h3 className="benefit-title">{texts.benefits.voiceFreedom.title}</h3>
                        <p className="benefit-text">{texts.benefits.voiceFreedom.text}</p>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                            </svg>
                        </div>
                        <h3 className="benefit-title">{texts.benefits.aiLearning.title}</h3>
                        <p className="benefit-text">{texts.benefits.aiLearning.text}</p>
                    </div>
                </div>

                {/* Main CTA buttons */}
                <div className="final-cta-buttons">
                    <a href="/signup" className="final-cta-primary">
                        {texts.buttons.primary}
                    </a>
                    <a href="/demo" className="final-cta-secondary">
                        {texts.buttons.secondary}
                    </a>
                </div>

                {/* Trust indicators */}
                <div className="final-cta-trust">
                    {texts.trustIndicators.map((indicator, index) => (
                        <div key={index} className="trust-item">
                            <svg className="trust-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {indicator}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

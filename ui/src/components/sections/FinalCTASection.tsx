"use client";

import { useLanguage } from "@/context/Language";
import { finalCTASectionTexts } from "@/text/about/FinalCTASection";
import "./FinalCTASection.css";

export default function FinalCTASection() {
    const { currentLanguage } = useLanguage();
    const texts = finalCTASectionTexts[currentLanguage];
    return (
        <section className="final-cta-section">
            <div className="final-cta-container">
                {/* Animated Background Elements */}
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>

                <div className="final-cta-content">
                    <div className="final-cta-header">
                        <h2 className="final-cta-title">
                            {texts.title.main}
                            <span className="title-accent">{texts.title.accent}</span>?
                        </h2>
                        <p className="final-cta-subtitle">{texts.subtitle}</p>
                    </div>

                    {/* Feature Highlights */}
                    <div className="feature-highlights">
                        <div className="highlight-item">
                            <div className="highlight-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                </svg>
                            </div>
                            <span>{texts.features.voiceText}</span>
                        </div>
                        <div className="highlight-item">
                            <div className="highlight-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <span>{texts.features.routePlanning}</span>
                        </div>
                        <div className="highlight-item">
                            <div className="highlight-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    />
                                </svg>
                            </div>
                            <span>{texts.features.expenseTracking}</span>
                        </div>
                        <div className="highlight-item">
                            <div className="highlight-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <span>{texts.features.momentSharing}</span>
                        </div>
                    </div>

                    {/* Main CTA */}
                    <div className="final-cta-main">
                        <button className="cta-button">
                            <span className="button-text">{texts.ctaButton}</span>
                        </button>
                        <p className="cta-subtext">{texts.ctaSubtext}</p>
                    </div>

                    {/* Social Proof */}
                    <div className="social-proof">
                        <div className="proof-item">
                            <div className="proof-number">{texts.socialProof.activeUsers.number}</div>
                            <div className="proof-label">{texts.socialProof.activeUsers.label}</div>
                        </div>
                        <div className="proof-item">
                            <div className="proof-number">{texts.socialProof.appRating.number}</div>
                            <div className="proof-label">{texts.socialProof.appRating.label}</div>
                        </div>
                        <div className="proof-item">
                            <div className="proof-number">{texts.socialProof.satisfaction.number}</div>
                            <div className="proof-label">{texts.socialProof.satisfaction.label}</div>
                        </div>
                    </div>

                    {/* Final Message */}
                    <div className="final-message">
                        <div className="message-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                        </div>
                        <p>&quot;{texts.finalMessage}&quot;</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";

import { useLanguage } from "@/context/Language";
import { pricingTeaserSectionTexts } from "@/text/about/PricingTeaserSection";
import "./PricingTeaserSection.css";
import Link from "next/link";

export default function PricingTeaserSection() {
    const { currentLanguage } = useLanguage();
    const texts = pricingTeaserSectionTexts[currentLanguage];
    return (
        <section className="pricing-teaser-section">
            <div className="pricing-teaser-container">
                <div className="pricing-teaser-header">
                    <h2 className="pricing-teaser-title">{texts.title}</h2>
                    <p className="pricing-teaser-subtitle">{texts.subtitle}</p>
                </div>

                <div className="pricing-grid">
                    {/* Free Plan */}
                    <div className="pricing-card free">
                        <div className="pricing-header">
                            <h3 className="pricing-plan-name">{texts.plans.free.name}</h3>
                            <div className="pricing-amount">
                                {texts.plans.free.amount}
                                <span className="pricing-period">{texts.plans.free.period}</span>
                            </div>
                            <p className="pricing-description">{texts.plans.free.description}</p>
                        </div>
                        <button className="pricing-cta free">
                            <Link href="/" className="pricing-cta-link">
                                {texts.plans.free.ctaButton}
                            </Link>
                        </button>
                        <div className="pricing-features">
                            {texts.plans.free.features.map((feature, index) => (
                                <div key={index} className="pricing-feature">
                                    <svg
                                        className="pricing-feature-icon"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span
                                        className="pricing-feature-text"
                                        dangerouslySetInnerHTML={{ __html: feature }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className="pricing-card premium">
                        {/* Popular badge */}
                        <div className="popular-badge">
                            <div className="badge-text">{texts.plans.premium.popularBadge}</div>
                        </div>

                        <div className="pricing-header">
                            <h3 className="pricing-plan-name">{texts.plans.premium.name}</h3>
                            <div className="pricing-amount premium">
                                {texts.plans.premium.amount}
                                <span className="pricing-period premium">{texts.plans.premium.period}</span>
                            </div>
                            <p className="pricing-description premium">{texts.plans.premium.description}</p>
                        </div>
                        <button className="pricing-cta premium">
                            <Link href="/" className="pricing-cta-link">
                                {texts.plans.premium.ctaButton}
                            </Link>
                        </button>
                        <div className="pricing-features">
                            {texts.plans.premium.features.map((feature, index) => (
                                <div key={index} className="pricing-feature">
                                    <svg
                                        className="pricing-feature-icon premium"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span
                                        className="pricing-feature-text premium"
                                        dangerouslySetInnerHTML={{ __html: feature }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="pricing-bottom">
                    <div className="pricing-bottom-card">
                        <h3 className="pricing-bottom-title">{texts.bottom.title}</h3>
                        <p className="pricing-bottom-text">{texts.bottom.text}</p>
                        <div className="pricing-bottom-cta">
                            <a href="/pricing" className="pricing-bottom-button primary">
                                {texts.bottom.button}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="trust-indicators">
                    <div className="trust-list">
                        {texts.trustIndicators.map((indicator, index) => (
                            <div key={index} className="trust-item">
                                <svg className="trust-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {indicator}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

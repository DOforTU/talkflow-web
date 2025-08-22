"use client";

import { useLanguage } from "@/context/Language";
import { socialProofSectionTexts } from "@/text/SocialProofSection";
import "./SocialProofSection.css";

export default function SocialProofSection() {
    const { currentLanguage } = useLanguage();
    const texts = socialProofSectionTexts[currentLanguage];
    return (
        <section className="social-proof-section">
            <div className="social-proof-container">
                <h2 className="social-proof-title">{texts.title}</h2>
                <p className="social-proof-subtitle">{texts.subtitle}</p>
                {/* Stats */}
                <div className="stats-section">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number orange">5,000+</div>
                            <div className="stat-label">{texts.stats.activeUsers}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number blue">50,000+</div>
                            <div className="stat-label">{texts.stats.schedules}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number green">95%</div>
                            <div className="stat-label">{texts.stats.voiceAccuracy}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number purple">4.8★</div>
                            <div className="stat-label">{texts.stats.userRating}</div>
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="testimonials-grid">
                    <div className="testimonial-card orange">
                        <div className="testimonial-header">
                            <div className="avatar orange-bg">
                                <span className="avatar-text">JS</span>
                            </div>
                            <div className="user-info">
                                <h4 className="user-name">{texts.testimonials.jessica.name}</h4>
                                <p className="user-title">{texts.testimonials.jessica.title}</p>
                            </div>
                        </div>
                        <div className="rating">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="star" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="testimonial-text">&quot;{texts.testimonials.jessica.text}&quot;</p>
                    </div>

                    <div className="testimonial-card blue">
                        <div className="testimonial-header">
                            <div className="avatar blue-bg">
                                <span className="avatar-text">MR</span>
                            </div>
                            <div className="user-info">
                                <h4 className="user-name">{texts.testimonials.michael.name}</h4>
                                <p className="user-title">{texts.testimonials.michael.title}</p>
                            </div>
                        </div>
                        <div className="rating">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="star" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="testimonial-text">&quot;{texts.testimonials.michael.text}&quot;</p>
                    </div>

                    <div className="testimonial-card green">
                        <div className="testimonial-header">
                            <div className="avatar green-bg">
                                <span className="avatar-text">AP</span>
                            </div>
                            <div className="user-info">
                                <h4 className="user-name">{texts.testimonials.anna.name}</h4>
                                <p className="user-title">{texts.testimonials.anna.title}</p>
                            </div>
                        </div>
                        <div className="rating">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="star" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="testimonial-text">&quot;{texts.testimonials.anna.text}&quot;</p>
                    </div>
                </div>

                {/* Company Logos / As Featured In */}
                {/* <div className="featured-section">
                    <p className="featured-label">As featured in</p>
                    <div className="featured-logos">
                        <div className="featured-logo">TechCrunch</div>
                        <div className="featured-logo">ProductHunt</div>
                        <div className="featured-logo">FastCompany</div>
                        <div className="featured-logo">Mashable</div>
                    </div>
                </div> */}
            </div>
        </section>
    );
}

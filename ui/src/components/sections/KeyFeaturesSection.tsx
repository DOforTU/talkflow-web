"use client";

import { useLanguage } from "@/context/Language";
import { keyFeaturesSectionTexts } from "@/text/KeyFeaturesSection";
import "./KeyFeaturesSection.css";

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

                <div className="features-list">
                    {/* Plan Your Silhouette */}
                    <div className="feature-item">
                        <div className="feature-mockup">
                            <div className="mockup-placeholder">
                                <div className="mockup-header">Schedule Planner</div>
                                <div className="mockup-content">
                                    <div className="mockup-item">
                                        <div className="mockup-time">09:00</div>
                                        <div className="mockup-task">Morning Meeting</div>
                                    </div>
                                    <div className="mockup-item">
                                        <div className="mockup-time">14:00</div>
                                        <div className="mockup-task">Lunch with Client</div>
                                    </div>
                                    <div className="mockup-item active">
                                        <div className="mockup-time">16:00</div>
                                        <div className="mockup-task">Project Review</div>
                                    </div>
                                </div>
                                <div className="mockup-voice-button">🎤</div>
                            </div>
                        </div>
                        <div className="feature-content">
                            <h3 className="feature-title">{texts.features.planning.title}</h3>
                            <p className="feature-description">
                                {texts.features.planning.description}
                            </p>
                            <div className="feature-highlights">
                                {texts.features.planning.items.map((item, index) => (
                                    <div key={index} className="highlight-item">
                                        <div className="highlight-dot"></div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Location & Route Visualization */}
                    <div className="feature-item">
                        <div className="feature-content">
                            <h3 className="feature-title">{texts.features.routes.title}</h3>
                            <p className="feature-description">
                                {texts.features.routes.description}
                            </p>
                            <div className="feature-highlights">
                                {texts.features.routes.items.map((item, index) => (
                                    <div key={index} className="highlight-item">
                                        <div className="highlight-dot"></div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="feature-mockup">
                            <div className="mockup-placeholder">
                                <div className="mockup-header">Route Overview</div>
                                <div className="mockup-map">
                                    <div className="map-point start">A</div>
                                    <div className="map-route"></div>
                                    <div className="map-point mid">B</div>
                                    <div className="map-route"></div>
                                    <div className="map-point end">C</div>
                                </div>
                                <div className="mockup-route-info">
                                    <div className="route-item">Home → Office (15 min)</div>
                                    <div className="route-item">Office → Restaurant (8 min)</div>
                                    <div className="route-item">Restaurant → Home (20 min)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget Management */}
                    <div className="feature-item">
                        <div className="feature-mockup">
                            <div className="mockup-placeholder">
                                <div className="mockup-header">Expense Tracker</div>
                                <div className="mockup-content">
                                    <div className="expense-item">
                                        <div className="expense-desc">Coffee Meeting</div>
                                        <div className="expense-amount">$12</div>
                                    </div>
                                    <div className="expense-item">
                                        <div className="expense-desc">Business Lunch</div>
                                        <div className="expense-amount">$45</div>
                                    </div>
                                    <div className="expense-item">
                                        <div className="expense-desc">Transport</div>
                                        <div className="expense-amount">$8</div>
                                    </div>
                                </div>
                                <div className="mockup-total">
                                    <div className="total-label">Daily Total</div>
                                    <div className="total-amount">$65</div>
                                </div>
                            </div>
                        </div>
                        <div className="feature-content">
                            <h3 className="feature-title">{texts.features.expenses.title}</h3>
                            <p className="feature-description">
                                {texts.features.expenses.description}
                            </p>
                            <div className="feature-highlights">
                                {texts.features.expenses.items.map((item, index) => (
                                    <div key={index} className="highlight-item">
                                        <div className="highlight-dot"></div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Leave Your Silhouette */}
                    <div className="feature-item">
                        <div className="feature-content">
                            <h3 className="feature-title">{texts.features.sharing.title}</h3>
                            <p className="feature-description">
                                {texts.features.sharing.description}
                            </p>
                            <div className="feature-highlights">
                                {texts.features.sharing.items.map((item, index) => (
                                    <div key={index} className="highlight-item">
                                        <div className="highlight-dot"></div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="feature-mockup">
                            <div className="mockup-placeholder">
                                <div className="mockup-header">Share Moments</div>
                                <div className="mockup-sharing">
                                    <div className="share-slot">
                                        <div className="share-placeholder">📸</div>
                                        <div className="share-label">Free Share</div>
                                    </div>
                                    <div className="share-slot locked">
                                        <div className="share-placeholder">🎬</div>
                                        <div className="share-label">Random Alert</div>
                                        <div className="lock-icon">🔒</div>
                                    </div>
                                </div>
                                <div className="mockup-notification">
                                    <div className="notification-text">📱 Time to capture your moment!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

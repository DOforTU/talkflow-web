"use client";

import { useLanguage } from "@/context/Language";
import { keyFeaturesSectionTexts } from "@/text/about/KeyFeaturesSection";
import "./KeyFeaturesSection.css";
import Image from "next/image";

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
                            <Image
                                width={262}
                                height={568}
                                src="/plan_ur_sil.png"
                                alt="Mobile UI Example"
                                className="example-ui"
                            />
                        </div>
                        <div className="feature-content">
                            <h3 className="feature-title">{texts.features.planning.title}</h3>
                            <p className="feature-description">{texts.features.planning.description}</p>
                            <div className="key-feature-highlights">
                                {texts.features.planning.items.map((item, index) => (
                                    <div key={index} className="key-highlight-item">
                                        <div className="key-highlight-dot"></div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Location & Route Visualization */}
                    <div className="feature-item">
                        <div className="feature-mockup">
                            <Image
                                width={262}
                                height={568}
                                src="/map_ur_plan.png"
                                alt="Mobile UI Example"
                                className="example-ui"
                            />
                        </div>
                        <div className="feature-content">
                            <h3 className="feature-title">{texts.features.routes.title}</h3>
                            <p className="feature-description">{texts.features.routes.description}</p>
                            <div className="key-feature-highlights">
                                {texts.features.routes.items.map((item, index) => (
                                    <div key={index} className="key-highlight-item">
                                        <div className="key-highlight-dot"></div>
                                        <span className="key-highlight-text">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Budget Management */}
                    <div className="feature-item">
                        <div className="feature-mockup">
                            <Image
                                width={262}
                                height={568}
                                src="/plan_ur_sil.png"
                                alt="Mobile UI Example"
                                className="example-ui"
                            />
                        </div>
                        <div className="feature-content">
                            <h3 className="feature-title">{texts.features.expenses.title}</h3>
                            <p className="feature-description">{texts.features.expenses.description}</p>
                            <div className="key-feature-highlights">
                                {texts.features.expenses.items.map((item, index) => (
                                    <div key={index} className="key-highlight-item">
                                        <div className="key-highlight-dot"></div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Leave Your Silhouette */}
                    <div className="feature-item">
                        <div className="feature-mockup">
                            <Image
                                width={262}
                                height={568}
                                src="/plan_ur_sil.png"
                                alt="Mobile UI Example"
                                className="example-ui"
                            />
                        </div>
                        <div className="feature-content">
                            <h3 className="feature-title">{texts.features.sharing.title}</h3>
                            <p className="feature-description">{texts.features.sharing.description}</p>
                            <div className="key-feature-highlights">
                                {texts.features.sharing.items.map((item, index) => (
                                    <div key={index} className="key-highlight-item">
                                        <div className="key-highlight-dot"></div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

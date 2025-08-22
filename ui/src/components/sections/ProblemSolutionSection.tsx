"use client";

import { useLanguage } from "@/context/Language";
import { problemSolutionSectionTexts } from "@/text/ProblemSolutionSection";
import "./ProblemSolutionSection.css";

export default function ProblemSolutionSection() {
    const { currentLanguage } = useLanguage();
    const texts = problemSolutionSectionTexts[currentLanguage];
    return (
        <section className="problem-solution-section">
            <div className="problem-solution-container">
                <div className="problem-solution-header">
                    <h2 className="problem-solution-title">{texts.title}</h2>
                    <p className="problem-solution-subtitle">{texts.subtitle}</p>
                </div>

                <div className="problem-solution-content">
                    {/* Problem Side */}
                    <div className="problem-side">
                        <h3 className="side-title problem">{texts.problemTitle}</h3>
                        <div className="side-list">
                            <div className="side-item">
                                <div className="side-icon problem">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <div className="side-content">
                                    <h4>{texts.problems.switching.title}</h4>
                                    <p>{texts.problems.switching.description}</p>
                                </div>
                            </div>

                            <div className="side-item">
                                <div className="side-icon problem">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <div className="side-content">
                                    <h4>{texts.problems.rigid.title}</h4>
                                    <p>{texts.problems.rigid.description}</p>
                                </div>
                            </div>

                            <div className="side-item">
                                <div className="side-icon problem">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <div className="side-content">
                                    <h4>{texts.problems.manual.title}</h4>
                                    <p>{texts.problems.manual.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solution Side */}
                    <div className="solution-side">
                        <h3 className="side-title solution">{texts.solutionTitle}</h3>
                        <div className="side-list">
                            <div className="side-item">
                                <div className="side-icon solution">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div className="side-content">
                                    <h4>{texts.solutions.allInOne.title}</h4>
                                    <p>{texts.solutions.allInOne.description}</p>
                                </div>
                            </div>

                            <div className="side-item">
                                <div className="side-icon solution">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div className="side-content">
                                    <h4>{texts.solutions.hybrid.title}</h4>
                                    <p>{texts.solutions.hybrid.description}</p>
                                </div>
                            </div>

                            <div className="side-item">
                                <div className="side-icon solution">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div className="side-content">
                                    <h4>{texts.solutions.smart.title}</h4>
                                    <p>{texts.solutions.smart.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

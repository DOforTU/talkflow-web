"use client";

import "./AIPage.css";

export default function AIPage() {
    return (
        <div className="ai-page">
            <main className="ai-main">
                <div className="ai-header">
                    <h1 className="ai-title">AI 어시스턴트</h1>
                    <p className="ai-subtitle">자연어로 일정을 관리하세요</p>
                </div>

                <div className="ai-content">
                    <div className="chat-container">
                        <div className="chat-messages">
                            <div className="message ai-message">
                                <div className="message-content">
                                    안녕하세요! 무엇을 도와드릴까요?
                                    <br />
                                    예: &quot;내일 오후 2시에 회의 일정 추가해줘&quot;
                                </div>
                            </div>
                        </div>

                        <div className="chat-input-container">
                            <div className="chat-input-wrapper">
                                <input type="text" className="chat-input" placeholder="AI에게 메시지를 입력하세요..." />
                                <button className="send-btn">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="ai-features">
                        <h3>AI 기능</h3>
                        <div className="feature-grid">
                            <div className="feature-card">
                                <div className="feature-icon">📅</div>
                                <h4>스마트 일정 생성</h4>
                                <p>자연어로 일정을 추가하고 수정할 수 있습니다</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">🤖</div>
                                <h4>지능형 제안</h4>
                                <p>최적의 시간과 장소를 제안해드립니다</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">⚡</div>
                                <h4>빠른 처리</h4>
                                <p>즉시 일정을 파싱하고 생성합니다</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

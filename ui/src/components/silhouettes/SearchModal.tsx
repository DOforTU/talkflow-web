"use client";

import { useState, useEffect } from "react";
import "./SearchModal.css";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // Load search history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem("silhouette-search-history");
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }
    }, []);

    const handleSearch = (query: string = searchQuery) => {
        if (!query.trim()) return;

        // Add to search history
        const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
        setSearchHistory(newHistory);
        localStorage.setItem("silhouette-search-history", JSON.stringify(newHistory));

        // TODO: Implement actual search functionality
        console.log("Searching for:", query);
        onClose();
    };

    const handleHistoryClick = (query: string) => {
        setSearchQuery(query);
        handleSearch(query);
    };

    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem("silhouette-search-history");
    };

    if (!isOpen) return null;

    return (
        <div className="search-modal-overlay" onClick={onClose}>
            <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                <div className="search-modal-header">
                    <div className="search-input-container">
                        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="실루엣 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="search-input"
                            autoFocus
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="clear-input-btn"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button onClick={onClose} className="close-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="search-modal-content">
                    {searchHistory.length > 0 && (
                        <div className="search-history">
                            <div className="search-history-header">
                                <h3>최근 검색</h3>
                                <button onClick={clearHistory} className="clear-history-btn">
                                    전체 삭제
                                </button>
                            </div>
                            <div className="search-history-list">
                                {searchHistory.map((query, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleHistoryClick(query)}
                                        className="search-history-item"
                                    >
                                        <svg className="history-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12,6 12,12 16,14" />
                                        </svg>
                                        <span>{query}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchQuery && (
                        <div className="search-suggestions">
                            <div className="search-suggestion-item" onClick={() => handleSearch()}>
                                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <span>"{searchQuery}" 검색</span>
                            </div>
                        </div>
                    )}

                    {!searchQuery && searchHistory.length === 0 && (
                        <div className="empty-state">
                            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <p>검색어를 입력해주세요</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
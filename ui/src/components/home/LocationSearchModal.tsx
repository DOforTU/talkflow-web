"use client";

import { useState, useEffect, useRef } from "react";
import { CreateLocationDto, UpdateLocationDto } from "@/lib/types/event.interface";
import "./LocationSearchModal.css";

interface LocationSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelect: (location: CreateLocationDto) => void;
    existingLocation?: UpdateLocationDto | null;
}

declare global {
    interface Window {
        google: typeof google;
        initMap: () => void;
    }
}

export default function LocationSearchModal({ 
    isOpen, 
    onClose, 
    onLocationSelect,
    existingLocation
}: LocationSearchModalProps) {
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<CreateLocationDto | null>(null);
    
    const mapRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const loadGoogleMaps = () => {
            if (window.google && window.google.maps) {
                initializeMap();
                return;
            }

            // Google Maps API 스크립트가 이미 있는지 확인
            if (document.querySelector('script[src*="maps.googleapis.com"]')) {
                // API가 로드될 때까지 대기
                const checkGoogle = setInterval(() => {
                    if (window.google && window.google.maps) {
                        clearInterval(checkGoogle);
                        initializeMap();
                    }
                }, 100);
                return;
            }

            // Google Maps API 스크립트 로드
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.head.appendChild(script);
        };

        const initializeMap = () => {
            if (!mapRef.current) return;

            const mapOptions: google.maps.MapOptions = {
                center: existingLocation 
                    ? { lat: existingLocation.latitude, lng: existingLocation.longitude }
                    : { lat: 37.5665, lng: 126.9780 }, // 서울시청
                zoom: existingLocation ? 15 : 12,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
            };

            mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);

            // 기존 위치가 있으면 마커 표시
            if (existingLocation) {
                addMarker(
                    existingLocation.latitude,
                    existingLocation.longitude,
                    existingLocation.nameKo || existingLocation.nameEn || "선택된 위치"
                );
                setSelectedLocation({
                    nameEn: existingLocation.nameEn,
                    nameKo: existingLocation.nameKo,
                    address: existingLocation.address,
                    latitude: existingLocation.latitude,
                    longitude: existingLocation.longitude,
                });
            }

            // 검색 자동완성 설정
            if (searchInputRef.current) {
                autocompleteRef.current = new google.maps.places.Autocomplete(searchInputRef.current, {
                    fields: ['place_id', 'name', 'formatted_address', 'geometry'],
                });

                autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
            }

            // 지도 클릭 이벤트
            mapInstanceRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
                if (event.latLng) {
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();
                    reverseGeocode(lat, lng);
                }
            });

            setIsLoading(false);
        };

        loadGoogleMaps();
    }, [isOpen, existingLocation]);

    const addMarker = (lat: number, lng: number, title: string) => {
        if (!mapInstanceRef.current) return;

        // 기존 마커 제거
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        // 새 마커 생성
        markerRef.current = new google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            title,
        });

        mapInstanceRef.current.setCenter({ lat, lng });
    };

    const handlePlaceSelect = () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place || !place.geometry || !place.geometry.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const name = place.name || "";
        const address = place.formatted_address || "";

        addMarker(lat, lng, name);
        setSelectedLocation({
            nameKo: name,
            nameEn: undefined,
            address,
            latitude: lat,
            longitude: lng,
        });

        setSearchValue(name);
    };

    const reverseGeocode = (lat: number, lng: number) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const result = results[0];
                const address = result.formatted_address;
                let name = "";

                // POI 이름 찾기
                for (const component of result.address_components) {
                    if (component.types.includes('establishment') || 
                        component.types.includes('point_of_interest')) {
                        name = component.long_name;
                        break;
                    }
                }

                if (!name) {
                    name = address.split(',')[0]; // 첫 번째 주소 부분을 이름으로 사용
                }

                addMarker(lat, lng, name);
                setSelectedLocation({
                    nameKo: name,
                    nameEn: undefined,
                    address,
                    latitude: lat,
                    longitude: lng,
                });

                setSearchValue(name);
            }
        });
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            onLocationSelect(selectedLocation);
            onClose();
        }
    };

    const handleClose = () => {
        setSearchValue("");
        setSelectedLocation(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="location-modal-overlay" onClick={handleClose}>
            <div className="location-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>위치 검색</h3>
                    <button 
                        className="modal-close-btn" 
                        onClick={handleClose}
                        aria-label="모달 닫기"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="location-content">
                    <div className="search-section">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="위치를 검색하세요"
                            className="location-search-input"
                        />
                        <p className="search-hint">위치를 검색하거나 지도를 클릭하여 선택하세요</p>
                    </div>

                    <div className="map-container">
                        {isLoading && (
                            <div className="map-loading">
                                <p>지도를 로딩 중...</p>
                            </div>
                        )}
                        <div ref={mapRef} className="google-map" />
                    </div>

                    {selectedLocation && (
                        <div className="selected-location">
                            <h4>선택된 위치</h4>
                            <div className="location-details">
                                <p className="location-name">{selectedLocation.nameKo || selectedLocation.nameEn}</p>
                                <p className="location-address">{selectedLocation.address}</p>
                            </div>
                        </div>
                    )}

                    <div className="location-actions">
                        <button onClick={handleClose} className="cancel-btn">
                            취소
                        </button>
                        <button 
                            onClick={handleConfirm} 
                            className="confirm-btn"
                            disabled={!selectedLocation}
                        >
                            선택
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
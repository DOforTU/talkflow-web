"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import "./MapPage.css";

interface Location {
    lat: number;
    lng: number;
    name: string;
}

export default function MapPage() {
    const [selectedLocation, setSelectedLocation] = useState("서울시청");
    const [searchValue, setSearchValue] = useState("");
    const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied' | 'unavailable'>('pending');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const currentLocationMarkerRef = useRef<google.maps.Marker | null>(null);

    const predefinedLocations: Location[] = [
        { lat: 37.5666805, lng: 126.9784147, name: "서울시청" },
        { lat: 37.4979502, lng: 127.0276368, name: "강남역" },
        { lat: 37.5571979, lng: 126.9229838, name: "홍대입구역" },
        { lat: 37.5291062, lng: 126.9332158, name: "여의도공원" },
    ];

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationPermission('unavailable');
            return;
        }

        setIsLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newCurrentLocation: Location = {
                    lat: latitude,
                    lng: longitude,
                    name: "현재 위치"
                };
                
                setCurrentLocation(newCurrentLocation);
                setLocationPermission('granted');
                setIsLoadingLocation(false);
                
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
                    mapInstanceRef.current.setZoom(16);
                    addCurrentLocationMarker(newCurrentLocation);
                }
            },
            (error) => {
                setIsLoadingLocation(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationPermission('denied');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationPermission('unavailable');
                        break;
                    case error.TIMEOUT:
                        alert('위치 정보를 가져오는 데 시간이 초과되었습니다.');
                        break;
                    default:
                        alert('위치 정보를 가져오는 중 오류가 발생했습니다.');
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    const addCurrentLocationMarker = (location: Location) => {
        if (!mapInstanceRef.current) return;

        if (currentLocationMarkerRef.current) {
            currentLocationMarkerRef.current.setMap(null);
        }

        const currentMarker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: mapInstanceRef.current,
            title: location.name,
            icon: {
                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#10B981">
                        <circle cx="12" cy="12" r="8" fill="#10B981" stroke="#fff" stroke-width="2"/>
                        <circle cx="12" cy="12" r="4" fill="#fff"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 40),
            },
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${location.name}</strong><br/>위도: ${location.lat.toFixed(6)}<br/>경도: ${location.lng.toFixed(6)}</div>`,
        });

        currentMarker.addListener("click", () => {
            infoWindow.open(mapInstanceRef.current, currentMarker);
        });

        currentLocationMarkerRef.current = currentMarker;
    };

    const initializeMap = () => {
        if (!mapRef.current || !window.google) return;

        const defaultLocation = predefinedLocations.find(loc => loc.name === selectedLocation) || predefinedLocations[0];

        const map = new google.maps.Map(mapRef.current, {
            center: { lat: defaultLocation.lat, lng: defaultLocation.lng },
            zoom: 13,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
        });

        mapInstanceRef.current = map;
        addMarkers();
    };

    const addMarkers = () => {
        if (!mapInstanceRef.current) return;

        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        predefinedLocations.forEach(location => {
            const marker = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: mapInstanceRef.current,
                title: location.name,
                icon: location.name === selectedLocation ? {
                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#4F46E5">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(40, 40),
                } : undefined,
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `<div><strong>${location.name}</strong></div>`,
            });

            marker.addListener("click", () => {
                infoWindow.open(mapInstanceRef.current, marker);
                setSelectedLocation(location.name);
            });

            markersRef.current.push(marker);
        });
    };

    const searchLocation = () => {
        if (!searchValue.trim() || !mapInstanceRef.current || !window.google) return;

        const service = new google.maps.places.PlacesService(mapInstanceRef.current);
        const request = {
            query: searchValue,
            fields: ['name', 'geometry'],
        };

        service.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                const place = results[0];
                if (place.geometry && place.geometry.location) {
                    mapInstanceRef.current?.setCenter(place.geometry.location);
                    mapInstanceRef.current?.setZoom(15);
                    
                    const marker = new google.maps.Marker({
                        position: place.geometry.location,
                        map: mapInstanceRef.current,
                        title: place.name,
                        icon: {
                            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#EF4444">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            `),
                            scaledSize: new google.maps.Size(40, 40),
                        },
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `<div><strong>${place.name}</strong></div>`,
                    });

                    marker.addListener("click", () => {
                        infoWindow.open(mapInstanceRef.current, marker);
                    });

                    markersRef.current.push(marker);
                }
            }
        });

        setSearchValue("");
    };

    const handleLocationSelect = (locationName: string) => {
        setSelectedLocation(locationName);
        const location = predefinedLocations.find(loc => loc.name === locationName);
        if (location && mapInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat: location.lat, lng: location.lng });
            mapInstanceRef.current.setZoom(15);
            addMarkers();
        }
    };

    useEffect(() => {
        if (isGoogleMapsLoaded) {
            initializeMap();
        }
    }, [isGoogleMapsLoaded, selectedLocation]);

    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                onLoad={() => setIsGoogleMapsLoaded(true)}
                onError={() => console.error("Google Maps API failed to load")}
            />
            <div className="map-page">
                <main className="map-main">
                    <div className="map-header">
                        <h1 className="map-title">지도</h1>
                        <p className="map-subtitle">일정 위치를 확인하고 관리하세요</p>
                    </div>

                    <div className="map-content">
                        <div className="map-container">
                            {isGoogleMapsLoaded ? (
                                <div ref={mapRef} className="google-map" />
                            ) : (
                                <div className="map-placeholder">
                                    <div className="map-icon">🗺️</div>
                                    <p>Google Maps 로딩 중...</p>
                                    <small>현재 선택된 위치: {selectedLocation}</small>
                                </div>
                            )}
                        </div>

                    <div className="location-controls">
                        <div className="search-container">
                            <input
                                type="text"
                                className="location-search"
                                placeholder="위치 검색..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                            />
                            <button className="search-btn" onClick={searchLocation}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                            <button 
                                className={`location-btn ${isLoadingLocation ? 'loading' : ''}`}
                                onClick={getCurrentLocation}
                                disabled={isLoadingLocation || locationPermission === 'unavailable'}
                                title="현재 위치"
                            >
                                {isLoadingLocation ? (
                                    <svg className="loading-spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
                                        />
                                    </svg>
                                ) : (
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
                                )}
                            </button>
                        </div>

                        {locationPermission === 'denied' && (
                            <div className="location-permission-notice error">
                                <div className="notice-icon">⚠️</div>
                                <div>
                                    <strong>위치 접근이 차단되었습니다</strong>
                                    <p>브라우저 설정에서 위치 권한을 허용해주세요.</p>
                                </div>
                            </div>
                        )}

                        {locationPermission === 'unavailable' && (
                            <div className="location-permission-notice warning">
                                <div className="notice-icon">📍</div>
                                <div>
                                    <strong>위치 서비스를 사용할 수 없습니다</strong>
                                    <p>이 브라우저에서는 GPS 기능을 지원하지 않습니다.</p>
                                </div>
                            </div>
                        )}

                        {locationPermission === 'pending' && (
                            <div className="location-permission-notice info">
                                <div className="notice-icon">📱</div>
                                <div>
                                    <strong>현재 위치 기능</strong>
                                    <p>GPS 버튼을 클릭하면 현재 위치를 지도에 표시할 수 있습니다.</p>
                                </div>
                            </div>
                        )}

                        {currentLocation && (
                            <div className="current-location-info">
                                <h4>📍 현재 위치</h4>
                                <p>위도: {currentLocation.lat.toFixed(6)}</p>
                                <p>경도: {currentLocation.lng.toFixed(6)}</p>
                            </div>
                        )}

                        <div className="location-suggestions">
                            <h3>최근 위치</h3>
                            <div className="suggestion-list">
                                {predefinedLocations.map((location) => (
                                    <button
                                        key={location.name}
                                        className={`suggestion-item ${
                                            selectedLocation === location.name ? "selected" : ""
                                        }`}
                                        onClick={() => handleLocationSelect(location.name)}
                                    >
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
                                        {location.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="map-features">
                        <h3>지도 기능</h3>
                        <div className="feature-grid">
                            <div className="feature-card">
                                <div className="feature-icon">📍</div>
                                <h4>위치 기반 일정</h4>
                                <p>일정에 위치를 추가하고 지도에서 확인</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">🚗</div>
                                <h4>경로 최적화</h4>
                                <p>하루 일정의 최적 동선을 계산</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">⏰</div>
                                <h4>이동 시간 계산</h4>
                                <p>실시간 교통정보로 이동시간 예측</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        </>
    );
}
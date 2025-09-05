import { useState, useEffect } from "react";

const checkGoogleMapsLoaded = (): boolean => {
    return typeof window !== "undefined" && !!window.google && !!window.google.maps;
};

const loadGoogleMapsAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (checkGoogleMapsLoaded()) {
            resolve();
            return;
        }

        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve());
            existingScript.addEventListener("error", reject);
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            console.log("Google Maps API loaded successfully");
            resolve();
        };

        script.onerror = (e) => {
            console.error("Google Maps API failed to load", e);
            reject(e);
        };

        document.head.appendChild(script);
    });
};

export const useGoogleMaps = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (checkGoogleMapsLoaded()) {
            console.log("Google Maps API already loaded");
            setIsLoaded(true);
        } else {
            loadGoogleMapsAPI()
                .then(() => setIsLoaded(true))
                .catch((error) => {
                    console.error("Failed to load Google Maps API:", error);
                    setError(error);
                });
        }
    }, []);

    return { isLoaded, error };
};

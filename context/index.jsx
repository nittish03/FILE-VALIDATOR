"use client";
import { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();

export function AppWrapper({ children }) {
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [state, setState] = useState(null);
    
    useEffect(() => {
        let watchId;
        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat:latitude, lng:longitude });

                    try {
                        const response = await axios.get(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        setState(response.data.address.state || "Unknown");
                    } catch (error) {
                        console.error("Error fetching city:", error);
                        setState("Unknown");
                    }
                },
                (err) => {
                    setLocationError(err.message);
                    toast.error("Failed to get location: " + err.message);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
            toast.error("Geolocation is not supported.");
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return (
        <AppContext.Provider value={{ location, locationError, state, setState }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}

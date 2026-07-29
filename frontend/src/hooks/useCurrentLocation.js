import { useState } from "react";
import { reverseGeocode } from "../utils/reverseGeocode";

const useCurrentLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [location, setLocation] = useState(null);

  const detect = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setErrorType("not_supported");
      return;
    }

    setLoading(true);
    setError(null);
    setErrorType(null);
    setLocation(null);

    // Check permission state first if available
    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({
          name: "geolocation",
        });
        if (status.state === "denied") {
          setLoading(false);
          setError(
            "Location permission is blocked. Please enable it in your browser settings.",
          );
          setErrorType("permission_denied");
          return;
        }
      } catch {
        // permissions API not supported, continue anyway
      }
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const result = await reverseGeocode(latitude, longitude);
          setLocation(result);
          setLoading(false);
        } catch {
          setError(
            "Unable to fetch address. Please enter your address manually.",
          );
          setErrorType("geocode_error");
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              "Location permission denied. Please allow location access and try again.",
            );
            setErrorType("permission_denied");
            break;
          case err.POSITION_UNAVAILABLE:
            setError(
              "Location services are turned off. Please enable location in your device settings and try again.",
            );
            setErrorType("position_unavailable");
            break;
          case err.TIMEOUT:
            setError(
              "Location request timed out. Please try again or enter manually.",
            );
            setErrorType("timeout");
            break;
          default:
            setError(
              "Unable to detect location. Please enter your address manually.",
            );
            setErrorType("unknown");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const reset = () => {
    setError(null);
    setErrorType(null);
    setLocation(null);
  };

  return { loading, error, errorType, location, detect, reset };
};

export default useCurrentLocation;

export const reverseGeocode = async (lat, lng) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" || !data.results?.length) {
    throw new Error(data.error_message || "Geocoding failed");
  }

  const result = data.results[0];
  const components = result.address_components || [];

  const getComponent = (type) =>
    components.find((c) => c.types.includes(type))?.long_name || "";

  const city =
    getComponent("locality") ||
    getComponent("administrative_area_level_2") ||
    getComponent("administrative_area_level_1");

  return {
    address: result.formatted_address || "",
    city,
    area: getComponent("sublocality") || getComponent("neighborhood") || "",
    postalCode: getComponent("postal_code") || "",
    lat,
    lng,
  };
};

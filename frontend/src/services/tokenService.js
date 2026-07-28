let accessToken = null;
let tokenExpiry = null;
let tokenPromise = null;

const DEFAULT_EXPIRY_MS = 60 * 60 * 1000;

const fetchNewToken = async () => {
  try {
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey) {
      throw new Error("VITE_API_KEY is not defined in environment variables");
    }

    const res = await fetch(`/api/Login/GetToken?ApiKey=${apiKey}`, {
      headers: { accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Auth failed: ${res.status}`);

    const result = await res.json();

    if (result?.statusCode === 200 && result?.data) {
      accessToken = result.data;

      const expiresInMs = result.expiresIn
        ? result.expiresIn * 1000
        : DEFAULT_EXPIRY_MS;

      // Set expiry with a 30s buffer to prevent edge cases
      tokenExpiry = Date.now() + expiresInMs - 30000;
      return accessToken;
    }

    throw new Error(
      result?.message || "Failed to retrieve token from response",
    );
  } catch (err) {
    console.error("❌ Token fetch error:", err);
    accessToken = null;
    tokenExpiry = null;
    throw err;
  } finally {
    tokenPromise = null;
  }
};

export const getToken = async () => {
  // 1. If we have a valid token, return it
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  // 2. If a fetch is already in progress, return the existing promise
  if (tokenPromise) {
    return tokenPromise;
  }

  // 3. Start a new fetch and store the promise
  tokenPromise = fetchNewToken();
  return tokenPromise;
};

export const clearToken = () => {
  accessToken = null;
  tokenExpiry = null;
  tokenPromise = null;
};

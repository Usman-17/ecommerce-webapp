import { getToken } from "../services/tokenService";
import { handleApiResponse } from "./handleApiResponse";

// A wrapper around fetch that automatically attaches the bearer token.
export const authFetch = async (url, options = {}) => {
  const token = await getToken();

  const headers = {
    accept: "application/json",
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export const apiRequest = async (url, options = {}) => {
  const res = await authFetch(url, options);
  return handleApiResponse(res, `Request failed for ${url}`);
};

export const uploadFile = async (url, formData) => {
  const token = await getToken();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return handleApiResponse(res, `Upload failed for ${url}`);
};

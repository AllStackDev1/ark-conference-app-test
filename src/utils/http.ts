import queryString from "query-string";

import { API_BASE_URL } from "./constant";
import { useAuthStore } from "src/stores";
import { refreshAccessToken } from "./services";

const getHeader = (headers?: HeadersInit) => {
  const accessToken = useAuthStore.getState().accessToken;

  return {
    "Content-Type": "application/json",
    ...headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
  } as HeadersInit;
};

const asyncFetch = async (
  url = "",
  method = "GET",
  headers?: HeadersInit,
  body?: BodyInit | null
) => {
  const options: RequestInit = {
    body,
    method,
    credentials: "include",
    headers: getHeader(headers),
  }
  let response = await fetch(url, options);

  if (response.status === 401) {
    try {
      // Attempt to refresh the access token
      const { user, accessToken } = await refreshAccessToken();
      useAuthStore.setState({ user, accessToken });

      // Retry the original request with the new access token
      response = await fetch(url, options);
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error; // Re-throw if refresh fails
    }
  }
  return await response.json();
};

export const get = async <T>(
  path = "",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: Record<any, any>,
  headers?: HeadersInit
) =>
  (await asyncFetch(
    API_BASE_URL + path + `${query ? `?${queryString.stringify(query)}` : ""}`,
    "GET",
    headers
  )) as T;

export const post = async <T>(
  path = "",
  body?: BodyInit | null,
  headers?: HeadersInit
) => (await asyncFetch(API_BASE_URL + path, "POST", headers, body)) as T;

export const patch = async <T>(
  path = "",
  body?: BodyInit | null,
  headers?: HeadersInit
) => (await asyncFetch(API_BASE_URL + path, "PATCH", headers, body)) as T;

export const remove = async <T>(path = "", headers?: HeadersInit) =>
  (await asyncFetch(API_BASE_URL + path, "DELETE", headers)) as T;

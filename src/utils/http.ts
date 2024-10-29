import queryString from "query-string";

import { API_BASE_URL } from "./constant";
import { useAuthStore } from "src/stores";

const getHeader = (headers?: HeadersInit) => {
  const accessToken = useAuthStore.getState().accessToken

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
  const response = await fetch(url, {
    body,
    method,
    headers: getHeader(headers),
  });

  const result = await response.json()

  if (response.status === 401) {
    if (result.code === 'TOKEN_EXPIRED') {
      //TODO: request new accessToken
    }
    // You can display an error message to the user or take other actions
    useAuthStore.setState({ accessToken: null, user: null })
    window.location.replace("/login");
  } else {
    return result;
  }
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

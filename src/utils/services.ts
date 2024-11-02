import { get, post, remove } from "./http";

import {
  IUser,
  IChat,
  AuthDetails,
  IConference,
  FormResponse,
  LoginPayload,
  RegisterPayload,
  IAddTalkPayload,
  IAddAttendeePayload,
} from "src/app.interface";

export const login = async (payload: LoginPayload) =>
  await post<AuthDetails>("/auth/login", JSON.stringify(payload));

export const register = async (payload: RegisterPayload) =>
  await post<{ user: IUser; message: string }>(
    "/auth/signup",
    JSON.stringify(payload)
  );

export const getConferences = async () =>
  await get<FormResponse<IConference[]>>("/conferences");

export const getConference = async (id: string) =>
  await get<FormResponse<IConference>>(`/conferences/${id}`);

export const conferenceRegistration = async (
  id: string,
  payload: IAddAttendeePayload
) =>
  await post<FormResponse<IConference>>(
    `/conferences/${id}/attendee/register`,
    JSON.stringify(payload)
  );

export const addTalkToConference = async (
  id: string,
  payload: IAddTalkPayload
) =>
  await post<FormResponse<IConference>>(
    `/conferences/${id}/talk`,
    JSON.stringify(payload)
  );

export const deteleTalkFromConference = async (id: string) =>
  await remove<FormResponse>(`/conferences/talks/${id}`);

export const joinToConversation = async (id: string, talkId: string) =>
  await post<FormResponse<{ chat: IChat; conference?: IConference }>>(
    `/conferences/attendee/${id}/talk/register`,
    JSON.stringify({ talkId })
  );

export const refreshAccessToken = async () => await get<AuthDetails>(`/auth/refresh-token`);

export const logOut = async () => await remove<FormResponse>(`/auth/session`);

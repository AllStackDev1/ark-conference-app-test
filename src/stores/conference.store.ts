import { IChat, IConference, ITalk } from "src/app.interface";
import { create } from "zustand";

export type IConferenceStore = {
  status: boolean;
  chat: IChat | null;
  talk: ITalk | null;
  isLoading: boolean;
  talkId?: string | null;
  isDeletingTalk: boolean;
  isChatOpen: boolean;
  isJoiningChat: boolean;
  isAddingTalk: boolean;
  isRegistering: boolean;
  message: string | null;
  isAddTalkOpen: boolean;
  conferences: IConference[];
  clearFormState: () => void;
  conference: IConference | null;
};

const INIT_VALUES = {
  chat: null,
  talk: null,
  talkId: null,
  status: false,
  message: null,
  conferences: [],
  conference: null,
  isLoading: false,
  isChatOpen: false,
  isDeletingTalk: false,
  isJoiningChat: false,
  isAddingTalk: false,
  isRegistering: false,
  isAddTalkOpen: false,
};

export const useConferenceStore = create<IConferenceStore>((set) => ({
  ...INIT_VALUES,
  clearFormState: () => set({ status: false, message: null }),
}));

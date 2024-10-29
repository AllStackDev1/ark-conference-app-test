import { IChat, IConference, ITalk } from "src/app.interface";
import { create } from "zustand";

export type IConferenceStore = {
  status: boolean;
  chat: IChat | null;
  talk: ITalk | null;
  isChatOpen: boolean;
  joiningChat: boolean;
  message: string | null;
  isAddTalkOpen: boolean;
  conferences: IConference[];
  clearFormState: () => void;
  conference: IConference | null;
};

const INIT_VALUES = {
  chat: null,
  talk: null,
  status: false,
  message: null,
  conferences: [],
  conference: null,
  joiningChat: false,
  isChatOpen: false,
  isAddTalkOpen: false,
};

export const useConferenceStore = create<IConferenceStore>((set) => ({
  ...INIT_VALUES,
  clearFormState: () => set({ status: false, message: null }),
}));

import z from "zod";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { AuthDetails, IUser } from "src/app.interface";

export type IAuthStore = {
  status: boolean;
  logout: () => void;
  user: IUser | null;
  message: string | null;
  isSubmitting: boolean;
  clearFormState: () => void;
  errors: z.ZodIssue[] | null;
} & AuthDetails;

const INIT_VALUES = {
  user: null,
  errors: null,
  status: false,
  message: null,
  accessToken: null,
  isSubmitting: false,
};

export const useAuthStore = create(
  persist<IAuthStore>(
    (set) => ({
      ...INIT_VALUES,
      logout: () => set({ ...INIT_VALUES }),
      clearFormState: () => set({ status: false, message: null, errors: null }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

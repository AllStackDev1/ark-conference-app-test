import { toast } from "react-toastify";
import { useEffect, useRef } from "react";

import { useAuthStore, useConferenceStore } from "src/stores";

export const useAlert = (store: "auth" | "conference") => {
  const stores = {
    auth: useAuthStore,
    conference: useConferenceStore,
  };
  const hasToastBeenCalled = useRef(false);
  const { status, message, clearFormState } = stores[store].getState();

  useEffect(() => {
    if (message) {
      if (!status && !hasToastBeenCalled.current) {
        toast.error(message);
        hasToastBeenCalled.current = true; // Set flag to true after first call
      } else if (status && !hasToastBeenCalled.current) {
        toast.success(message);
        hasToastBeenCalled.current = true; // Set flag to true after first call
      }
    } else {
      hasToastBeenCalled.current = false; // Reset flag if there's no message
    }

    const timer = setTimeout(clearFormState, 5000);

    return () => {
      clearFormState()
      clearTimeout(timer)
    }; // Cleanup timeout on unmount
  }, [status, message, clearFormState]); // Add status and message to dependency array

  return null;
};


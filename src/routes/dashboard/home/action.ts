import { type ActionFunctionArgs } from "react-router-dom";

import { useAuthStore, useConferenceStore } from "src/stores";
import { conferenceRegistration } from "src/utils/services";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const conferenceId = formData.get("conferenceId")?.toString();
  const userId = useAuthStore.getState().user?.id;

  if (!userId || !conferenceId) {
    useConferenceStore.setState({ status: false,  message: "Invalid data provided." })
    return null;
  }

  try {
    const response = await conferenceRegistration(conferenceId, {userId});
    if (response.data) {
      useConferenceStore.setState({ status: true, message: response.message })
      return {};
    } else {
      useConferenceStore.setState({ status: false, message: response.message })
      return null;
    }
  } catch (error) {
    console.log(error)
    useAuthStore.setState({ status: false, message: "Something went wrong. Please try again." })
    return null;
  }
}

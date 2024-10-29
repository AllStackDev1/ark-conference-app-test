import { type Params, redirect } from "react-router-dom";

import { useConferenceStore } from "src/stores";
import { getConference } from "src/utils/services";

export async function loader({ params }: { params: Params<"id"> }) {
  if (!params.id) {
    return redirect("/home");
  }
  try {
    const { data, message } = await getConference(params.id);
    if (data) {
      useConferenceStore.setState({
        status: true,
        conference: data,
      });
    } else if (message) {
      useConferenceStore.setState({
        status: false,
        message,
      });
    }

    return null;
  } catch (error) {
    console.log(error);
    useConferenceStore.setState({
      status: false,
      message: "Something went wrong. Please try again.",
    });
    return null;
  }
}

import { useConferenceStore } from "src/stores";
import { getConferences } from "src/utils/services";

export async function loader() {
  try {
    const { data, message } = await getConferences();
    if (data) {
      useConferenceStore.setState({ conferences: data });
    } else if (message) {
      useConferenceStore.setState({ message, status: false });
    }
    return data;
  } catch (error) {
    console.log(error);
    useConferenceStore.setState({
      status: false,
      message: "Something went wrong. Please try again.",
    });
    return null;
  }
}

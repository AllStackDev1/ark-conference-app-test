import { type ActionFunctionArgs } from "react-router-dom";
import { IConference } from "src/app.interface";

import { useAuthStore, useConferenceStore } from "src/stores";
import {
  joinToConversation,
  addTalkToConference,
  deteleTalkFromConference,
} from "src/utils/services";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const topic = formData.get("topic")?.toString();
  const talkId = formData.get("talkId")?.toString();
  const datetime = formData.get("datetime")?.toString();
  const location = formData.get("location")?.toString();
  const conferenceId = formData.get("addTalk")?.toString();
  const deleteTalkId = formData.get("deleteTalkId")?.toString();
  const userId = useAuthStore.getState().user?.id;

  if (!deleteTalkId && talkId) {
    const attendee = useConferenceStore
      .getState()
      .conference?.attendees.find((attendee) => attendee.userId === userId);

    if (!attendee?.id) {
      useConferenceStore.setState({
        status: false,
        message: attendee?.id
          ? "Something went wrong."
          : "You are not an attendee to this conference, please register to engage in it.",
      });
      return null;
    }

    try {
      useConferenceStore.setState({ joiningChat: true });
      const response = await joinToConversation(attendee?.id, talkId);
      if (response.data) {
        useConferenceStore.setState({
          status: true,
          isChatOpen: true,
          joiningChat: false,
          talk: response.data.conference.talks.find(({ id }) => id === talkId),
          ...response.data,
        });
        return {};
      } else {
        useConferenceStore.setState({
          status: false,
          joiningChat: false,
          message: response.message,
        });
        return null;
      }
    } catch (error) {
      console.log(error);
      useAuthStore.setState({
        status: false,
        message: "Something went wrong. Please try again.",
      });
      return null;
    }
  } else if (deleteTalkId) {
    try {
      const response = await deteleTalkFromConference(deleteTalkId);
      if (response.message) {
        const conference = useConferenceStore.getState().conference as IConference;
        conference.talks = conference.talks.filter(({ id }) => id !== deleteTalkId);

        useConferenceStore.setState({
          conference,
          status: true,
          message: 'Talk successfully removed from conference',
        });
        return {};
      } else {
        useConferenceStore.setState({
          status: false,
          message: response.message,
        });
        return null;
      }
    } catch (error) {
      console.log(error);
      useAuthStore.setState({
        status: false,
        message: "Something went wrong. Please try again.",
      });
      return null;
    }
  } else if (conferenceId && datetime && topic && location) {
    try {
      const response = await addTalkToConference(conferenceId, {
        topic,
        location,
        datetime: new Date(datetime).toISOString(),
      });
      if (response.data) {
        useConferenceStore.setState({
          status: true,
          isAddTalkOpen: false,
          conference: response.data,
          message: response.message,
        });
        return {};
      } else {
        useConferenceStore.setState({
          status: false,
          message: response.message,
        });
        return null;
      }
    } catch (error) {
      console.log(error);
      useAuthStore.setState({
        status: false,
        message: "Something went wrong. Please try again.",
      });
      return null;
    }
  } else {
    useConferenceStore.setState({
      status: false,
      message: "Something went wrong.",
    });
    return null;
  }
}

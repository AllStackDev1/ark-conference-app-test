import z from "zod";
import { type ActionFunctionArgs } from "react-router-dom";

import { useAuthStore, useConferenceStore } from "src/stores";
import { IAddTalkPayload, IConference } from "src/app.interface";
import {
  joinToConversation,
  addTalkToConference,
  conferenceRegistration,
  deteleTalkFromConference,
} from "src/utils/services";

export const conferenceRegistrationAction = async (
  userId?: string,
  conferenceId?: string
) => {
  if (!userId || !conferenceId) {
    useConferenceStore.setState({
      status: false,
      message: "Invalid data provided.",
    });
    return null;
  }
  useConferenceStore.setState({ isRegistering: true });
  conferenceRegistration(conferenceId, { userId })
    .then(({ data, message }) => {
      if (data) {
        useConferenceStore.setState({ status: true, message });
      } else if (message) {
        useConferenceStore.setState({ status: false, message });
      }
    })
    .catch(() => {
      useConferenceStore.setState({
        status: false,
        message: "Something went wrong. Please try again.",
      });
    })
    .finally(() => {
      useConferenceStore.setState({ isRegistering: false });
    });

  return null;
};

export const joinToConversationAction = async (
  userId: string,
  talkId: string
) => {
  useConferenceStore.setState({ talkId, isJoiningChat: true });

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

  joinToConversation(attendee?.id, talkId)
    .then(({ data, message }) => {
      if (data) {
        useConferenceStore.setState({
          status: true,
          isChatOpen: true,
          talk: data.conference.talks.find(({ id }) => id === talkId),
          ...data,
        });
      } else {
        useConferenceStore.setState({
          message,
          status: false,
        });
      }
    })
    .catch(() => {
      useConferenceStore.setState({
        status: false,
        isJoiningChat: false,
        message: "Something went wrong. Please try again.",
      });
    })
    .finally(() => {
      useConferenceStore.setState({ isJoiningChat: false });
    });

  return null;
};

export const removeTalkAction = async (talkId: string) => {
  useConferenceStore.setState({ talkId, isDeletingTalk: true });
  deteleTalkFromConference(talkId)
    .then(({ message }) => {
      if (message) {
        const conference = useConferenceStore.getState()
          .conference as IConference;
        conference.talks = conference.talks.filter(({ id }) => id !== talkId);

        useConferenceStore.setState({
          conference,
          status: true,
          message: "Talk successfully removed from conference",
        });
      } else {
        throw new Error("");
      }
    })
    .catch(() => {
      useConferenceStore.setState({
        status: false,
        message: "Something went wrong. Please try again.",
      });
    })
    .finally(() => {
      useConferenceStore.setState({ talkId: null, isDeletingTalk: false });
    });

  return null;
};

export const addTalkToConferenceAction = async (
  id: string,
  payload: Partial<IAddTalkPayload>
) => {
  const schema = z.object({
    topic: z.string(),
    datetime: z.string(),
    location: z.string(),
  });
  const { error, data } = schema.safeParse(payload);

  if (error) {
    useConferenceStore.setState({
      status: false,
      message: "Invalid data provided.",
    });
    return null;
  }

  useConferenceStore.setState({ isAddingTalk: true });

  addTalkToConference(id, data!)
    .then(({ data, message }) => {
      if (data) {
        useConferenceStore.setState({
          message,
          status: true,
          conference: data,
          isAddTalkOpen: false,
        });
      } else if (message) {
        useConferenceStore.setState({
          message,
          status: false,
        });
      }
    })
    .catch(() => {
      useConferenceStore.setState({
        status: false,
        message: "Something went wrong. Please try again.",
      });
    })
    .finally(() => {
      useConferenceStore.setState({ isAddingTalk: false });
    });

  return null;
};

export async function homeRouteAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const conferenceId = formData.get("conference_id")?.toString();
  const userId = useAuthStore.getState().user?.id;

  return conferenceRegistrationAction(userId, conferenceId);
}

export async function conferenceRouteAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userId = useAuthStore.getState().user?.id;
  const topic = formData.get("topic")?.toString();
  const talkId = formData.get("talk_id")?.toString();
  const formId = formData.get("form-id")?.toString();
  const datetime = formData.get("datetime")?.toString();
  const location = formData.get("location")?.toString();
  const conferenceId = formData.get("conference_id")?.toString();

  switch (formId) {
    case "conference-registration":
      return conferenceRegistrationAction(userId, conferenceId);
    case "join-conversation":
      return joinToConversationAction(userId!, talkId!);
    case "add-talk-to-conference":
      return addTalkToConferenceAction(conferenceId!, {
        topic,
        location,
        datetime: new Date(datetime!).toISOString(),
      });
    case "delete-talk":
      return removeTalkAction(talkId!);
    default:
      return null;
  }
}

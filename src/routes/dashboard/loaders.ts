import { redirect, type Params } from "react-router-dom";
import { useConferenceStore } from "src/stores";
import { getConference, getConferences } from "src/utils/services";

export const loadConferences = async () => {
  getConferences()
    .then(({ data, message }) => {
      if (data) {
        useConferenceStore.setState({ conferences: data });
      } else if (message) {
        useConferenceStore.setState({ message, status: false });
      }
    })
    .catch(() => {
      useConferenceStore.setState({
        status: false,
        message: "Something went wrong. Please try again.",
      });
    })
    .finally(() => {
      useConferenceStore.setState({ isLoading: false });
    });

  return null;
};

export const loadConference = async (id: string) => {
  const currentConference = useConferenceStore.getState().conference;
  if (!currentConference || currentConference.id !== id) {
    getConference(id)
      .then(({ data, message }) => {
        if (data) {
          useConferenceStore.setState({ conference: data });
        } else if (message) {
          useConferenceStore.setState({ message, status: false });
        }
      })
      .catch(() => {
        useConferenceStore.setState({
          status: false,
          message: "Something went wrong. Please try again.",
        });
      })
      .finally(() => {
        useConferenceStore.setState({ isLoading: false });
      });
  } else {
    useConferenceStore.setState({ isLoading: false });
  }

  return null;
};

export async function homeRouteLoader() {
  useConferenceStore.setState({ isLoading: true });

  return loadConferences();
}

export async function conferenceRouteLoader({
  params,
}: {
  params: Params<"id">;
}) {
  if (!params.id) {
    return redirect("/home");
  }

  useConferenceStore.setState({ isLoading: true });

  return loadConference(params.id);
}

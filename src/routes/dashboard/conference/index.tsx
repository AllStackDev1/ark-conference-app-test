import { format } from "date-fns";
import {
  MdPeople,
  MdAccessTime,
  MdDeleteSweep,
  MdLocationPin,
  MdCalendarMonth,
} from "react-icons/md";
import { Form } from "react-router-dom";
import { IoChatbubbles } from "react-icons/io5";

import { useAlert } from "src/hooks";
import { useAuthStore, useConferenceStore } from "src/stores";
import { ChatModal, AddTalkModal } from "src/components";

export const Conference = () => {
  const user = useAuthStore((s) => s.user);
  const { conference, isChatOpen, isAddTalkOpen } = useConferenceStore((s) => s);

  document.title = "Conferences | " + conference?.theme;

  useAlert("conference");

  return (
    <div className="space-y-8">
      <div className="">
        <img
          alt={conference?.theme}
          src={conference?.image}
          className="w-full h-[400px] object-cover rounded-t-md"
          loading="eager"
        />

        <div className="flex justify-between items-center">
          <div className="p-4 space-y-2 text-[#242947]">
            <div>
              <h2 className="text-xl font-bold">{conference?.theme}</h2>
              <div className="flex space-x-1 items-center">
                <MdLocationPin fontSize={20} />
                <p className="text-lg">{conference?.location}</p>
              </div>
              <div className="flex space-x-1 items-center">
                <MdCalendarMonth fontSize={18} />
                <p className="text-md text-gray-500">
                  {format(
                    new Date(conference?.datetime || ""),
                    "EEEE do MMMM yyyy 'at' h:mm a"
                  )}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => useConferenceStore.setState({ isAddTalkOpen: true })}
            className="flex space-x-2 h-min bg-green-600 uppercase text-sm text-white font-semibold px-4 py-2 rounded shadow-md"
          >
            <span>Add Talk</span>
            <IoChatbubbles fontSize={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-3">
          <h2 className="text-2xl font-bold">Talks</h2>
          <div className="grid grid-cols-3 gap-4 h-full">
            {conference?.talks.map((talk) => (
              <div
                key={talk.id}
                className="col-span-1 group border border-gray-200 rounded-md relative h-fit p-3 shadow-md"
              >
                <h3 className="text-lg font-bold">{talk.topic}</h3>
                <div className="flex space-x-1 items-center">
                  <MdCalendarMonth fontSize={18} />
                  <p className="text-md text-gray-500">
                    {format(new Date(talk?.datetime || ""), "do MMMM yyyy")}
                  </p>
                </div>
                <div className="flex space-x-1 items-center">
                  <MdAccessTime fontSize={18} />
                  <p className="text-md text-gray-500">
                    {format(new Date(talk.datetime || ""), "h:mm a")}
                  </p>
                </div>
                <div className="flex space-x-1 items-center">
                  <MdLocationPin fontSize={18} />
                  <p className="text-md text-gray-500">{talk.location}</p>
                </div>
                <div className="flex space-x-1 items-center">
                  <MdPeople fontSize={18} />
                  <p className="text-md text-gray-500">
                    {talk.attendees.length} Attendees
                  </p>
                </div>

                <div className="space-y-3 mt-2">
                  <Form
                    method="post"
                    className="flex justify-center w-full items-center text-white"
                  >
                    <button
                      name="talkId"
                      type="submit"
                      value={talk.id}
                      title={
                        talk.attendees.find(({ userId }) => userId === user?.id)
                          ? "Continue Conversing"
                          : "Join conversation"
                      }
                      className="flex space-x-2 justify-center bg-green-600 uppercase text-sm w-full font-semibold px-4 py-2 rounded shadow-md"
                    >
                      <span>
                        {talk.attendees.find(
                          ({ userId }) => userId === user?.id
                        )
                          ? "Continue Conversing"
                          : "Join conversation"}
                      </span>
                      <IoChatbubbles fontSize={24} />
                    </button>
                  </Form>

                  <Form
                    method="post"
                    className="flex justify-center items-center w-full text-white"
                  >
                    <button
                      name="deleteTalkId"
                      type="submit"
                      value={talk.id}
                      className="flex justify-center space-x-2 bg-red-600 w-full uppercase text-sm font-semibold px-4 py-2 rounded shadow-md"
                    >
                      <span>Delete Talk</span>
                      <MdDeleteSweep fontSize={24} />
                    </button>
                  </Form>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1 p-4 bg-gray-100 rounded-md shadow-sm space-y-3">
          <h3 className="text-xl font-bold">Attendees</h3>
          <div className="space-y-2">
            {conference?.attendees?.map(({ user }) => (
              <div key={user?.id} className="flex space-x-3 items-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
                  alt={user?.firstName + " " + user?.lastName}
                  className="w-10 h-10 rounded-full"
                />
                <h3 className="text-lg">
                  {user?.firstName} {user?.lastName}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isChatOpen && (
        <ChatModal
          onClose={() => useConferenceStore.setState({ isChatOpen: false })}
        />
      )}
      {isAddTalkOpen && (
        <AddTalkModal
          onClose={() => useConferenceStore.setState({ isAddTalkOpen: false })}
        />
      )}
    </div>
  );
};

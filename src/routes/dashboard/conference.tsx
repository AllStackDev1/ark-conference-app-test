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
import { PiUserCirclePlusFill } from "react-icons/pi";

import { useAlert } from "src/hooks";
import { useAuthStore, useConferenceStore } from "src/stores";
import { ChatModal, AddTalkModal, Button } from "src/components";

export const Conference = () => {
  const user = useAuthStore((s) => s.user);
  const {
    talkId,
    conference,
    isLoading,
    isRegistering,
    isJoiningChat,
    isDeletingTalk,
    isChatOpen,
    isAddTalkOpen,
  } = useConferenceStore((s) => s);

  document.title = "Conferences | " + conference?.theme || "";

  useAlert("conference");

  const attendee = conference?.attendees.find(
    (attendee) => attendee.userId === user?.id
  );

  return (
    <div className="space-y-8">
      {!conference || isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
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

              <div className="flex space-x-4">
                {attendee ? (
                  <Button
                    onClick={() =>
                      useConferenceStore.setState({ isAddTalkOpen: true })
                    }
                  >
                    <span>Add Talk</span>
                    <IoChatbubbles fontSize={24} />
                  </Button>
                ) : (
                  <Form method="post" className="flex justify-end">
                    <input
                      hidden
                      value="conference-registration"
                      name="form-id"
                    />
                    <Button
                      type="submit"
                      name="conference_id"
                      value={conference?.id}
                      isLoading={isRegistering}
                    >
                      <PiUserCirclePlusFill fontSize={24} />
                      <span>Register Now</span>
                    </Button>
                  </Form>
                )}
              </div>
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

                    {attendee && (
                      <div className="space-y-3 mt-2">
                        <Form
                          method="post"
                          className="flex justify-center w-full items-center text-white"
                        >
                          <input
                            hidden
                            value="join-conversation"
                            name="form-id"
                          />
                          <Button
                            name="talk_id"
                            type="submit"
                            value={talk.id}
                            loadingText="Joining"
                            isDisabled={isChatOpen && talkId == talk.id}
                            isLoading={talkId === talk.id && isJoiningChat}
                            title={
                              talk.attendees.find(
                                ({ userId }) => userId === user?.id
                              )
                                ? "Continue Conversing"
                                : "Join conversation"
                            }
                          >
                            <span>
                              {talk.attendees.find(
                                ({ userId }) => userId === user?.id
                              )
                                ? "Continue Conversing"
                                : "Join conversation"}
                            </span>
                            <IoChatbubbles fontSize={24} />
                          </Button>
                        </Form>

                        {talk.attendees.length == 0 && (
                          <Form
                            method="post"
                            className="flex justify-center items-center w-full text-white"
                          >
                            <input hidden value="delete-talk" name="form-id" />
                            <Button
                              name="talk_id"
                              type="submit"
                              value={talk.id}
                              bgColor="bg-red-600"
                              loadingText="Deleting"
                              isLoading={talkId === talk.id && isDeletingTalk}
                            >
                              <span>Delete Talk</span>
                              <MdDeleteSweep fontSize={24} />
                            </Button>
                          </Form>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-1 p-4 bg-gray-100 rounded-md shadow-md space-y-3 h-min">
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
              onClose={() =>
                useConferenceStore.setState({ isAddTalkOpen: false })
              }
            />
          )}
        </>
      )}
    </div>
  );
};

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { format } from "date-fns";
import { io } from "socket.io-client";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import { Fade } from "react-awesome-reveal";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Message,
  MessageList,
  MessageInput,
  ChatContainer,
  MainContainer,
  TypingIndicator,
  MessageSeparator,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";

import { useAuthStore, useConferenceStore } from "src/stores";
import { API_BASE_URL } from "src/utils/constant";
import { MessageListData } from "src/app.interface";

const socket = io(API_BASE_URL, {
  query: {
    authorization: useAuthStore.getState().accessToken,
  },
});

export function ChatModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuthStore((s) => s);
  
  const { chat, talk, joiningChat } = useConferenceStore((s) => s);
  const [typing, setTyping] = useState("");

  const chatHistories = useMemo(() => {
    if (!chat) return [];

    const dateSeparatorIndexes: number[] = [];

    const histories = chat.histories.map((history, index) => {
      // store date separator indexes
      const currentDate = new Date(history.timestamp).toDateString();
      const prevDate =
        index > 0
          ? new Date(chat.histories[index - 1].timestamp).toDateString()
          : null;

      if (index === 0 || currentDate !== prevDate) {
        dateSeparatorIndexes.push(index);
      }

      if (!history.type) {
        const refinedMgs = {
          type: "message",
          message: history.message,
          // determine the direction based on the active user
          direction: history.senderId === user?.id ? "outgoing" : "incoming",
          sentTime: format(new Date(history.timestamp), "hh:mm a"),
          sender: `${history.sender.firstName} ${history.sender.lastName}`,
          img: `https://ui-avatars.com/api/?name=${history.sender.firstName}+${history.sender.lastName}&background=random`,
        };

        // determine the position based on how previous message, current message and next message related
        const prev = index !== 0 ? chat.histories[index - 1] : null;
        const next =
          index !== chat.histories.length - 1
            ? chat.histories[index + 1]
            : null;

        if (
          (index === 0 && next?.sender.id === history.sender.id) ||
          (prev?.sender.id !== history.sender.id &&
            next?.sender.id === history.sender.id)
        ) {
          return { ...refinedMgs, position: "first" };
        } else if (
          index === chat.histories.length - 1 ||
          next?.sender.id !== history.sender.id
        ) {
          return { ...refinedMgs, position: "last" };
        } else if (
          prev?.sender.id === history.sender.id &&
          next?.sender.id === history.sender.id
        ) {
          return { ...refinedMgs, position: "normal" };
        } else {
          return { ...refinedMgs, position: "single" };
        }
      }

      if (history.type !== "message") {
        return history;
      }
    }) as Partial<MessageListData[]>;

    // add date separator
    dateSeparatorIndexes.reverse().forEach((index) => {
      const message = format(
        new Date(chat.histories[index].timestamp),
        "EEEE, dd MMMM yyyy"
      );
      histories.splice(index, 0, { type: "date", message });
    });

    return histories as MessageListData[];
  }, [chat, user]);

  useEffect(() => {
    if (chat) {
      socket.emit("joinRoom", chat.id);

      socket.on("message", (data) => {
        const histories = [...chat.histories, { ...data }];
        useConferenceStore.setState({ chat: { ...chat, histories } });
      });

      socket.on("userLeft", (data) => {
        const histories = [...chat.histories, { ...data, type: "left" }];
        useConferenceStore.setState({ chat: { ...chat, histories } });
      });

      socket.on("isUserTyping", (data) => {
        setTyping(data.message);
      });

      socket.on("userJoined", (data) => {
        const histories = [...chat.histories, { ...data, type: "joined" }];
        useConferenceStore.setState({ chat: { ...chat, histories } });
      });
    }

    return () => {
      if (chat) {
        socket.emit("leaveRoom", chat.id);
        socket.off("message");
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = (message: string) => {
    if (message && chat) {
      socket.emit("message", { chatId: chat.id, message });
      sendTypingState(false);
    }
  };

  const sendTypingState = (isTyping: boolean) => {
    socket.emit("isTyping", { chatId: chat?.id, isTyping });
  };

  return createPortal(
    <div className="absolute right-4 bottom-4">
      <Fade duration={3000} direction="up">
        <div className="relative h-[600px] w-[400px] rounded-t-lg rounded-br-lg">
          <MainContainer
            responsive
            style={{
              height: "600px",
            }}
            className="rounded-t-lg rounded-br-lg"
          >
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Content>
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap text-gray-600">
                      {talk?.topic}
                    </h2>
                    <button
                      onClick={onClose}
                      className="bg-gray-200 opacity-70 hover:opacity-100 shadow-sm rounded-full p-1 w-min"
                    >
                      <MdClose fontSize={30} className="text-gray-600" />
                    </button>
                  </div>
                </ConversationHeader.Content>
              </ConversationHeader>
              <MessageList
                typingIndicator={
                  typing ? <TypingIndicator content={typing} /> : undefined
                }
                loading={joiningChat}
                // loadingMore={true}
                // loadingMorePosition="bottom"
              >
                {chatHistories.filter(d=> !!d).map((data, i) => {
                  return (
                    <Fragment key={i + data?.message}>
                      {data?.type === "message" ? (
                        <Message
                          avatarSpacer={
                            !["single", "last"].includes(data.position)
                          }
                          model={{
                            direction: data.direction,
                            message: data.message,
                            position: data.position,
                          }}
                        >
                          {["single", "last"].includes(data.position) && (
                            <Avatar name={data.sender} src={data.img} />
                          )}
                          {["single", "last"].includes(data.position) && (
                            <Message.Footer>
                              <span className="text-xs">{data.sentTime}</span>
                            </Message.Footer>
                          )}
                        </Message>
                      ) : (
                        <MessageSeparator content={data?.message} />
                      )}
                    </Fragment>
                  );
                })}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                attachButton={false}
                onChange={() => sendTypingState(true)}
                onBlur={() => sendTypingState(false)}
                onSend={sendMessage}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </Fade>
    </div>,
    document.getElementById("main") || document.body
  );
}

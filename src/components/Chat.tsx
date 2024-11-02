import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { format } from "date-fns";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import { useBeforeUnload } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { Fragment, useEffect, useMemo, useState, useCallback } from "react";
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
import { IChat, IChatHistory, MessageListData } from "src/app.interface";
import { useSocketIO } from "src/hooks";

export function ChatModal({ onClose }: { onClose: () => void }) {
  const { chat, talk, isJoiningChat } = useConferenceStore((s) => s);
  const { user, accessToken } = useAuthStore((s) => s);
  const [typing, setTyping] = useState("");

  const socket = useSocketIO(accessToken!);

  const chatHistories = useMemo(() => {
    if (!chat?.histories?.length) return [];

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

  const updateChat = (payload: IChatHistory) => {
    const _chat = useConferenceStore.getState().chat as IChat;
    const histories = [..._chat.histories, { ...payload }];
    useConferenceStore.setState({ chat: { ..._chat, histories } });
  };

  const disconnectSocket = useCallback(() => {
    if (chat?.id && socket) {
      socket.emit("leftChat", chat.id);
      socket.off("message");
    }
  }, [chat?.id, socket]);

  useBeforeUnload(disconnectSocket);

  useEffect(() => {
    if (chat?.id && socket) {
      socket.emit("joinRoom", chat.id);

      socket.on("message", updateChat);

      socket.on("userLeft", (data) => updateChat({ ...data, type: "left" }));

      socket.on("isUserTyping", (data) => {
        setTyping(data.message);
      });

      socket.on("userJoined", (data) =>
        updateChat({ ...data, type: "joined" })
      );
    }

    return () => disconnectSocket();
  }, [chat?.id, socket, disconnectSocket]);

  const sendMessage = (message: string) => {
    if (message && chat && socket) {
      socket.emit("message", { chatId: chat.id, message });
      sendTypingState(false);
    }
  };

  const sendTypingState = (isTyping: boolean) => {
    if (chat && socket) {
      socket.emit("isTyping", { chatId: chat?.id, isTyping });
    }
  };

  return createPortal(
    <div className="absolute right-4 bottom-4">
      <Fade duration={3000} direction="up">
        <div className="relative h-[600px] w-[400px] rounded-t-lg rounded-br-lg">
          <MainContainer
            responsive
            style={{ height: "600px" }}
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
                      onClick={() => {
                        disconnectSocket();
                        onClose();
                      }}
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
                loading={isJoiningChat}
                // loadingMore={true}
                // loadingMorePosition="bottom"
              >
                {chatHistories
                  .filter((d) => !!d)
                  .map((data, i) => {
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

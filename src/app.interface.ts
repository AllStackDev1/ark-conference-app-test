/* eslint-disable @typescript-eslint/no-explicit-any */
export type IClickEvent<T = HTMLButtonElement | HTMLAnchorElement> =
  React.MouseEvent<T, MouseEvent>;

export type IChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type LoginPayload = {
  email: string;
  password: string;
}

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type FormResponse<T = any> = {
  status: boolean;
  errors: any;
  message: string;
  data?: T;
};

type IDocument = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type IUser = {
  firstName: string;
  lastName: string;
  email: string;
} & IDocument;

export type AuthDetails = {
  message?: string | null;
  accessToken: string | null;
  user: IUser | null;
};

export type IConference = {
  image: string;
  theme: string;
  datetime: string;
  location: string;
  talks: ITalk[];
  attendees: IAttendee[]
} & IDocument;

export type IConferencePayload = Pick<IConference, "image" | "theme" | "datetime" | "location">

export type ITalk = {
  topic: string;
  datetime: string;
  location: string;
  attendees: IAttendee[];
} & IDocument;

export type IAddTalkPayload = Pick<ITalk, "topic" | "datetime" |  "location">

export type IAttendee = {
  user: IUser;
  talk?: ITalk;
  userId: string;
  talkId: string;
  conferenceId: string;
} & IDocument;

export type IAddAttendeePayload = Pick<IAttendee, "userId">

export type IChatMember = {
  user: IUser;
  chatId: string;
  userId: string;
  joinedAt: string;
} & IDocument;

export type IChatHistory = {
  type?: "message" | "joined" | "date" | "left";
  chatId: string;
  sender: IUser;
  message: string;
  senderId: string;
  timestamp: string;
} & IDocument;

export type IChat = {
  talkId: string;
  members: IChatMember[];
  histories: IChatHistory[];
} & IDocument;

type MessageData = {
  position: "last" | "first" | "normal" | "single";
  message: string;
  direction: "incoming" | "outgoing";
  sentTime: string;
  sender: string;
  img?: string;
  type: "message" | "joined";
};

type DateData = {
  message: string;
  type: "date";
};

type JoinedData = {
  message: string;
  type: "joined";
};

// Combine the types into a union type
export type MessageListData = MessageData | DateData | JoinedData;

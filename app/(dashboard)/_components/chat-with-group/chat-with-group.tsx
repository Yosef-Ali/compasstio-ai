import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

import { CardMessage } from "./card-messege";

interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  content?: string;
  senderId?: string;
  avatarUrl?: string;
  messageId: string;
  chatId: string;
  isRead: boolean;
}

export default function ChatWithGroup() {

  const messages = useQuery(api.messages.get) as Message[];

  if (messages === undefined) {
    return (
      <div className="space-y-3">
        <CardMessage.Skeleton />
        <CardMessage.Skeleton />
        <CardMessage.Skeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {messages?.map(message => {

        // Create fullname from senderId
        // const fullname = getFullnameFromSenderId(message.senderId);

        return (
          <CardMessage
            key={message._id}
            name={message.senderId ?? " "}
            content={message.content ?? " "}
            creationTime={message._creationTime}
            avatarUrl={message.avatarUrl ?? " "}
            onClick={() => { }}
          />
        );
      })}
    </div>
  );
}

// function getFullnameFromSenderId(senderId) {
//   // Lookup senderId in contacts list 
//   // and return the fullname
//   return "John Doe";
// }
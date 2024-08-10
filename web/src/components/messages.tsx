import { useParams } from "react-router-dom";
import { Message } from "./message";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRoomMessages } from "../http/get-room-messages";
import { useMessagesWebSockets } from "../hooks/use-messages-web-sockets";

export function Messages() {
  const { roomID } = useParams();

  if (!roomID) {
    throw new Error("Messages component must be used within room page");
  }

  const { data } = useSuspenseQuery({
    queryKey: ["messages", roomID],
    queryFn: () => getRoomMessages({ roomID }),
  });

  useMessagesWebSockets({ roomID });

  const sortedMessages = data.messages.sort((a, b) => {
    return b.amountOfReactions - a.amountOfReactions;
  });

  return (
    <ol className="list-decimal list-outside px-3 space-y-8">
      {sortedMessages.map((message) => {
        return (
          <Message
            key={message.id}
            id={message.id}
            text={message.text}
            amountOfReactions={message.amountOfReactions}
            answered={message.answered}
          />
        );
      })}
    </ol>
  );
}

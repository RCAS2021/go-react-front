import { useEffect } from "react";
import { GetRoomMessagesResponse } from "../http/get-room-messages";
import { useQueryClient } from "@tanstack/react-query";

interface UseMessagesWebSocketsParams {
    roomID: string
}

export function useMessagesWebsockets({ roomID, }: UseMessagesWebSocketsParams) {
    const queryClient = useQueryClient()

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomID}`);
    
        ws.onopen = () => {
          console.log("Websocket connected!");
        };
    
        ws.onclose = () => {
          console.log("Webosocket connection closed!");
        };
    
        ws.onmessage = (event) => {
          const data: {
            kind:
              | "message_created"
              | "message_answered"
              | "message_reaction_increased"
              | "message_reaction_decreased";
            value: any;
          } = JSON.parse(event.data);
    
          switch (data.kind) {
            case "message_created":
              queryClient.setQueryData<GetRoomMessagesResponse>(
                ["messages", roomID],
                (state) => {
                  return {
                    messages: [
                      ...(state?.messages ?? []),
                      {
                        id: data.value.id,
                        text: data.value.message,
                        amountOfReactions: 0,
                        answered: false,
                      },
                    ],
                  };
                }
              );
              break;
    
            case "message_answered":
              queryClient.setQueryData<GetRoomMessagesResponse>(
                ["messages", roomID],
                (state) => {
                  if (!state) {
                    return undefined;
                  }
                  return {
                    messages: state.messages.map((item) => {
                      if (item.id === data.value.id) {
                        return { ...item, answered: true };
                      }
    
                      return item;
                    }),
                  };
                }
              );
              break;
            case "message_reaction_increased":
            case "message_reaction_decreased":
              queryClient.setQueryData<GetRoomMessagesResponse>(
                ["messages", roomID],
                (state) => {
                  if (!state) {
                    return undefined;
                  }
                  return {
                    messages: state.messages.map((item) => {
                      if (item.id === data.value.id) {
                        return { ...item, amountOfReactions: data.value.count };
                      }
    
                      return item;
                    }),
                  };
                }
              );
              break;
          }
        };
    
        return () => {
          ws.close();
        };
      }, [roomID, queryClient]);
}
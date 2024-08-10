interface GetRoomMessagesRequest {
    roomID: string
}

export interface GetRoomMessagesResponse {
    messages: {
        id: string;
        text: string;
        amountOfReactions: number;
        answered: boolean;
    }[]
}

export async function getRoomMessages({ roomID }: GetRoomMessagesRequest): Promise<GetRoomMessagesResponse> {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms/${roomID}/messages`)

    const data: Array<{
        ID: string
        RoomID: string
        Message: string
        ReactionCount: number
        Answered: boolean
    }> = await response.json()
    
    return {
        messages: data.map(item => {
            return {
                id: item.ID,
                text: item.Message,
                amountOfReactions: item.ReactionCount,
                answered: item.Answered,
            }
        })
    }

}
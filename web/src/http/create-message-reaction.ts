interface CreateMessageReactionRequest {
    roomID: string
    messageID: string
}
  
export async function createMessageReaction({ roomID, messageID }: CreateMessageReactionRequest) {
    await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms/${roomID}/messages/${messageID}/react`, {
        method: 'PATCH',
    })
}
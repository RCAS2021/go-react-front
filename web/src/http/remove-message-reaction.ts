interface RemoveMessageReactionRequest {
    roomID: string
    messageID: string
}
  
export async function removeMessageReaction({ roomID, messageID }: RemoveMessageReactionRequest) {
    await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms/${roomID}/messages/${messageID}/react`, {
        method: 'DELETE',
    })
}
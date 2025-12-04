import { type Message, type FoodItem } from '../modules/chat/types'

const API_URL = '/api/chat';

export const sendMessageToAI = async (messageContent: string, sessionId?: number | string): Promise<{ aiMessage: Message, sessionId: string }> => {
  const token = localStorage.getItem('token');

  if(!token) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await fetch(`${API_URL}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: messageContent,
        session_id: sessionId
      }),
    });

    const data = await response.json();

    if(!response.ok) {
      throw new Error(data.error || 'Failed to send message');
    }

    const aiMessage: Message = {
      role: 'ai',
      type: data.metadata?.type || 'chat',
      content: data.message,
      data: data.data as FoodItem[]
    };

    return { 
      aiMessage, 
      sessionId: data.session_id
    };
    
  } catch (error) {
    console.error("Chat Service Error:", error);

    throw error;
  }

}
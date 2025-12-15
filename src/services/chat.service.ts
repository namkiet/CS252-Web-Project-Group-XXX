import type { FoodItem } from '../modules/chat/types';

const enrichFoodItem = (rawItem: any, index: number): FoodItem => {
  return {
    id: `suggestion_${Date.now()}_${index}`,
    restaurant_name: rawItem.restaurant_name || "Delicious Restaurant",
    image: rawItem.image,
    desc: rawItem.desc || rawItem.description || "No description",
    address: rawItem.address || "address",
    star: rawItem.star ? parseFloat(rawItem.star) : 0,
    dish_name: rawItem.dish_name || "Pho",
    priceRange: rawItem.priceRange,
    openTime: "",
    coordinates: rawItem.coordinates 
      ? { lat: rawItem.coordinates.lat, lng: rawItem.coordinates.lng } 
      : undefined,
  };
};

interface ChatAPIResponse {
  status: "success";
  session_id: string;
  message: {
    role: "assistant";
    content: string;
  };
  widget: {
    type: "chat" | "recommendation";
    payload: FoodItem[] | undefined;
  };
}

const API_URL = "/api/chat";

export const chatService = {
  sendMessage: async (payload: {
    session_id?: string;
    message: string;
    user_context?: { location?: string; timezone?: string };
    attachments?: any[];
  }): Promise<ChatAPIResponse> => {
    // console.log('[sendMessage] Sending message:', payload);
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }
    const API_URL_MESSAGE = API_URL + "/message"
    const response = await fetch(API_URL_MESSAGE, {
      method: "POST", headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },  
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    // console.log('[sendMessage] Received response:', data);
    if (!response.ok) {
      console.error("Chat API error:", data);
      throw new Error(data.error || "Failed to send message");
    }

    if (
      data.status === "success" &&
      data.widget?.type === "recommendation" &&
      Array.isArray(data.widget.payload)
    ) {
      data.widget.payload = data.widget.payload.map(enrichFoodItem);
    }

    sessionStorage.setItem("last_session_id", data.session_id);

    return data as ChatAPIResponse;
  },

  sendText: async (
    message: string,
    sessionId: string,
    location?: string
  ): Promise<ChatAPIResponse> => {
    return chatService.sendMessage({
      session_id: sessionId,
      message,
      user_context: location ? { location } : undefined,
      attachments: [],
    });
  },
};
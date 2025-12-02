// src/services/chat.service.ts

import type { FoodItem } from '../modules/chat/types';


/**
 * Maps raw data from backend to the full FoodItem interface used by the UI.
 * Backend only sends minimal fields → frontend fills in the missing ones with defaults.
 */
const enrichFoodItem = (rawItem: any, index: number): FoodItem => {
  return {
    id: `suggestion_${Date.now()}_${index}`,           // Temporary unique ID (React key)
    name: rawItem.restaurant_name || "Delicious Restaurant",
    image: "",                                   // Use the same nice default image for every suggestion
    description: rawItem.desc || rawItem.description || "",
    address: rawItem.address || "",
    rating: rawItem.star ? parseFloat(rawItem.star) : 0, // Convert string "4.8" → number 4.8
    cuisine: rawItem.dish_name || "",
    priceRange: "",
    openTime: "",
  };
};

// Response shape from /api/chat endpoint
interface ChatAPIResponse {
  status: "success";
  session_id: string;
  message: {
    role: "assistant";
    content: string;
  };
  widget: {
    type: "chat" | "recommendation";
    payload: FoodItem[] | undefined; // After enrichment → full FoodItem[]
  };
}

const API_URL = "/api/chat";

export const chatService = {
  /**
   * Send user message to backend and get AI response.
   * Automatically enriches recommendation payload with missing UI fields.
   */
  sendMessage: async (payload: {
    session_id?: string;
    message: string;
    user_context?: { location?: string; timezone?: string };
    attachments?: any[];
  }): Promise<ChatAPIResponse> => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(API_URL, {
      method: "POST", headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("SidebarHistory API Response:",payload.session_id)
    console.log("SidebarHistory API Response:", data);
    if (!response.ok) {
      console.error("Chat API error:", data);
      throw new Error(data.error || "Failed to send message");
    }

    // Enrich recommendation payload with default image + other missing fields
    if (
      data.status === "success" &&
      data.widget?.type === "recommendation" &&
      Array.isArray(data.widget.payload)
    ) {
      data.widget.payload = data.widget.payload.map(enrichFoodItem);
    }

    // Save session_id for next messages (very convenient UX)
    localStorage.setItem("last_session_id", data.session_id);

    return data as ChatAPIResponse;
  },

  /**
   * Quick helper for sending plain text messages (most common use case)
   */
  sendText: async (
    message: string,
    sessionId: string,
    location?: string
  ): Promise<ChatAPIResponse> => {
    console.log("Before setter the new id" , sessionId)
    return chatService.sendMessage({
      session_id: sessionId,
      message,
      user_context: location ? { location } : undefined,
      attachments: [],
    });
  },
};
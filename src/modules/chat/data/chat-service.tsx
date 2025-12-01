import type { Message } from '../types';
import { MOCK_FOOD_ITEMS, MOCK_AI_RESPONSE_TEXT, MOCK_DEFAULT_TEXT } from './mock-data';

export const sendMessageToAI = async (userMessage: string): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = userMessage.toLowerCase();
      
      if (lower.includes("gợi ý") || lower.includes("quán") || lower.includes("ăn")) {
        resolve({
          role: 'ai',
          type: 'recommendation',
          content: `${MOCK_AI_RESPONSE_TEXT} "${userMessage}"`,
          data: MOCK_FOOD_ITEMS
        });
      } else {
        resolve({
          role: 'ai',
          type: 'chat',
          content: MOCK_DEFAULT_TEXT,
        });
      }
    }, 1500);
  });
};
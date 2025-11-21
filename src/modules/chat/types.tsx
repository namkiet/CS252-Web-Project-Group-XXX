export type FoodItem = {
  id: string;
  name: string;
  image: string;
  description: string;
  address: string;
  rating: number;
};

export type Message = {
  role: 'user' | 'ai';
  type: 'chat' | 'recommendation';
  content: string;
  data?: FoodItem[];
};
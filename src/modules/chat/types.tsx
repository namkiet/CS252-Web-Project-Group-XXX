export type FoodItem = {
  id: string;
  name: string;
  image: string;
  description: string;
  address: string;
  rating: number;
  cuisine?: string;
  priceRange?: string;
  openTime?: string;
};

export type Message = {
  role: 'user' | 'ai';
  type: 'chat' | 'recommendation';
  content: string;
  data?: FoodItem[];
};

export type Conversation = {
  messages: Message[];
  title: string ;
};

export type ScheduleItem = {
  activity: string;
  day: number;
  food?: FoodItem | null;
}

export type ScheduleDay = {
  day: number ;
  scheduleInDay: ScheduleItem[];
}
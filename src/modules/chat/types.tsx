export type FoodItem = {
  id: string;
  restaurant_name: string;
  image: string;
  desc: string;
  address: string;
  star: number;
  dish_name?: string;
  priceRange?: string;
  openTime?: string;
  coordinates?: { 
    lat: number; 
    lng: number; 
  };
};

export type Message = {
  role: 'user' | 'ai';
  type: 'chat' | 'recommendation';
  content: string;
  data?: FoodItem[];
};

export type Conversation = {
  id: string;
  messages: Message[];
  title: string;
  schedule?: ScheduleDay[];
};

export type ScheduleItem = {
  id?: string;
  activity: string;
  day: number;
  food?: FoodItem | null;
}

export type ScheduleDay = {
  day: number;
  scheduleInDay: ScheduleItem[];
}
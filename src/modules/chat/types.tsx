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
  messages: Message[];
  title: string ;
};

export type ScheduleItem = {
  id?: string;
  activity: string;
  day: number;
  food?: FoodItem | null;
}

export type ScheduleDay = {
  day: number ;
  scheduleInDay: ScheduleItem[];
}
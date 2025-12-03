import phoImage from '@/assets/images/street-food.jpg'
import type { FoodItem } from '../types'

export const MOCK_FOOD_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Phở Thìn Lò Đúc',
    description: 'Fine dining experience with contemporary French cuisine and seasonal ingredients.',
    address: 'Downtown Manhattan, NY',
    rating: 4.8,
    image: phoImage,
    cuisine: 'Viet Nam',
    openTime: "Open until 11 PM",
    coordinates: {
      lat: 21.018487,
      lng: 105.855278
    }
  },
  {
    id: '2',
    name: 'Bún Chả Hương Liên',
    description: 'Quán bún chả huyền thoại nơi Obama từng ghé thăm.',
    address: '24 Lê Văn Hưu, Hà Nội',
    rating: 4.7,
    image: phoImage,
    cuisine: 'Ha Noi',
    openTime: "Open until 9 PM",
    coordinates: {
      lat: 10.799356,
      lng: 106.674987
    }
  }
];

export const MOCK_AI_RESPONSE_TEXT = "Dựa trên yêu cầu của bạn, mình tìm thấy vài quán này:";
export const MOCK_DEFAULT_TEXT = "Chào bạn! Mình là AI Local Food. Bạn muốn tìm quán ăn ở đâu?";
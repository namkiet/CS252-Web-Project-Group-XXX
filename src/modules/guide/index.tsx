import FoodGuidePage from "./pages/food-guide-page";

export default FoodGuidePage

export type DishData = {
  id: string;
  name: string;
  origin: string;
  country: string;
  category: 'vietnam' | 'international';
  whatIsIt: string;
  mainIngredients: string[];
  servingStyle: string;
  image: string;
};

export type LocationData = {
  id: string;
  name: string;
  region: string;
  country: string;
  description: string;
  category: 'vietnam' | 'international';
  image: string;
};
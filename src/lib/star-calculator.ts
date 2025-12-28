export const calculateStarFromName = (restaurantName: string): number => {
  if (!restaurantName) return 4.0;
  
  // Sum all character codes
  const charSum = restaurantName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  // Get modulo 5 (0-4)
  const modValue = charSum % 5;
  
  // Map to star ratings: 3, 3.5, 4, 4.5, 5
  const starMapping: { [key: number]: number } = {
    0: 3.0,
    1: 3.5,
    2: 4.0,
    3: 4.5,
    4: 5.0
  };
  
  return starMapping[modValue];
};

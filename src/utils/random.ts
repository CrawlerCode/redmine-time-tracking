export const randomElement = function <T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
};

export function getArrayIndexByPercentage(length: number, percentage: number) {
  const result = Math.floor((length * percentage) / 100) - 1;

  if (result < 0) return 0;
  if (result >= length) return length - 1;
  return result;
}

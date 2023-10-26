export const onlyNumbers = (value: string) => {
  return value.replace(/\D/g, '');
};

export const aboveFive = (value: string) => {
  return value.replace(/[0-4]/g, '');
};

export function formatCreditCard(input: string) {
  // Remove non-digit characters
  const cleanedInput = input.replace(/\D/g, '');

  // Use regex to add dots after every 4 digits
  const formattedInput = cleanedInput.replace(/(\d{4})(?=\d)/g, '$1.');

  return formattedInput;
}

export function formatVehiclePlate(value: string) {
  const newValue = applyPlateMask(value).substring(0, 8);

  return newValue;
}

function applyPlateMask(value: string) {
  const firstThreeCharacters = value.replace(/[^A-Za-z]/g, '').substring(0, 3);

  if (value.at(-1) == '-') return `${firstThreeCharacters}-`;

  const sixthChar = value.charAt(5);
  const endCharacters = value.substring(3).replace('-', '');
  const isMercoSul = /[a-zA-Z]/.test(
    `${endCharacters.charAt(1)}${endCharacters.charAt(2)}`,
  );
  const format = `${firstThreeCharacters}${endCharacters}`
    .replace(/([a-zA-z]{3})(^[-]|\D)/, '$1')
    .replace(/([a-zA-z]{3})(\d)/, '$1-$2');

  if (!isMercoSul) {
    const oldFormat = format
      .replace(/(-\d)\D/, '$1')
      .replace(/-(\d{2})\D/, '$1')
      .replace(/(-)(\d{3})\D/, '$1$2');

    return oldFormat;
  }
  const isCar = isNaN(Number(sixthChar));

  if (isCar) {
    const carFormat = format
      .replace(/(-\d)([a-zA-Z])\D/, '$1$2')
      .replace(/([a-zA-Z]\d)(\D)/, '$1');

    return carFormat;
  }

  const bikeFormat = format.replace(/(\d{2})([a-zA-Z])(\D)/, '$1$2');

  return bikeFormat;
}

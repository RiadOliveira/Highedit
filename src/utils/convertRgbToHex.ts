const ColorToHex = (color: string) => {
  const hexadecimal = Number(color).toString(16);
  return hexadecimal.length === 1 ? `0${hexadecimal}` : hexadecimal;
};

const ConvertRGBtoHex = (rgbValue: string): string => {
  const rgbNumbers = rgbValue.substring(4, rgbValue.length - 1);
  const [red, green, blue] = rgbNumbers.split(',');

  return `#${ColorToHex(red)}${ColorToHex(green)}${ColorToHex(blue)}`;
};

export default ConvertRGBtoHex;

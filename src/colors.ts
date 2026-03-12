/// Convert a hex code (including a leading #) to rgb int values
const rgbFromHex = (hex: string) => {
  const r = Number(`0x${hex.slice(1, 3)}`);
  const g = Number(`0x${hex.slice(3, 5)}`);
  const b = Number(`0x${hex.slice(5, 7)}`);
  return [r, g, b];
};

export const cssFromRgb = (rgb: number[], a: number) => {
  const [r, g, b] = rgb;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const GROUP_COLORS = [
  rgbFromHex("#f94144"),
  rgbFromHex("#f3722c"),
  rgbFromHex("#f8961e"),
  rgbFromHex("#f9844a"),
  rgbFromHex("#f9c74f"),
  rgbFromHex("#90be6d"),
  rgbFromHex("#43aa8b"),
  rgbFromHex("#4d908e"),
  rgbFromHex("#577590"),
  rgbFromHex("#277da1"),
]
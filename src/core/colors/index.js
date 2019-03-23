// @flow

export type Rgba = [number, number, number, number];

export const hexToRgb = (value: string) => [
  parseInt(value.slice(1, 3), 16),
  parseInt(value.slice(3, 5), 16),
  parseInt(value.slice(5, 7), 16),
];

export const rgbaToString = ([r, g, b, a]: Rgba) => `rgba(${r}, ${g}, ${b}, ${a})`;

export default {
  hexToRgb,
  rgbaToString,
};

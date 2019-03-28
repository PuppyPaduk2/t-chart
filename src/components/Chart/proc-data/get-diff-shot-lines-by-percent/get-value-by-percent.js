// @flow

export default (min: number, max: number, percent: number) => {
  const width = max - min;
  const percentWidth = width / 100;

  return percentWidth * percent;
};

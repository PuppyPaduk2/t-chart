// @flow

type Border = { min: number, max: number };

export default (border: Border) => {
  const { min } = border;
  const stepDivider = 10 ** (min.toString().length - 1);

  return stepDivider;

  // return Math.round(step / stepDivider) * stepDivider;
};

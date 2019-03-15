// @flow

type Border = { min: number, max: number };

type Params = {
  border: Border,
  count: number,
};

export default (params: Params) => {
  const { border, count } = params;
  const { min, max } = border;
  const step = parseInt((max - min) / (count - 1), 10);
  const stepDivider = Math.pow(
    10,
    step.toString().length - 1,
  );

  return Math.round(step / stepDivider) * stepDivider;
};

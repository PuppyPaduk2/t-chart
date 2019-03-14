// @flow

type Border = { min: number, max: number };

type Params = {
  border: Border,
  count: number,
};

export default (params: Params) => {
  const { border, count } = params;
  const { min, max } = border;
  const step = parseInt(max / count, 10);
  const stepDivider = Math.pow(
    10,
    step.toString().length - 1,
  );

  console.log(step);

  return Math.round(step / stepDivider) * stepDivider;
};

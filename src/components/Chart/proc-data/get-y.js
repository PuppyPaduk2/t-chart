// @flow

export default (step: number, border: Object) => {
  const { max } = border;
  const result = [];
  let currentStep = 0;

  while (currentStep <= max) {
    result.push(currentStep);
    currentStep += step;
  }

  result.push(currentStep);

  return result;
};

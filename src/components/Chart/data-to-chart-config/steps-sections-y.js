// @flow

type Params = {
  stepSectionY: number,
  border: { min: number, max: number },
};

export default (params: Params): Array<number> => {
  const { stepSectionY, border } = params;
  const { min, max } = border;
  const result = [];
  let index = 0;

  while (index < max) {
    if (index + stepSectionY >= min) {
      result.push(index);
    }

    index += stepSectionY;
  }

  return result;
};

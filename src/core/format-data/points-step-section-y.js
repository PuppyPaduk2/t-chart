// @flow

type Params = {
  size: { width: number, height: number },
  stepSectionY: number,
  countSectionsY: number,
};

export default (params: Params) => {
  const {
    size,
    stepSectionY,
    countSectionsY,
  } = params;
  const { width, height } = size;
  const result = [];
  const widthPercentY = height / 100;
  const maxStepSectionY = stepSectionY * countSectionsY;

  for (let index = 0; index < countSectionsY; index++) {
    const value = stepSectionY * index;
    const y = value / maxStepSectionY * 100 * widthPercentY

    result.push({
      value,
      points: [
        [0, y],
        [width, y],
      ]
    });
  }

  return result;
};

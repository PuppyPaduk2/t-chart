// @flow

type Params = {  
  size: { width: number, height: number },
  stepsSectionsY: Array<number>,
  stepSectionY: number,
};

export default (params: Params) => {
  const { size, stepsSectionsY, stepSectionY } = params;
  const { width, height } = size;
  const firstStep = stepsSectionsY[0];
  const maxStepSectionY = stepsSectionsY[stepsSectionsY.length - 1]
    + stepSectionY;
  const widthPercentY = height / 100;

  return stepsSectionsY.reduce((result, step) => {
    const percentY = (step - firstStep) / (maxStepSectionY - firstStep) * 100;
    const y = height - (percentY * widthPercentY);

    result.push({
      value: step,
      points: [ [0, y], [width, y] ],
    });

    return result;
  }, []);
};

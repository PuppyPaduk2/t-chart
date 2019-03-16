// @flow

type Params = {
  percentPoints: Object,
  size: { width: number, height: number },
  period: [number, number],
  border: { // border
    min: number,
    max: number,
  },
};

export default (params: Params) => {
  const { percentPoints, size, period } = params;
  const { width, height } = size;
  const widthPercentX = width / (period[1] - period[0]);
  const widthPercentY = height / 100;

  return Object.keys(percentPoints).reduce((result, id) => {
    const column = percentPoints[id];

    return {
      ...result,
      [id]: column.map(precentPoint => ([
        precentPoint[0] * widthPercentX,
        height - (precentPoint[1] * widthPercentY),
      ])),
    };
  }, {});
};

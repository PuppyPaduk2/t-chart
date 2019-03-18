// @flow

import getColumnsByType from './get-columns-by-type';

type Params = {
  showY: Object,
  data: Object,
  size: Object,
  period: [number, number],
};

export default (params: Params) => {
  const {
    showY,
    data,
    size,
    period,
  } = params;
  const lines = getColumnsByType(data, 'line');
  const { values } = showY;
  const maxY = values[values.length - 1];
  const { width, height } = size;
  const percentWidth = width / 100;
  const percentHeight = height / 100;
  const percentPeriod = (period[1] - period[0]) / 100;

  return lines.reduce((resLines, line) => [
    ...resLines,
    line.reduce((resLine, value, index) => {
      if (index !== 0) {
        let percentX = (index - 1) / (line.length - 2) * 100 / percentPeriod;

        percentX -= period[0] / percentPeriod;

        const percentY = value / maxY * 100;

        resLine.push([
          percentX * percentWidth,
          height - percentY * percentHeight,
        ]);
      }

      return resLine;
    }, [line[0]]),
  ], []);
};

// @flow

import getColumnsByType from './get-columns-by-type';

export default (showY: Object, originalData: Object, state: Object) => {
  const lines = getColumnsByType(originalData, 'line');
  const { values } = showY;
  const maxY = values[values.length - 1];
  const { sizes } = state;
  const { chart } = sizes;
  const { width, height } = chart;
  const percentWidth = width / 100;
  const percentHeight = height / 100;
  const { period } = state;

  return lines.reduce((resLines, line) => [
    ...resLines,
    line.reduce((resLine, value, index) => {
      if (index !== 0) {
        let percentX = (index - 1) / (line.length - 2) * 100;

        percentX = (percentX - period[0]) / period[1] * 100;

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

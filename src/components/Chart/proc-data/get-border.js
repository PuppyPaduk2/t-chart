// @flow

import getFilteredLinesByPeriod from './get-filtered-lines-by-period';

const defaultBorder = () => ({ min: 999999999, max: 0 });

const getMinMax = (prev, next) => ({
  min: prev.min > next.min ? next.min : prev.min,
  max: prev.max < next.max ? next.max : prev.max,
});

export default (data: Object, state: Object) => getFilteredLinesByPeriod(data, state)
  .reduce((res, line) => getMinMax(
    res,
    line.reduce(
      (resLine, value) => getMinMax(resLine, { min: value, max: value }),
      defaultBorder(),
    ),
  ), defaultBorder());

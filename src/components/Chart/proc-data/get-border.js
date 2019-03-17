// @flow

import getColumnsByType from './get-columns-by-type';
import filterColumnsByPeriod from './filter-columns-by-period';
import filterLinesByStatus from './filter-lines-by-status';

const defaultBorder = () => ({ min: 999999999, max: 0 });

const getMinMax = (prev, next) => ({
  min: prev.min > next.min ? next.min : prev.min,
  max: prev.max < next.max ? next.max : prev.max,
});

export default (data: Object, state: Object) => {
  const lines = getColumnsByType(data, 'line');
  const filteredLines = filterLinesByStatus(
    filterColumnsByPeriod(lines, state),
    state,
  );

  return filteredLines.reduce((res, line) => getMinMax(
    res,
    line.reduce(
      (resLine, value) => getMinMax(resLine, { min: value, max: value }),
      defaultBorder(),
    ),
  ), defaultBorder());
};

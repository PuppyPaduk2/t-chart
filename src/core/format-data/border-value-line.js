// @flow

import filterColumnByPeriod from './filter-column-by-period';

export default (period: [number, number], column: Array<string|number>) => {
  return filterColumnByPeriod(period, column).reduce((result, value) => {
    result.min = result.min > value ? value : result.min;
    result.max = result.max < value ? value : result.max;

    return result;
  }, { min: 0, max: 0 });
};

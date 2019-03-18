// @flow

import getColumnsByType from './get-columns-by-type';
import filterColumnsByPeriod from './filter-columns-by-period';
import filterShowLines from './filter-show-lines';

export default (params: Object) => {
  const { data, hiddenLines, period } = params;

  return filterShowLines(
    filterColumnsByPeriod(
      getColumnsByType(data, 'line'),
      period,
    ),
    hiddenLines,
  );
};

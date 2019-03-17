// @flow

import getColumnsByType from './get-columns-by-type';
import filterColumnsByPeriod from './filter-columns-by-period';
import filterLinesByStatus from './filter-lines-by-status';

export default (originalData: Object, state: Object) => filterLinesByStatus(
  filterColumnsByPeriod(
    getColumnsByType(originalData, 'line'),
    state,
  ),
  state,
);

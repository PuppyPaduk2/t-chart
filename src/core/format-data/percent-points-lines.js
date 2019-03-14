// @flow

import { isLine, checkStatusLine } from './common';
import percentX from './percent-x';
import filterColumnByPeriod from './filter-column-by-period';

type Params = {
  columns: Array<Array<any>>,
  statusLine: Object,
  types: Object,
  period: [number, number],
  border: { min: number, max: number },
};

export default (params: Params) => {
  const {
    columns,
    statusLine,
    types,
    period,
    border,
  } = params;

  return columns.reduce((result, column) => {
    const id = column[0];

    if (isLine(types, id) && checkStatusLine(statusLine, id)) {
      result[id] = filterColumnByPeriod(period, column)
        .reduce((columnResult, value, index) => {
          columnResult.push([
            percentX(column, index),
            (value - border.min) / (border.max - border.min) * 100,
          ]);

          return columnResult;
        }, []);
    }

    return result;
  }, {});
};

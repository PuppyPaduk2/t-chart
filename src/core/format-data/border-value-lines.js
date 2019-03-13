// @flow

import { isLine, checkStatusLine } from './common';
import borderValueLine from './border-value-line';

type Params = {
  columns: Array<Array<any>>,
  statusLine: Object,
  types: Object,
  period: [number, number],
};

const borderValueColumns = (params: Params) => {
  const {
    columns,
    statusLine,
    types,
    period,
  } = params;

  return columns.reduce((result, column) => {
    const id = column[0];

    if (isLine(types, id) && checkStatusLine(statusLine, id)) {
      result[id] = borderValueLine(period, column);
    }

    return result;
  }, {});
};

export default (params: Params) => {
  const borderColumns = borderValueColumns(params);

  return Object.keys(borderColumns).reduce((result, id) => {
    const { min, max } = borderColumns[id];

    result.min = result.min > min ? min : result.min;
    result.max = result.max < max ? max : result.max;

    return result;
  }, { min: 99999999, max: 0 });
};

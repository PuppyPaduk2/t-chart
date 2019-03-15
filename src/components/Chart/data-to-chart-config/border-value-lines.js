// @flow

import { isLine, checkStatusLine } from './common';
import filterColumnByPeriod from './filter-column-by-period';

type Params = {
  columns: Array<Array<any>>,
  statusLine: Object,
  types: Object,
  period: [number, number],
};

const defaultBorder = () => ({ min: 99999999, max: 0 });

const minMax = (result, { min, max }) => {
  result.min = result.min > min ? min : result.min;
  result.max = result.max < max ? max : result.max;
};

const borderValueLine = (period: [number, number], column: Array<string|number>) => {
  return filterColumnByPeriod(period, column).reduce((result, value) => {
    minMax(result, { min: value, max: value });

    return result;
  }, defaultBorder());
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

    minMax(result, { min, max });

    return result;
  }, defaultBorder());
};

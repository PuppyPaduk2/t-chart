// @flow

import { isLine, checkStatusLine } from './common';
import percentX from './percent-x';
import filterColumnByPeriod from './filter-column-by-period';

type Params = {
  columns: Array<Array<any>>,
  statusLine: Object,
  types: Object,
  period: [number, number],
  stepSectionY: number,
  stepsSectionsY: Array<number>,
};

export default (params: Params) => {
  const {
    columns,
    statusLine,
    types,
    period,
    stepSectionY,
    stepsSectionsY,
  } = params;
  const firstStepSectionY = stepsSectionsY[0];
  const maxStepSectionY = stepsSectionsY[stepsSectionsY.length - 1]
    + stepSectionY;

  return columns.reduce((result, column) => {
    const id = column[0];

    if (isLine(types, id) && checkStatusLine(statusLine, id)) {
      result[id] = filterColumnByPeriod(period, column)
        .reduce((columnResult, value, index) => {
          columnResult.push([
            percentX(column, index),
            (value - firstStepSectionY) / (maxStepSectionY - firstStepSectionY) * 100,
          ]);

          return columnResult;
        }, []);
    }

    return result;
  }, {});
};

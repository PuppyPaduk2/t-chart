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
  stepSectionY: number,
  countSectionsY: number,
};

export default (params: Params) => {
  const {
    columns,
    statusLine,
    types,
    period,
    border,
    stepSectionY,
    countSectionsY,
  } = params;
  const borderMaxSectionY = stepSectionY * countSectionsY;

  console.log(borderMaxSectionY);

  return columns.reduce((result, column) => {
    const id = column[0];

    if (isLine(types, id) && checkStatusLine(statusLine, id)) {
      result[id] = filterColumnByPeriod(period, column)
        .reduce((columnResult, value, index) => {
          columnResult.push([
            percentX(column, index),
            value / borderMaxSectionY * 100,
          ]);

          return columnResult;
        }, []);
    }

    return result;
  }, {});
};

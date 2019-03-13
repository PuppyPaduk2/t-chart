// @flow

import percentX from './percent-x';

export default (period: [number, number], column: Array<string|number>): Array<number> => {
  return column.reduce((result, value, index) => {
    if (typeof value === 'number') {
      const persent = percentX(column, index);

      if (period[0] <= persent && persent <= period[1]) {
        result.push(value);
      }
    }

    return result;
  }, []);
}

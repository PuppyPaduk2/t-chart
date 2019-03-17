// @flow

export default (columns: Array<Array<any>>, state: Object) => {
  const { period } = state;

  return columns.reduce((resMap, column) => [
    ...resMap,
    column.reduce((res, value, index) => {
      const percent = (index - 1) / (column.length - 2) * 100;

      if (period[0] <= percent && percent <= period[1]) {
        res.push(value);
      }

      return res;
    }, [column[0]]),
  ], []);
};

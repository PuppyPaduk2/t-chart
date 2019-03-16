// @flow

export default (column: Array<any>, index: number) => (
  (index - 1) / (column.length - 2) * 100
);

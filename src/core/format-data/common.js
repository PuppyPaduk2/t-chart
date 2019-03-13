// @flow

export const checkStatusLine = (statusLine: Object, id: string) =>
  statusLine[id] === undefined ||
  statusLine[id] === true;

export const isLine = (types: Object, id: string) =>
  types[id] === 'line';

export default {
  checkStatusLine,
  isLine,
};

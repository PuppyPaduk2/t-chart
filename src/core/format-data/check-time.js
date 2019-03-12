// @flow

export default (callback: Function, key?: string = 'time') => {
  console.time(key);
  callback();
  console.timeEnd(key);
};

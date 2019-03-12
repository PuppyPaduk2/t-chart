// @flow

export default (callback: Function, key?: string = 'time', lock?: boolean = false) => {
  if (lock !== true) {
    console.time(key);
  }

  const result = callback();

  if (lock !== true) {
    console.timeEnd(key);
  }

  return result;
};

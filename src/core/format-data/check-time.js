// @flow

export default (callback: Function, key?: string = 'time', lock?: boolean = false) => {
  if (lock !== true) {
    console.time(key);
  }

  callback();

  if (lock !== true) {
    console.timeEnd(key);
  }
};

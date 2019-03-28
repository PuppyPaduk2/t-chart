// @flow

export default (
  callback: Function,
  duration?: number = 1000,
): Promise<any> => new Promise((res) => {
  const beginTime = performance.now();

  const tick = (time) => {
    const currentTime = time - beginTime;

    if (currentTime >= duration) {
      callback(duration, 100);

      res();
    } else {
      if (currentTime >= 0) {
        callback(currentTime, currentTime / duration * 100);
      } else {
        callback(0, 0);
      }

      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
});

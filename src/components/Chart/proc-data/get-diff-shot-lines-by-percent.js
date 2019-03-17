// @flow

const getValueByPercent = (min: number, max: number, percent: number) => {
  const width = max - min;
  const percentWidth = width / 100;

  return percentWidth * percent;
};

const getValuePointsYByPercent = (params: Object) => {
  const {
    prevShot,
    nextShot,
    index,
    percent,
  } = params;
  const prevShotPointY = prevShot.pointsY[index][0][1];
  const pointY = prevShotPointY + getValueByPercent(
    prevShotPointY,
    nextShot.pointsY[index][0][1],
    percent,
  );

  return [[0, pointY], [nextShot.pointsY[index][1][0], pointY]];
};

export default (params: Object) => {
  const {
    prevShot,
    nextShot,
    data,
    percent,
  } = params;
  const { y } = data;

  // console.log(
  //   '@diffShotLines',
  //   prevShot === nextShot,
  //   prevShot,
  //   nextShot,
  // );

  const pointsY = y.reduce((res, value, index) => {
    const points = getValuePointsYByPercent({
      prevShot,
      nextShot,
      index,
      percent,
    });

    if (prevShot.showY.map[index] !== nextShot.showY.map[index]) {
      if (prevShot.showY.map[index] === 1) {
        res.push({
          opacity: 1 - getValueByPercent(0, 1, percent),
          points,
          value,
        });
      } else {
        res.push({
          opacity: getValueByPercent(0, 1, percent),
          points,
          value,
        });
      }
    } else {
      res.push({
        opacity: nextShot.showY.map[index],
        points,
        value,
      });
    }

    return res;
  }, []);

  return {
    pointsY,
  };
};

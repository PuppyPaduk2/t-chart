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

const getDiffPointsY = (params: Object) => {
  const {
    prevShot,
    nextShot,
    data,
    percent,
  } = params;
  const { y } = data;

  return y.reduce((res, value, index) => {
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
};

const getDiffPointsLines = (params: Object) => {
  const {
    prevShot,
    nextShot,
    percent,
    state,
    statePrev,
  } = params;

  return prevShot.pointsLines.reduce((resLines, pointsLine, indexLine) => {
    const id = pointsLine[0];
    const nextIndex = state.hiddenLines.indexOf(id);
    let opacity = nextIndex === -1 ? 1 : 0;

    if (statePrev.hiddenLines !== state.hiddenLines) {
      const prevIndex = statePrev.hiddenLines.indexOf(id);

      if (prevIndex !== nextIndex) {
        if (nextIndex === -1) {
          opacity = getValueByPercent(0, 1, percent);
        } else {
          opacity = 1 - getValueByPercent(0, 1, percent);
        }
      }
    }

    return [
      ...resLines,
      pointsLine.reduce((resLine, pointLine, indexPoint) => {
        if (indexPoint > 0) {
          const nextPoint = nextShot.pointsLines[indexLine][indexPoint];

          resLine.points.push([
            nextPoint[0],
            pointLine[1] + getValueByPercent(
              pointLine[1],
              nextPoint[1],
              percent,
            ),
          ]);
        }

        return resLine;
      }, { points: [id], opacity }),
    ];
  }, []);
};

export default (params: Object) => ({
  pointsY: getDiffPointsY(params),
  pointsLines: getDiffPointsLines(params),
});

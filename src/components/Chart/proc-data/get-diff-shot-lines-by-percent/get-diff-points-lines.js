// @flow

import getValueByPercent from './get-value-by-percent';
import type { Params } from './types';

export default (params: Params) => {
  const {
    prevShot,
    nextShot,
    percent,
    prevHiddenLines,
    nextHiddenLines,
  } = params;

  return prevShot.pointsLines.reduce((resLines, pointsLine, indexLine) => {
    const id = pointsLine[0];
    const nextIndex = nextHiddenLines.indexOf(id);
    let opacity = nextIndex === -1 ? 1 : 0;

    if (prevHiddenLines !== nextHiddenLines) {
      const prevIndex = prevHiddenLines.indexOf(id);

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

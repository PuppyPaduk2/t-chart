// @flow

import type { Params } from './types';
import getValueByPercent from './get-value-by-percent';

export default (params: Params) => {
  const {
    prevShot,
    nextShot,
    percent,
  } = params;

  return prevShot.pointsX.reduce((res, value, index) => {
    const nextShotValue = nextShot.pointsX[index];

    if (value[2] !== nextShotValue[2]) {
      if (value[2] === 1) {
        const newValue = [...value];

        newValue[2] = 1 - getValueByPercent(0, 1, percent);

        res.push(newValue);
      } else {
        const newValue = [...nextShotValue];

        newValue[2] = getValueByPercent(0, 1, percent);

        res.push(newValue);
      }
    } else {
      res.push(nextShotValue);
    }

    return res;
  }, []);
};

// @flow

import getBorder from './get-border';
import getShowY from './get-show-y';
import getPointsY from './get-points-y';
import getPointsLines from './get-points-lines';

export default (buildData: Object, state: Object) => {
  const { originalData, y } = buildData;
  const border = getBorder(originalData, state);
  const showY = getShowY(border, y, state);
  const pointsY = getPointsY(showY, y, state);
  const pointsLines = getPointsLines(showY, originalData, state);

  return {
    border,
    showY,
    pointsY,
    pointsLines,
  };
};

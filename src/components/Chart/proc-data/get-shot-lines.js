// @flow

import getBorder from './get-border';
import getShowY from './get-show-y';
import getPointsY from './get-points-y';
import getPointsLines from './get-points-lines';
import getPointsX from './get-points-x';

type Params = {
  y: Array<any>,
  data: Object,
  hiddenLines: Array<string>,
  period: [number, number],
  countSectionsAxis: Object,
  size: Object,
};

export default (params: Params) => {
  const border = getBorder(params);
  const showY = getShowY({ ...params, border });
  const pointsY = getPointsY({ ...params, showY });
  const pointsLines = getPointsLines({ ...params, showY });
  const pointsX = getPointsX(params);

  return {
    border,
    showY,
    pointsY,
    pointsLines,
    pointsX,
  };
};

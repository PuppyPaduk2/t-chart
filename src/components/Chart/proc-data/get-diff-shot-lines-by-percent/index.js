// @flow

import type { Params } from './types';
import getDiffPointsY from './get-diff-points-y';
import getDiffPointsLines from './get-diff-points-lines';
import getDiffPointsX from './get-diff-point-x';

export default (params: Params) => ({
  pointsY: getDiffPointsY(params),
  pointsLines: getDiffPointsLines(params),
  pointsX: getDiffPointsX(params),
});

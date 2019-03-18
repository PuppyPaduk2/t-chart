// @flow

import drawHorizontalAxis from './horizontal-axis';
import { rgbaToString, hexToRgb } from '../colors';

export default (params: Object) => {
  const { context, diffShotLines } = params;
  const ctx = context;
  const { pointsY } = diffShotLines;

  pointsY.forEach((point) => {
    const { points, opacity } = point;

    ctx.fillStyle = rgbaToString([...hexToRgb('#293544'), opacity]);

    drawHorizontalAxis(context, points);
  });
};

// @flow

import drawHorizontalAxis from './horizontal-axis';
import { rgbaToString, hexToRgb } from '../colors';

export default (params: Object) => {
  const { context, diffShotLines, state } = params;
  const ctx = context;
  const { pointsY } = diffShotLines;
  const { colors } = state;

  pointsY.forEach((point) => {
    const { points, opacity } = point;

    ctx.fillStyle = rgbaToString([...hexToRgb(colors.y), opacity]);

    drawHorizontalAxis(context, points);
  });
};

// @flow

import drawLine from './line';
import { rgbaToString, hexToRgb } from '../colors';

export default (params: Object) => {
  const { context, diffShotLines, data } = params;
  const ctx = context;
  const { pointsLines } = diffShotLines;
  const { colors } = data;

  ctx.lineWidth = 2;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'round';

  pointsLines.forEach((pointsLine) => {
    const { points, opacity } = pointsLine;
    const color = colors[points[0]];

    ctx.strokeStyle = rgbaToString([
      ...hexToRgb(color),
      opacity,
    ]);

    drawLine(context, points);
  });
};

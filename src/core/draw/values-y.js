// @flow

import { rgbaToString, hexToRgb } from '../colors';

export default (params: Object) => {
  const { context, diffShotLines, state } = params;
  const ctx = context;
  const { pointsY } = diffShotLines;
  const { sizes, colors } = state;
  const { textY } = colors;
  const isTouch = 'ontouchstart' in window;

  ctx.font = `${isTouch ? 16 : 18}px Arial`;

  pointsY.forEach((point) => {
    const { points, opacity, value } = point;
    const firstPoint = points[0];

    ctx.fillStyle = rgbaToString([...hexToRgb(textY), opacity]);

    ctx.fillText(value, firstPoint[0], firstPoint[1] - sizes.space);
  });
};

// @flow

import { rgbaToString, hexToRgb } from '../colors';
import { monthsNameShort } from '../constants';

export default (params: Object) => {
  const {
    context,
    diffShotLines,
    state,
    y,
  } = params;
  const { pointsX } = diffShotLines;
  const { colors } = state;
  const { textX } = colors;

  pointsX.forEach((value) => {
    const [point, timestamp, opacity] = value;
    const [x] = point;
    const date = new Date(timestamp);
    const dateStr = `${monthsNameShort[date.getMonth()]} ${date.getDate()}`;

    context.fillStyle = rgbaToString([...hexToRgb(textX), opacity]);

    context.fillText(dateStr, x, y);
  });
};

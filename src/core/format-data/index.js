// @flow

import checkTime from '../check-time';
import getBorderValueLines from './border-value-lines';
import getPercentPointsLines from './percent-points-lines';
import getPointLines from './points-lines';

type Params = {
  size: { width: number, height: number },
  period: [number, number],
  columns: Array<Array<any>>,
  statusLine: Object,
  types: Object,
};

export default (params: Params) => {
  const {
    columns,
    statusLine,
    types,
    period,
    size,
  } = params;

  return checkTime(() => {
    const border = getBorderValueLines({
      columns,
      statusLine,
      types,
      period,
    });
    const percentPoints = getPercentPointsLines({
      border,
      columns,
      statusLine,
      types,
      period,
    });
    const pointLines = getPointLines({
      border,
      percentPoints,
      size,
      period,
    });

    return pointLines;
  }, 'formatData');
};

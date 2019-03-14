// @flow

import checkTime from '../check-time';
import getBorderValueLines from './border-value-lines';
import getPercentPointsLines from './percent-points-lines';
import getPointLines from './points-lines';
import getStepSectionY from './step-section-y';
import getPointsStepSectionY from './points-step-section-y';

type Params = {
  size: { width: number, height: number },
  period: [number, number],
  columns: Array<Array<any>>,
  statusLine: Object,
  types: Object,
  countSectionsY: number,
};

export default (params: Params) => {
  return checkTime(() => {
    const { columns, countSectionsY } = params;
    const border = getBorderValueLines(params);
    const stepSectionY = getStepSectionY({
      count: countSectionsY,
      border,
    });
    const percentPoints = getPercentPointsLines({
      ...params,
      border,
      stepSectionY,
    });
    const pointsLines = getPointLines({
      ...params,
      border,
      percentPoints,
    });
    const pointsStepSectionY = getPointsStepSectionY({
      ...params,
      stepSectionY,
      countSectionsY,
    });

    console.log(
      border,
      stepSectionY,
      pointsStepSectionY,
    );

    return {
      pointsLines,
      pointsStepSectionY,
    };
  }, 'formatData');
};

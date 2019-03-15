// @flow

import checkTime from '../../../core/check-time';
import getBorderValueLines from './border-value-lines';
import getPercentPointsLines from './percent-points-lines';
import getPointLines from './points-lines';
import getStepSectionY from './step-section-y';
import getPointsStepSectionY from './points-step-section-y';
import getStepsSectionsY from './steps-sections-y';

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
    const stepsSectionsY = getStepsSectionsY({
      border,
      stepSectionY,
    });
    const pointsStepSectionY = getPointsStepSectionY({
      ...params,
      stepSectionY,
      stepsSectionsY,
    });

    const percentPoints = getPercentPointsLines({
      ...params,
      stepSectionY,
      stepsSectionsY,
    });

    const pointsLines = getPointLines({
      ...params,
      border,
      percentPoints,
    });

    // console.log(
    //   stepSectionY,
    //   border,
    //   stepsSectionsY,
    // );

    return {
      pointsLines,
      pointsStepSectionY,
    };
  }, 'formatData');
};

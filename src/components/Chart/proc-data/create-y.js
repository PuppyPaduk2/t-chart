// @flow

import getBorder from './get-border';
import getStepY from './get-step-y';
import getY from './get-y';

type Params = {
  data: Object,
  hiddenLines: Array<string>,
  period: [number, number],
};

export default (params: Params) => {
  const border = getBorder(params);
  const stepY = getStepY(border);

  return getY(stepY, border);
};

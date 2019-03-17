// @flow

import getBorder from './get-border';
import getStepY from './get-step-y';
import getY from './get-y';

export default (data: Object, state: Object) => {
  const border = getBorder(data, state);
  const stepY = getStepY(border);
  const y = getY(stepY, border);

  return {
    originalData: data,
    border,
    stepY,
    y,
  };
};

// @flow

import line from './line';

type Params = {
  context: Object,
  data: Object,
  config: Object,
};

export default (params: Params) => {
  const { data, config, context } = params;
  const { colors } = data;
  const { pointsLines } = config;

  Object.keys(pointsLines).forEach((id) => {
    context.strokeStyle = colors[id];

    line(context, pointsLines[id]);
  });
};

// @flow

import { rgbaToString } from '../colors';

type Params = {
  context: Object,
  config: Object,
  colors: {
    border: Array<number>,
    shadow: Array<number>,
  },
};

export default (params: Params) => {
  const { context, config, colors } = params;
  const { blocks } = config;
  const { border, shadow } = blocks;

  context.fillStyle = rgbaToString(colors.border);

  // Top & bottom
  border.forEach(borderConfig => context.fillRect(...borderConfig));

  // Black blocks
  context.fillStyle = rgbaToString(colors.shadow);

  shadow.forEach(shadowConfig => context.fillRect(...shadowConfig));
};

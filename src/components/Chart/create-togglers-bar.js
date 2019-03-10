// @flow

import createElement from '../../core/create-element';
import ToggleButtonLine from '../ToggleButtonLine';

type Params = {
  owner: Object,
  colors: Object,
  names: Object,
};

function createTogglersBar(params: Params) {
  const { owner, colors, names } = params;
  const element = createElement({
    className: 'chart-togglers-bar',
    owner,
  });

  Object.keys(names).forEach(key => new ToggleButtonLine({
    owner: element,
    text: names[key],
    colorIcon: colors[key],
    value: true,
    onChange: value => console.log('@onChange', key, value),
  }));

  return element;
}

export default createTogglersBar;

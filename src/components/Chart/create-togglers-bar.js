// @flow

import createElement from './create-element';
import ToggleButton from '../ToggleButton';

type Params = {
  owner: Object,
  colors: Object,
  names: Object,
};

function createTogglersBar(params: Params) {
  const { owner, colors, names } = params;
  const element = createElement(owner, {
    className: 'chart-togglers-bar',
  });

  Object.keys(names).forEach(key => new ToggleButton({
    owner: element,
    text: names[key],
    colorIcon: colors[key],
    value: true,
    onChange: value => console.log('@onChange', key, value),
  }));

  return element;
}

export default createTogglersBar;

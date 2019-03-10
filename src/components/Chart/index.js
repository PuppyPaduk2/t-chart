// @flow

import createElement from '../../core/create-element';
import createContent from './create-content';
import createTogglersBar from './create-togglers-bar';
import './styles.css';

type Props = {
  owner: Object,
  data: Object,
};

class Chart {
  props: Props

  constructor(props: Props) {
    const { owner, data } = props;
    const { colors, names } = data;

    console.log('@data', data);

    this.props = props;

    const container = createElement({
      className: 'chart',
      owner,
    });

    createHeader(container);
    createContent(container);
    createMap(container);
    createTogglersBar({
      owner: container,
      colors,
      names,
    });
  }
}

export default Chart;

function createHeader(owner) {
  const element = createElement({
    className: 'chart-header',
    text: 'Followers',
    owner,
  });

  return element;
}

function createMap(owner) {
  const element = createElement({
    className: 'chart-map',
    owner,
  });

  return element;
}

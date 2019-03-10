// @flow

import createElement from './create-element';
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

    const container = createElement(owner, {
      className: 'chart',
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
  const element = createElement(owner, {
    className: 'chart-header',
    text: 'Followers',
  });

  return element;
}

function createContent(owner) {
  const element = createElement(owner, {
    className: 'chart-content',
  });

  return element;
}

function createMap(owner) {
  const element = createElement(owner, {
    className: 'chart-map',
  });

  return element;
}

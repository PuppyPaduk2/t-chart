// @flow

import createElement from '../../core/create-element';
import createState from '../../core/create-state';
import formatData from '../../core/format-data';
import canvasDrawLine from '../../core/canvas-draw/line';
import ToggleButtonLine from '../ToggleButtonLine';
import './styles.css';

type Props = {
  owner: Object,
  data: Object,
};

type State = {
  size: { width: number, hieght: number },
  period: [number, number],
  offLines: Object,
};

class Chart {
  container: Object
  props: Props
  state: Object

  constructor(props: Props) {
    this.props = props;
    this.state = createState({
      size: { width: 700, height: 450 },
      period: [10, 35],
      statusLine: {},
    });

    this.state.subscribe((prevState, nextState) => {
      this.removeContent();
      this.createContent();
    });

    this.createContainer();
    this.render();
  }

  createContainer() {
    const { owner } = this.props;

    this.container = createElement({
      className: 'chart',
      owner,
    });

    return this.container;
  }

  createHeader() {
    createElement({
      className: 'chart-header',
      text: 'Followers',
      owner: this.container,
    });
  }

  removeContent() {
    const content = this.container
      .getElementsByClassName('chart-content')[0];

    if (content) {
      content.remove();
    }
  }

  createContent() {
    const { size } = this.state.getValue();
    const { width, height } = size;
    const { data } = this.props;
    const { colors } = data;
    const content = createElement({
      className: 'chart-content',
      owner: this.container,
    });
    const canvas: Object = createElement({
      tagName: 'canvas',
      owner: content,
    });
    const pointsY = formatData({
      state: this.state,
      data: this.props.data,
    });

    canvas.setAttribute('width', width.toString());
    canvas.setAttribute('height', height.toString());

    const context = canvas.getContext('2d');

    context.lineWidth = 2;

    Object.keys(pointsY).forEach((id) => {
      context.strokeStyle = colors[id];

      canvasDrawLine(context, pointsY[id]);
    });
  }

  createMap() {
    createElement({
      className: 'chart-map',
      owner: this.container,
    });
  }

  createTogglersBar() {
    const { data } = this.props;
    const { names, colors } = data;
    const togglersBar = createElement({
      className: 'chart-togglers-bar',
      owner: this.container,
    });

    Object.keys(names).forEach(key => new ToggleButtonLine({
      owner: togglersBar,
      text: names[key],
      colorIcon: colors[key],
      value: true,
      onChange: this.onChangeLine(key),
    }));
  }

  render() {
    const { data } = this.props;

    this.createHeader();
    this.createContent();
    this.createMap();
    this.createTogglersBar();
  }

  onChangeLine = (id: string) => (value: boolean) => {
    const stateValue = { ...this.state.getValue() };

    stateValue.statusLine = {
      ...stateValue.statusLine,
      [id]: value,
    };

    this.state.setValue(stateValue);
  }
}

export default Chart;

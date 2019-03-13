// @flow

import createElement from '../../core/create-element';
import createState from '../../core/create-state';
import formatData from '../../core/format-data';
import canvasDrawLine from '../../core/canvas-draw/line';
import checkTime from '../../core/check-time';
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
  content: Object
  contentCanvas: Object
  props: Props
  state: Object

  constructor(props: Props) {
    this.props = props;
    this.state = createState({
      size: { width: 700, height: 450 },
      period: [65, 100],
      statusLine: {},
    });

    this.state.subscribe((prevState, nextState) => {
      this.drawChart();
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

  createContent() {
    this.content = createElement({
      className: 'chart-content',
      owner: this.container,
    });

    this.contentCanvas = createElement({
      tagName: 'canvas',
      owner: this.content,
    });

    this.drawChart();
  }

  drawChart() {
    checkTime(() => {
      const { size, statusLine, period } = this.state.getValue();
      const { width, height } = size;
      const { data } = this.props;
      const { colors, columns, types, } = data;
      const context = this.contentCanvas.getContext('2d');
      const pointsY = formatData({
        size,
        period,
        columns,
        statusLine,
        types,
      });

      this.contentCanvas.setAttribute('width', width.toString());
      this.contentCanvas.setAttribute('height', height.toString());

      context.lineWidth = 2;

      Object.keys(pointsY).forEach((id) => {
        context.strokeStyle = colors[id];

        canvasDrawLine(context, pointsY[id]);
      });
    }, 'drawChart');
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

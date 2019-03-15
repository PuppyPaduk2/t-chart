// @flow

import createElement from '../../core/create-element';
import createState from '../../core/create-state';
import formatData from '../../core/format-data';
import canvasDrawLine from '../../core/canvas-draw/line';
import canvasDrawHorizontalAxis from '../../core/canvas-draw/horizontal-axis';
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
      period: [0, 100],
      statusLine: {},
      countSectionsY: 6,
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
      const { size, statusLine, period, countSectionsY } = this.state.getValue();
      const { width, height } = size;
      const { data } = this.props;
      const { colors, columns, types } = data;
      const context = this.contentCanvas.getContext('2d');
      const formatedData = formatData({
        size,
        period,
        columns,
        statusLine,
        types,
        countSectionsY,
      });

      this.contentCanvas.setAttribute('width', width.toString());
      this.contentCanvas.setAttribute('height', height.toString());

      this.drawLinesAxisY(context, formatedData);
      this.drawLines(context, { ...formatedData, colors });
      this.drawValueLinesAxisY(context, formatedData);
    }, 'drawChart');
  }

  drawLinesAxisY(context: Object, params: Object) {
    const { pointsStepSectionY } = params;

    context.fillStyle = '#2D3A4A';

    pointsStepSectionY.forEach((step) => {
      const { points } = step;

      canvasDrawHorizontalAxis(context, points);
    });
  }

  drawLines(context: Object, params: Object) {
    const { pointsLines, colors } = params;

    context.lineWidth = 2;
    context.lineCap = 'butt';
    context.lineJoin = 'round';

    Object.keys(pointsLines).forEach((id) => {
      context.strokeStyle = colors[id];

      canvasDrawLine(context, pointsLines[id]);
    });
  }

  drawValueLinesAxisY(context: Object, params: Object) {
    const { pointsStepSectionY } = params;
    const offsetY = 8;

    context.font = '18px Arial';
    context.fillStyle = '#546778';

    pointsStepSectionY.forEach((step) => {
      const { value, points } = step;
      const firstPoint = points[0];

      context.fillText(value, firstPoint[0], firstPoint[1] - offsetY);
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

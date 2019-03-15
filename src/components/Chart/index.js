// @flow

import createElement from '../../core/create-element';
import createState from '../../core/create-state';
import getFormatData from '../../core/format-data';
import canvasDrawLine from '../../core/canvas-draw/line';
import canvasDrawHorizontalAxis from '../../core/canvas-draw/horizontal-axis';
import checkTime from '../../core/check-time';
import ToggleButtonLine from '../ToggleButtonLine';
import './styles.css';

type Props = {
  owner: Object,
  data: Object,
};

type Size = {
  width: number,
  height: number,
};

type Period = [number, number];

const spaceSize = 8;

const setSizeCanvasContext = (canvas: Object, size: Size) => {
  const { width, height } = size;

  canvas.setAttribute('width', width.toString());
  canvas.setAttribute('height', height.toString());

  return canvas;
};

class Chart {
  container: Object
  content: Object
  contentCanvas: Object
  mapCanvas: Object
  props: Props
  state: Object

  constructor(props: Props) {
    this.props = props;
    this.state = createState({
      sizeChart: { width: 700, height: 450 },
      sizeMap: { width: 700, height: 50 },
      period: [0, 100],
      statusLine: {},
      countSectionsY: 6,
    });

    this.state.subscribe((prevState, nextState) => {
      this.drawChartContent();
      this.drawChartMap();
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

  buildFormatData(size: Size, period: Period) {
    const { statusLine, countSectionsY } = this.state.getValue();
    const { data } = this.props;
    const { columns, types } = data;

    return  getFormatData({
      size,
      period,
      columns,
      statusLine,
      types,
      countSectionsY,
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

    this.drawChartContent();
  }

  drawChartContent() {
    checkTime(() => {
      const { sizeChart, period } = this.state.getValue();
      const { data } = this.props;
      const { colors } = data;
      const context = this.contentCanvas.getContext('2d');
      const formatedData = this.buildFormatData(sizeChart, period);

      setSizeCanvasContext(this.contentCanvas, sizeChart);

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

    context.font = '18px Arial';
    context.fillStyle = '#546778';

    pointsStepSectionY.forEach((step) => {
      const { value, points } = step;
      const firstPoint = points[0];

      context.fillText(value, firstPoint[0], firstPoint[1] - spaceSize);
    });
  }

  createMap() {
    const chartMap = createElement({
      className: 'chart-map',
      owner: this.container,
    });

    this.mapCanvas = createElement({
      tagName: 'canvas',
      owner: chartMap,
    });

    this.drawChartMap();
  }

  drawChartMap() {
    const { sizeMap } = this.state.getValue();
    const { data } = this.props;
    const { colors } = data;
    const context = this.mapCanvas.getContext('2d');
    const formatedData = this.buildFormatData(sizeMap, [0, 100]);

    setSizeCanvasContext(this.mapCanvas, sizeMap);

    this.drawLines(context, { ...formatedData, colors });
    this.drawChartFrameMap(context);
  }

  drawChartFrameMap(context: Object, params: Object) {
    const { sizeMap, period } = this.state.getValue();
    const { height, width } = sizeMap;
    const percentWidth = width / 100;
    const offsetLeft = period[0] * percentWidth;
    const offsetRight = (100 - period[1]) * percentWidth;
    const border = spaceSize * 0.25;
    const topBottomWidth = width - offsetRight - offsetLeft;

    context.fillStyle = 'rgba(91, 119, 148, 0.5)';

    console.log(offsetLeft, offsetRight);

    // Top & bottom
    context.fillRect(offsetLeft, 0, topBottomWidth, border);
    context.fillRect(offsetLeft, height - border, topBottomWidth, border);

    // Left & right
    context.fillRect(offsetLeft, border, spaceSize, height - (border * 2));
    context.fillRect(width - spaceSize - offsetRight, border, spaceSize, height - (border * 2));

    // Black blocks
    context.fillStyle = 'rgba(31, 42, 56, 0.7)';

    context.fillRect(0, 0, offsetLeft, height);
    context.fillRect(offsetLeft + topBottomWidth, 0, offsetRight, height);
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

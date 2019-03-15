// @flow

import createElement from '../../core/create-element';
import createState from '../../core/create-state';
import canvasDrawLine from '../../core/canvas-draw/line';
import canvasDrawHorizontalAxis from '../../core/canvas-draw/horizontal-axis';
import checkTime from '../../core/check-time';
import ToggleButtonLine from '../ToggleButtonLine';
import dataToChartConfig from './data-to-chart-config';
import Content from './Content';
import Map from './Map';
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
      sizes: {
        space: 8,
        chart: { width: 700, height: 450 },
        map: { width: 700, height: 50 },
      },
      period: [35, 65],
      statusLine: {},
      countSectionsY: 6,
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

    return dataToChartConfig({
      size,
      period,
      columns,
      statusLine,
      types,
      countSectionsY,
    });
  }

  createContent() {
    const { data } = this.props;

    new Content({
      owner: this.container,
      state: this.state,
      data,
    });
  }

  createMap() {
    const { data } = this.props;

    new Map({
      owner: this.container,
      state: this.state,
      data,
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

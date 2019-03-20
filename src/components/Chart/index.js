// @flow

import createElement from '../../core/create-element';
import createState from '../../core/create-state';
import createTimer from '../../core/create-timer';
import ToggleButtonLine from '../ToggleButtonLine';
import createY from './proc-data/create-y';
import getShotLines from './proc-data/get-shot-lines';
import getDiffShotLinesbyPercent from './proc-data/get-diff-shot-lines-by-percent';
import setSizeCanvas from '../../core/set-size-canvas';
import drawClear from '../../core/draw/clear';
import drawLines from '../../core/draw/lines';
import drawY from '../../core/draw/y';
import drawValuesY from '../../core/draw/values-y';
import drawMapFrame from '../../core/draw/map-frame';
import getConfigMapFrame from './proc-data/get-config-map-frame';
import mapGragDrop from './map-drag-drop';
import './styles.css';

type Props = {
  owner: Object,
  data: Object,
};

class Chart {
  container: Object

  props: Props

  state: Object

  y: Object

  contentCanvas: Object

  contentShotLines: Object

  mapCanvas: Object

  mapShotLines: Object

  mapState: Object

  constructor(props: Props) {
    this.contentShotLines = {};
    this.mapShotLines = {};

    this.props = props;

    this.state = createState({
      sizes: {
        space: 8,
        chart: { width: 700, height: 420 },
        heightX: 30,
        map: { width: 700, height: 50 },
      },
      period: [0, 100],
      hiddenLines: [],
      countSectionsAxis: { y: 6, x: 6 },
      animationDuration: 250,
      colors: {
        textY: '#526475',
        y: '#293544',
        mapFrame: {
          border: [91, 119, 148, 0.5],
          shadow: [31, 42, 56, 0.7],
        },
      },
    });


    this.y = this.createY();

    this.render();

    this.state.subscribe(() => this.redraw());
  }

  createY() {
    const { data } = this.props;
    const { period, hiddenLines } = this.state.getValue();

    return createY({
      data,
      period,
      hiddenLines,
    });
  }

  getShotLines = (params: Object) => {
    const { size, period } = params;
    const { data } = this.props;
    const { hiddenLines, countSectionsAxis } = this.state.getValue();

    return getShotLines({
      y: this.y,
      size,
      data,
      period,
      hiddenLines,
      countSectionsAxis,
    });
  }

  getDiffShotLines(prevShot: Object, nextShot: Object, percent: number = 100) {
    return getDiffShotLinesbyPercent({
      prevHiddenLines: this.state.getPrevValue().hiddenLines,
      nextHiddenLines: this.state.getValue().hiddenLines,
      data: this.props.data,
      y: this.y,
      prevShot,
      nextShot,
      percent,
    });
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
    const content = createElement({
      className: 'chart-content',
      owner: this.container,
    });

    this.contentCanvas = createElement({
      tagName: 'canvas',
      owner: content,
    });
  }

  getContentSize() {
    const { sizes } = this.state.getValue();
    const { chart, heightX } = sizes;

    return {
      ...chart,
      height: chart.height + heightX,
    };
  }

  drawContent(percent?: number = 100) {
    const size = this.getContentSize();
    const context = this.contentCanvas.getContext('2d');
    const drawParams = {
      data: this.props.data,
      state: this.state.getValue(),
      diffShotLines: this.getDiffShotLines(
        this.contentShotLines.prev,
        this.contentShotLines.next,
        percent,
      ),
      context,
    };

    setSizeCanvas(this.contentCanvas, size);
    drawClear(context, size);
    drawY(drawParams);
    drawLines(drawParams);
    drawValuesY(drawParams);
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

    this.mapState = createState({
      owner: this.mapCanvas,
      state: this.state,
    });

    mapGragDrop(this.mapState);
  }

  getMapSize() {
    const { sizes } = this.state.getValue();

    return sizes.map;
  }

  drawMap(percent?: number = 100) {
    const size = this.getMapSize();
    const context = this.mapCanvas.getContext('2d');
    const stateValue = this.state.getValue();
    const drawParams = {
      data: this.props.data,
      state: stateValue,
      diffShotLines: this.getDiffShotLines(
        this.mapShotLines.prev,
        this.mapShotLines.next,
        percent,
      ),
      context,
    };

    setSizeCanvas(this.mapCanvas, size);
    drawClear(context, size);
    drawLines(drawParams);

    const configFrame = getConfigMapFrame(stateValue);

    this.mapState.setValue({
      ...this.mapState.getValue(),
      configFrame,
    });

    drawMapFrame({
      config: configFrame,
      colors: stateValue.colors.mapFrame,
      context,
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
    this.createContainer();
    this.createHeader();
    this.createContent();
    this.createMap();
    this.createTogglersBar();

    this.createShotLines();
    this.draw();
  }

  createShotLinesBy(key: string, params: Object) {
    const { next } = this[key];
    const newShotLines = this.getShotLines(params);

    this[key] = {
      prev: next || newShotLines,
      next: newShotLines,
    };
  }

  createShotLines() {
    this.createShotLinesBy('contentShotLines', {
      size: this.getContentSize(),
      period: this.state.getValue().period,
    });
    this.createShotLinesBy('mapShotLines', {
      size: this.getMapSize(),
      period: [0, 100],
    });
  }

  draw(percent?: number = 100) {
    this.drawContent(percent);
    this.drawMap(percent);
  }

  redraw() {
    const { animationDuration } = this.state.getValue();

    if (!this.timer) {
      this.createShotLines();

      this.timer = createTimer(
        (time, percent) => this.draw(percent),
        animationDuration,
      ).then(() => {
        this.timer = null;
        return true;
      });
    }
  }

  onChangeLine = (id: string) => (value: boolean) => {
    const stateValue = { ...this.state.getValue() };

    stateValue.hiddenLines = [...stateValue.hiddenLines];

    if (value === false) {
      stateValue.hiddenLines.push(id);
    } else {
      stateValue.hiddenLines.splice(
        stateValue.hiddenLines.indexOf(id),
        1,
      );
    }

    this.state.setValue(stateValue);
  }
}

export default Chart;

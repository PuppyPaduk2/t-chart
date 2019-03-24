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
import drawX from '../../core/draw/x';
import getConfigMapFrame from './proc-data/get-config-map-frame';
import mapGragDrop from './map-drag-drop';
import createDragDrop from '../../core/drag-drop';
import getEventOffset from '../../core/drag-drop/get-event-offset';
import drawSelectedPoint from '../../core/draw/selected-point';
import './styles.css';

type Props = {
  owner: Object,
  data: Object,
  colors: Object,
};

class Chart {
  container: Object

  props: Props

  state: Object

  y: Object

  contentCanvas: Object

  shotLines: Object

  mapCanvas: Object

  mapState: Object

  timer: Object

  selectedPoint: any

  onWindowResize: Function = function onWindowResize() {
    setTimeout(() => {
      const state = this.state.getValue();
      const isTouch = 'ontouchstart' in window;
      const width = this.container.offsetWidth - (
        isTouch ? 0 : 16
      );

      this.state.setValue({
        ...state,
        sizes: {
          ...state.sizes,
          chart: { ...state.sizes.chart, width },
          map: { ...state.sizes.map, width },
        },
      });
    }, 0);
  }

  constructor(props: Props) {
    const { colors } = props;

    this.shotLines = {
      content: {},
      map: {},
    };

    this.props = props;

    this.createContainer();

    const isTouch = 'ontouchstart' in window;
    const width = this.container.offsetWidth - (
      isTouch ? 0 : 16
    );

    this.state = createState({
      sizes: {
        space: 8,
        heightX: 30,
        chart: { width, height: 420 },
        map: { width, height: 50 },
      },
      period: [0, 100],
      hiddenLines: [],
      countSectionsAxis: { y: 6, x: 6 },
      animationDuration: 250,
      colors,
      radiusSelectedPoint: 5,
      innerRadiusSelectedPoint: 3,
    });

    this.selectedPoint = createState(null);

    this.selectedPoint.subscribe(this.changeSelectedPoint);

    this.listenToWindow();

    this.y = this.createY();

    this.render();

    this.state.subscribe(() => this.redraw());
  }

  listenToWindow = () => {
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);
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

    createDragDrop({
      owner: this.contentCanvas,
      listeners: {
        onClick: ({ eventClick }) => {
          const { offsetX } = getEventOffset(eventClick);
          const { width } = this.getContentSize();
          const percentWidth = width / 100;
          const percents = offsetX / percentWidth;
          const { next } = this.shotLines.content;
          const { pointsLines } = next;
          const clickPoints = pointsLines.reduce((res, pointsLine) => {
            let minK = 99999999;

            return [
              ...res,
              [pointsLine[0], ...pointsLine.reduce((resPL, point) => {
                if (typeof point === 'object') {
                  const percent = Math.abs(percents - point[2]);

                  if (minK > percent) {
                    minK = percent;

                    return point;
                  }
                }

                return resPL;
              }, [])],
            ];
          }, []);

          this.selectedPoint.setValue(clickPoints);
        },
      },
    });
  }

  changeSelectedPoint = () => {
    this.draw();

    drawSelectedPoint({
      selectedPoint: this.selectedPoint.getValue(),
      state: this.state.getValue(),
      context: this.contentCanvas.getContext('2d'),
      data: this.props.data,
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
    const { content } = this.shotLines;
    const size = this.getContentSize();
    const context = this.contentCanvas.getContext('2d');
    const drawParams = {
      data: this.props.data,
      state: this.state.getValue(),
      diffShotLines: this.getDiffShotLines(
        content.prev,
        content.next,
        percent,
      ),
      context,
    };

    setSizeCanvas(this.contentCanvas, size);

    drawClear(context, size);
    drawY(drawParams);
    drawLines(drawParams);
    drawValuesY(drawParams);
    drawX({ ...drawParams, y: size.height - 8 });
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
    const { map } = this.shotLines;
    const size = this.getMapSize();
    const context = this.mapCanvas.getContext('2d');
    const stateValue = this.state.getValue();
    const drawParams = {
      data: this.props.data,
      state: stateValue,
      diffShotLines: this.getDiffShotLines(
        map.prev,
        map.next,
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
    this.createHeader();
    this.createContent();
    this.createMap();
    this.createTogglersBar();

    this.createShotLines();
    this.draw();
  }

  createShotLinesBy(key: string, params: Object) {
    const { next } = this.shotLines[key];
    const newShotLines = this.getShotLines(params);

    this.shotLines[key] = {
      prev: next || newShotLines,
      next: newShotLines,
    };
  }

  createShotLines() {
    const { sizes, period } = this.state.getValue();
    const { chart } = sizes;

    this.createShotLinesBy('content', {
      size: chart,
      period,
    });

    this.createShotLinesBy('map', {
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

    this.createShotLines();

    if (!this.timer) {
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

// @flow

import createElement from '../../../core/create-element';
import dragDrop from '../../../core/drag-drop';
// import canvasDrawLines from '../../../core/draw/lines';
import setSizeCanvasContext from '../set-size-canvas-context';
import dataToChartConfig from '../data-to-chart-config';

type Props = {
  data: Object,
  owner: Object,
  state: Object,
};

class Map {
  props: Props

  canvas: Object

  config: Object

  configFrame: Object

  constructor(props: Props) {
    const { state } = props;

    this.props = props;

    state.subscribe(() => this.draw());

    this.config = this.getConfig();

    this.render();
  }

  render() {
    const { owner } = this.props;
    const chartMap = createElement({
      className: 'chart-map',
      owner,
    });

    this.canvas = createElement({
      tagName: 'canvas',
      owner: chartMap,
    });

    this.draw();
    this.listenDragDrop();
  }

  draw() {
    const { state } = this.props;
    const { sizes } = state.getValue();
    const context = this.canvas.getContext('2d');

    setSizeCanvasContext(this.canvas, sizes.map);

    this.drawLines(context, this.config);
    this.drawFrame(context);
  }

  getConfig() {
    const { data, state } = this.props;
    const { sizes, statusLine, countSectionsAxis } = state.getValue();
    const { columns, types } = data;

    return dataToChartConfig({
      size: sizes.map,
      period: [0, 100],
      columns,
      statusLine,
      types,
      countSectionsAxis,
    });
  }

  drawLines(context: Object, config: Object) {
    const { data } = this.props;
    const ctx = context;

    ctx.lineWidth = 2;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';

    // canvasDrawLines({
    //   context,
    //   config,
    //   data,
    // });
  }

  drawFrame(context: Object) {
    const ctx = context;

    this.configFrame = this.getConfigFrame();

    ctx.fillStyle = 'rgba(91, 119, 148, 0.5)';

    // Top & bottom
    this.configFrame.blocks.border
      .forEach(border => ctx.fillRect(...border));

    // Black blocks
    ctx.fillStyle = 'rgba(31, 42, 56, 0.7)';

    this.configFrame.blocks.shadow
      .forEach(border => ctx.fillRect(...border));
  }

  getConfigFrame() {
    const { state } = this.props;
    const { sizes, period } = state.getValue();
    const { height, width } = sizes.map;
    const percentWidth = width / 100;
    const offset = {
      left: period[0] * percentWidth,
      right: (100 - period[1]) * percentWidth,
    };
    const border = sizes.space * 0.25;
    const widthTriggers = sizes.space;
    const frameWidth = width - offset.right - offset.left;

    return {
      width: frameWidth,
      blocks: {
        border: [
          [offset.left, 0, frameWidth, border],
          [offset.left, height - border, frameWidth, border],
          [offset.left, border, widthTriggers, height - (border * 2)],
          [width - sizes.space - offset.right, border, widthTriggers, height - (border * 2)],
        ],
        shadow: [
          [0, 0, offset.left, height],
          [offset.left + frameWidth, 0, offset.right, height],
        ],
      },
      offset,
      widthTriggers,
      map: [
        offset.left, // left shadow block
        offset.left + widthTriggers, // left trigger
        offset.left + frameWidth - widthTriggers, // frame
        offset.left + frameWidth, // right trigger
        width, // right shadow block
      ],
      mapNote: [
        { name: 'shadow', position: 'left' },
        { name: 'trigger', position: 'left' },
        { name: 'frame', position: 'center' },
        { name: 'trigger', position: 'right' },
        { name: 'shadow', position: 'right' },
      ],
    };
  }

  listenDragDrop() {
    dragDrop({
      owner: this.canvas,
      listeners: {
        onStart: this.onStartDragDrop,
        onMove: this.onMoveDragDrop,
        onClick: this.onClickDragDrop,
        onDbclick: this.onDbclickDragDrop,
      },
    });
  }

  onStartDragDrop = (params: Object) => {
    const { eventStart } = params;
    const { state } = this.props;
    const { period } = state.getValue();
    const { map, mapNote } = this.configFrame;
    const { offsetX } = eventStart;
    let index = 0;

    for (index = 0; index < map.length; index += 1) {
      if (offsetX < map[index]) {
        break;
      }
    }

    return {
      eventObject: mapNote[index],
      period,
    };
  }

  onMoveDragDrop = (params: Object) => {
    const { stateStart, eventDiffPrev } = params;
    const { eventObject } = stateStart;
    const { name } = eventObject;

    if (eventDiffPrev.offsetX !== 0) {
      if (name === 'shadow') {
        this.onMoveDragDropShadow(params);
      } else if (name === 'frame') {
        this.onMoveDragDropFrame(params);
      } else if (name === 'trigger') {
        this.onMoveDragDropTrigger(params);
      }
    }
  }

  onMoveDragDropShadow(params: Object) {
    const { eventDiff, eventStart } = params;
    const percentStart = this.getPercentOffsetX(eventStart.offsetX);
    const percentDiff = this.getPercentOffsetX(eventDiff.offsetX);

    if (percentDiff > 0) {
      let borderRight = percentStart + percentDiff;

      borderRight = borderRight < 100 ? borderRight : 100;

      this.setStatePeriod([percentStart, borderRight]);
    } else {
      let borderLeft = percentStart + percentDiff;

      borderLeft = borderLeft > 0 ? borderLeft : 0;

      this.setStatePeriod([borderLeft, percentStart]);
    }
  }

  onMoveDragDropFrame(params: Object) {
    const { stateStart, eventDiff } = params;
    const { period } = stateStart;
    const percentDiff = this.getPercentOffsetX(eventDiff.offsetX);
    const newPeriod = [period[0] + percentDiff, period[1] + percentDiff];

    newPeriod[0] = newPeriod[0] > 0 ? newPeriod[0] : 0;
    newPeriod[1] = newPeriod[1] < 100 ? newPeriod[1] : 100;

    if ((period[1] - period[0]) <= (newPeriod[1] - newPeriod[0])) {
      this.setStatePeriod(newPeriod);
    }
  }

  onMoveDragDropTrigger(params: Object) {
    const { stateStart } = params;
    const { eventObject } = stateStart;
    const { position } = eventObject;

    if (position === 'left') {
      this.onMoveDragDropTriggerLeft(params);
    } else {
      this.onMoveDragDropTriggerRight(params);
    }
  }

  onMoveDragDropTriggerLeft(params: Object) {
    const { stateStart, eventDiff } = params;
    const { period } = stateStart;
    const percentDiff = this.getPercentOffsetX(eventDiff.offsetX);
    let borderLeft = period[0] + percentDiff;

    borderLeft = borderLeft > 0 ? borderLeft : 0;
    borderLeft = borderLeft < 100 ? borderLeft : 100;

    if (borderLeft <= period[1]) {
      this.setStatePeriod([borderLeft, period[1]]);
    } else {
      this.setStatePeriod([period[1], borderLeft]);
    }
  }

  onMoveDragDropTriggerRight(params: Object) {
    const { stateStart, eventDiff } = params;
    const { period } = stateStart;
    const percentDiff = this.getPercentOffsetX(eventDiff.offsetX);
    let borderRight = period[1] + percentDiff;

    borderRight = borderRight > 0 ? borderRight : 0;
    borderRight = borderRight < 100 ? borderRight : 100;

    if (borderRight >= period[0]) {
      this.setStatePeriod([period[0], borderRight]);
    } else {
      this.setStatePeriod([borderRight, period[0]]);
    }
  }

  onClickDragDrop = (params: Object) => {
    const { eventClick, stateStart } = params;
    const { eventObject } = stateStart;
    const { name } = eventObject;

    if (name === 'shadow' || name === 'frame') {
      const { offsetX } = eventClick;
      const percentOffsetX = this.getPercentOffsetX(offsetX);
      const percentDiff = 3;
      const period = [
        percentOffsetX - percentDiff,
        percentOffsetX + percentDiff,
      ];

      period[0] = period[0] > 0 ? period[0] : 0;
      period[1] = period[1] < 100 ? period[1] : 100;

      this.setStatePeriod(period);
    }
  }

  onDbclickDragDrop = (params: Object) => {
    const { stateStart } = params;
    const { eventObject } = stateStart;
    const { name } = eventObject;

    if (name === 'frame') {
      const { state } = this.props;

      state.setValue({
        ...state.getValue(),
        period: [0, 100],
      });
    }
  }

  getPercentOffsetX(value: number) {
    const { state } = this.props;
    const { sizes } = state.getValue();
    const { width } = sizes.map;

    return value / width * 100;
  }

  setStatePeriod(period: [number, number]) {
    const { state } = this.props;

    state.setValue({
      ...state.getValue(),
      period,
    });
  }
}

export default Map;

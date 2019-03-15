// @flow

import createElement from '../../../core/create-element';
import dragDrop from '../../../core/drag-drop';
import checkTime from '../../../core/check-time';
import canvasDrawLines from '../../../core/canvas-draw/lines';
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
  configFrame: Object

  constructor(props: Props) {
    const { state } = props;

    this.props = props;

    state.subscribe(() => this.draw());

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
      listeners: {
        mousemove: (e) => console.log('@mousemove'),
        mousedown: (e) => console.log('@mousedown'),
        mouseup: (e) => console.log('@mouseup'),
        mouseover: (e) => console.log('@mouseover'),
        mouseout: (e) => console.log('@mouseout'),
      },
    });

    dragDrop({
      owner: this.canvas,
      listeners: {
        onStart: ({ eventStart }) => {
          const { map, mapNote } = this.configFrame;
          const { offsetX } = eventStart;
          let index = 0;

          for (index = 0; index < map.length; index++) {
            if (offsetX < map[index]) {
              break;
            }
          }

          return mapNote[index];
        },

        onMove: ({ eventDiff, stateStart }) => {
          console.log('@onMove', stateStart);
        },

        onClick: ({ eventClick, stateStart }) => {
          const { name } = stateStart;

          if (name === 'shadow' || name === 'frame') {
            const { offsetX } = eventClick;
            const { state } = this.props;
            const { sizes } = state.getValue();
            const { width } = sizes.map;
            const percentOffsetX = parseInt(offsetX / width * 100, 10);
            const percentDiff = 3;
            const period = [
              percentOffsetX - percentDiff,
              percentOffsetX + percentDiff
            ];

            period[0] = period[0] > 0 ? period[0] : 0;
            period[1] = period[1] < 100 ? period[1] : 100;

            state.setValue({
              ...state.getValue(),
              period,
            });
          }
        },

        onDbclick: ({ eventClick, stateStart }) => {
          const { name } = stateStart;

          if (name === 'frame') {
            const { state } = this.props;

            state.setValue({
              ...state.getValue(),
              period: [0, 100],
            });
          }
        },
      },
    });

    this.draw();
  }

  draw() {
    const { data, state } = this.props;
    const { sizes } = state.getValue();
    const { colors } = data;
    const context = this.canvas.getContext('2d');
    const config = this.getConfig();

    setSizeCanvasContext(this.canvas, sizes.map);

    this.drawLines(context, config);
    this.drawFrame(context);
  }

  getConfig() {
    const { data, state } = this.props;
    const { sizes, period, statusLine, countSectionsY } = state.getValue();
    const { columns, types } = data;

    return dataToChartConfig({
      size: sizes.map,
      period: [0, 100],
      columns,
      statusLine,
      types,
      countSectionsY,
    });
  }

  drawLines(context: Object, config: Object) {
    const { data } = this.props;

    context.lineWidth = 2;
    context.lineCap = 'butt';
    context.lineJoin = 'round';

    canvasDrawLines({
      context,
      config,
      data,
    });
  }

  drawFrame(context: Object) {
    this.configFrame = this.getConfigFrame();

    context.fillStyle = 'rgba(91, 119, 148, 0.5)';

    // Top & bottom
    this.configFrame.blocks.border
      .forEach(border => context.fillRect(...border));

    // Black blocks
    context.fillStyle = 'rgba(31, 42, 56, 0.7)';

    this.configFrame.blocks.shadow
      .forEach(border =>  context.fillRect(...border));
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
}

export default Map;

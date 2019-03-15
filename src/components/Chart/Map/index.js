// @flow

import createElement from '../../../core/create-element';
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
        mousemove: () => console.log('@mousemove'),
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
    const { state } = this.props;
    const { sizes, period } = state.getValue();
    const { height, width } = sizes.map;
    const percentWidth = width / 100;
    const offsetLeft = period[0] * percentWidth;
    const offsetRight = (100 - period[1]) * percentWidth;
    const border = sizes.space * 0.25;
    const topBottomWidth = width - offsetRight - offsetLeft;

    context.fillStyle = 'rgba(91, 119, 148, 0.5)';

    // Top & bottom
    context.fillRect(offsetLeft, 0, topBottomWidth, border);
    context.fillRect(offsetLeft, height - border, topBottomWidth, border);

    // Left & right
    context.fillRect(offsetLeft, border, sizes.space, height - (border * 2));
    context.fillRect(width - sizes.space - offsetRight, border, sizes.space, height - (border * 2));

    // Black blocks
    context.fillStyle = 'rgba(31, 42, 56, 0.7)';

    context.fillRect(0, 0, offsetLeft, height);
    context.fillRect(offsetLeft + topBottomWidth, 0, offsetRight, height);
  }
}

export default Map;

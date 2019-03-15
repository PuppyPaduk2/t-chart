// @flow

import createElement from '../../../core/create-element';
import checkTime from '../../../core/check-time';
import canvasDrawLines from '../../../core/canvas-draw/lines';
import canvasDrawHorizontalAxis from '../../../core/canvas-draw/horizontal-axis';
import setSizeCanvasContext from '../set-size-canvas-context';
import dataToChartConfig from '../data-to-chart-config';

type Props = {
  data: Object,
  owner: Object,
  state: Object,
};

class Content {
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
    const content = createElement({
      className: 'chart-content',
      owner,
    });

    this.canvas = createElement({
      tagName: 'canvas',
      owner: content,
    });

    this.draw();
  }

  draw() {
    checkTime(() => {
      const { data, state } = this.props;
      const { sizes } = state.getValue();
      const { colors } = data;
      const context = this.canvas.getContext('2d');
      const config = this.getConfig();

      setSizeCanvasContext(this.canvas, sizes.chart);

      this.drawLinesAxisY(context, config);
      this.drawLines(context, config);
      this.drawValueLinesAxisY(context, config);
    }, 'ChartContent.draw');
  }

  getConfig() {
    const { data, state } = this.props;
    const { sizes, period, statusLine, countSectionsY } = state.getValue();
    const { columns, types } = data;

    return dataToChartConfig({
      size: sizes.chart,
      period,
      columns,
      statusLine,
      types,
      countSectionsY,
    });
  }

  drawLinesAxisY(context: Object, config: Object) {
    const { pointsStepSectionY } = config;

    context.fillStyle = '#2D3A4A';

    pointsStepSectionY.forEach((step) => {
      const { points } = step;

      canvasDrawHorizontalAxis(context, points);
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

  drawValueLinesAxisY(context: Object, config: Object) {
    const { state } = this.props;
    const { sizes } = state.getValue();
    const { pointsStepSectionY } = config;

    context.font = '18px Arial';
    context.fillStyle = '#546778';

    console.log(pointsStepSectionY)

    pointsStepSectionY.forEach((step) => {
      const { value, points } = step;
      const firstPoint = points[0];

      context.fillText(value, firstPoint[0], firstPoint[1] - sizes.space);
    });
  }
}

export default Content;

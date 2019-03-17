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

  config: Object

  constructor(props: Props) {
    const { state } = props;

    this.props = props;

    state.subscribe(() => {
      const config = this.getConfig();

      console.log(this.config, config);

      this.draw();
    });

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
      const { state } = this.props;
      const { sizes } = state.getValue();
      const context = this.canvas.getContext('2d');

      this.config = this.getConfig();

      setSizeCanvasContext(this.canvas, sizes.chart);

      // this.drawLinesAxisY(context, config);
      this.drawLines(context, this.config);
      // this.drawValueLinesAxisY(context, config);
      // this.drawValueLinesAxisX(context, config);
    }, 'ChartContent.draw');
  }

  getConfig() {
    const { data, state } = this.props;
    const {
      sizes,
      period,
      statusLine,
      countSectionsAxis,
    } = state.getValue();
    const { columns, types } = data;
    const size = { ...sizes.chart };

    size.height -= sizes.heightAxisX;

    return dataToChartConfig({
      size,
      period,
      columns,
      statusLine,
      types,
      countSectionsAxis,
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

    pointsStepSectionY.forEach((step) => {
      const { value, points } = step;
      const firstPoint = points[0];

      context.fillText(value, firstPoint[0], firstPoint[1] - sizes.space);
    });
  }

  drawValueLinesAxisX(context: Object, config: Object) {
    const { state } = this.props;
    const { sizes } = state.getValue();
    const size = { ...sizes.chart };
    const { pointStepSectionsX } = config;

    context.font = '18px Arial';
    context.fillStyle = '#546778';

    pointStepSectionsX.forEach((step) => {
      const { dateStr, left } = step;

      context.fillText(dateStr, left, sizes.chart.height - sizes.space);
    });
  }
}

export default Content;

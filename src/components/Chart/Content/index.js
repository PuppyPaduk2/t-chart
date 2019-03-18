// @flow

import createElement from '../../../core/create-element';
import setSizeCanvasContext from '../set-size-canvas-context';
import getShotLines from '../proc-data/get-shot-lines';
import getDiffShotLinesbyPercent from '../proc-data/get-diff-shot-lines-by-percent';
import createTimer from '../../../core/create-timer';
import canvasDrawHorizontalAxis from '../../../core/canvas-draw/horizontal-axis';
import canvasDrawLine from '../../../core/canvas-draw/line';

type Props = {
  data: Object,
  owner: Object,
  state: Object,
};

const hexToRgb = (value: string) => [
  parseInt(value.slice(1, 3), 16),
  parseInt(value.slice(3, 5), 16),
  parseInt(value.slice(5, 7), 16),
];

const getRgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

class Content {
  props: Props

  canvas: Object

  shotLines: Object

  diffShotLines: Object

  timer: any

  constructor(props: Props) {
    const { state } = props;

    this.props = props;

    state.subscribe(() => this.redraw());

    this.render();
  }

  render() {
    const { owner, state } = this.props;
    const { sizes } = state.getValue();
    const content = createElement({
      className: 'chart-content',
      owner,
    });

    this.canvas = createElement({
      tagName: 'canvas',
      owner: content,
    });

    setSizeCanvasContext(this.canvas, sizes.chart);

    this.shotLines = this.getShotLines();
    this.diffShotLines = this.getDiffShotLines(
      this.shotLines,
      100,
    );

    this.draw();
  }

  getShotLines() {
    const { data, state } = this.props;

    return getShotLines(data, state.getValue());
  }

  getDiffShotLines(prevShot: Object, percent: number = 100) {
    const { data, state } = this.props;

    return getDiffShotLinesbyPercent({
      nextShot: this.shotLines,
      state: state.getValue(),
      statePrev: state.getPrevValue(),
      prevShot,
      percent,
      data,
    });
  }

  draw() {
    const { state } = this.props;
    const { sizes } = state.getValue();
    const { width, height } = sizes.chart;
    const context = this.canvas.getContext('2d');

    context.clearRect(0, 0, width, height);

    this.drawY(context, this.diffShotLines);
    this.drawLines(context, this.diffShotLines);
    this.drawValuesY(context, this.diffShotLines);
  }

  drawY = (context: Object, diffShotLines: Object) => {
    const ctx = context;
    const { pointsY } = diffShotLines;

    pointsY.forEach((point) => {
      const { points, opacity } = point;

      ctx.fillStyle = getRgba(...hexToRgb('#293544'), opacity);

      canvasDrawHorizontalAxis(context, points);
    });
  }

  drawLines = (context: Object, diffShotLines: Object) => {
    const { data } = this.props;
    const { originalData } = data;
    const { colors } = originalData;
    const ctx = context;
    const { pointsLines } = diffShotLines;

    ctx.lineWidth = 2;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';

    pointsLines.forEach((pointsLine) => {
      const { points, opacity } = pointsLine;

      ctx.strokeStyle = getRgba(...hexToRgb(colors[points[0]]), opacity);

      canvasDrawLine(context, points);
    });
  }

  drawValuesY = (context: Object, diffShotLines: Object) => {
    const { state } = this.props;
    const { sizes } = state.getValue();
    const ctx = context;
    const { pointsY } = diffShotLines;

    ctx.font = '18px Arial';

    pointsY.forEach((point) => {
      const { points, opacity, value } = point;
      const firstPoint = points[0];

      ctx.fillStyle = getRgba(...hexToRgb('#526475'), opacity);

      context.fillText(value, firstPoint[0], firstPoint[1] - sizes.space);
    });
  }

  redraw() {
    const prevShowLines = this.shotLines;
    const duration = 250;

    this.shotLines = this.getShotLines();

    if (!this.timer) {
      this.timer = createTimer((time, percent) => {
        this.diffShotLines = this.getDiffShotLines(
          prevShowLines,
          percent,
        );

        this.draw();
      }, duration).then(() => {
        this.timer = null;
        return true;
      });
    }
  }
}

export default Content;

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

const getRGBAColor = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;
const getLastValueShowY = (shot: Object) => {
  const { showY } = shot;
  const { values } = showY;

  return values[values.length - 1];
};

class Content {
  props: Props

  canvas: Object

  shotLines: Object

  diffShotLines: Object

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

    this.drawY(context);
    this.drawLines(context);
    this.drawValuesY(context);
  }

  drawY(context: Object) {
    const ctx = context;
    const { pointsY } = this.diffShotLines;

    pointsY.forEach((point) => {
      const { points, opacity } = point;

      ctx.fillStyle = getRGBAColor(52, 69, 90, opacity);

      canvasDrawHorizontalAxis(context, points);
    });
  }

  drawLines = (context: Object) => {
    const { data } = this.props;
    const { originalData } = data;
    const { colors } = originalData;
    const ctx = context;
    const { pointsLines } = this.diffShotLines;

    ctx.lineWidth = 2;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';

    // console.log(pointsLines);

    pointsLines.forEach((pointsLine) => {
      ctx.strokeStyle = colors[pointsLine[0]];

      canvasDrawLine(context, pointsLine);
    });

    // console.log(colors);
  }

  drawValuesY(context: Object) {
    const { state } = this.props;
    const { sizes } = state.getValue();
    const ctx = context;
    const { pointsY } = this.diffShotLines;

    ctx.font = '18px Arial';

    pointsY.forEach((point) => {
      const { points, opacity, value } = point;
      const firstPoint = points[0];

      ctx.fillStyle = getRGBAColor(52, 69, 90, opacity);

      context.fillText(value, firstPoint[0], firstPoint[1] - sizes.space);
    });
  }

  redraw() {
    const prevShowLines = this.shotLines;

    this.shotLines = this.getShotLines();

    // if (getLastValueShowY(this.shotLines) !== getLastValueShowY(prevShowLines)) {
      createTimer((time, percent) => {
        this.diffShotLines = this.getDiffShotLines(
          prevShowLines,
          percent,
        );

        this.draw();
      }, 350);
    // }
  }
}

export default Content;

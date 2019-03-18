// @flow

import createElement from '../../../core/create-element';
import getShotLines from '../proc-data/get-shot-lines';
import getDiffShotLinesbyPercent from '../proc-data/get-diff-shot-lines-by-percent';
import createTimer from '../../../core/create-timer';
import drawLines from '../../../core/draw/lines';
import drawY from '../../../core/draw/y';
import drawValuesY from '../../../core/draw/values-y';
import drawClear from '../../../core/draw/clear';
import setSizeCanvas from '../../../core/set-size-canvas';

type Props = {
  data: Object,
  owner: Object,
  state: Object,
};

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

    setSizeCanvas(this.canvas, sizes.chart);

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
    const { state, data } = this.props;
    const stateValue = state.getValue();
    const { sizes } = stateValue;
    const context = this.canvas.getContext('2d');
    const params = {
      diffShotLines: this.diffShotLines,
      state: stateValue,
      context,
      data,
    };

    drawClear(context, sizes.chart);
    drawY(params);
    drawLines(params);
    drawValuesY(params);
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

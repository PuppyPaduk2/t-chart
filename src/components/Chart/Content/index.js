// @flow

import createElement from '../../../core/create-element';
import drawLines from '../../../core/draw/lines';
import drawY from '../../../core/draw/y';
import drawValuesY from '../../../core/draw/values-y';
import drawClear from '../../../core/draw/clear';
import setSizeCanvas from '../../../core/set-size-canvas';

type Props = {
  owner: Object,
  size: Object,
  getShotLines: Function,
  getDiffShotLines: Function,
};

class Content {
  props: Props

  canvas: Object

  shotLines: Object

  diffShotLines: Object

  constructor(props: Props) {
    const { size, getShotLines, getDiffShotLines } = props;

    this.props = props;
    this.shotLines = getShotLines(size);
    this.diffShotLines = getDiffShotLines(this.shotLines, this.shotLines);

    this.render();
  }

  render() {
    const { owner, size } = this.props;
    const content = createElement({
      className: 'chart-content',
      owner,
    });

    this.canvas = createElement({
      tagName: 'canvas',
      owner: content,
    });

    setSizeCanvas(this.canvas, size);
  }

  getDiffShotLines() {
    const { size, getShotLines, getDiffShotLines } = this.props;
    const prevShowLines = this.shotLines;

    this.shotLines = getShotLines(size);
    this.diffShotLines = getDiffShotLines(prevShowLines, this.shotLines);
  }

  draw() {
    const { size } = this.props;
    const context = this.canvas.getContext('2d');
    // const drawParams = {
    //   ...params,
    //   context,
    // };

    drawClear(context, size);
    drawY(context, this.diffShotLines);
    // drawLines(this.diffShotLines);
    // drawValuesY(this.diffShotLines);
  }
}

export default Content;

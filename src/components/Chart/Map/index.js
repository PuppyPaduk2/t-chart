// @flow

import createElement from '../../../core/create-element';
import setSizeCanvas from '../../../core/set-size-canvas';
import drawClear from '../../../core/draw/clear';
import drawLines from '../../../core/draw/lines';

type Props = {
  owner: Object,
  size: Object,
};

class Map {
  props: Props

  canvas: Object

  constructor(props: Props) {
    this.props = props;

    this.render();
  }

  render() {
    const { owner, size } = this.props;
    const chartMap = createElement({
      className: 'chart-map',
      owner,
    });

    this.canvas = createElement({
      tagName: 'canvas',
      owner: chartMap,
    });

    setSizeCanvas(this.canvas, size);
  }

  draw(params: Object) {
    const { size } = this.props;
    const context = this.canvas.getContext('2d');
    const drawParams = {
      ...params,
      context,
    };

    drawClear(context, size);
    drawLines(drawParams);
  }
}

export default Map;

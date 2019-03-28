// @flow

type Params = {
  context: Object,
  state: Object,
  selectedPoint: Object,
};

const lineX = (params: Params) => {
  const { context, selectedPoint, state } = params;
  const { sizes, colors } = state;

  context.fillStyle = colors.selectedPoint.line;
  context.fillRect(selectedPoint[0][1], 0, 1, sizes.chart.height);
};

const points = (params: Params) => {
  const {
    context,
    selectedPoint,
    state,
    data,
  } = params;
  const {
    colors,
    hiddenLines,
    radiusSelectedPoint,
    innerRadiusSelectedPoint,
  } = state;

  lineX(params);

  selectedPoint.forEach(([id, x, y]) => {
    if (hiddenLines.indexOf(id) === -1) {
      const arcX = x + 1;

      context.beginPath();
      context.fillStyle = data.colors[id];
      context.arc(arcX, y, radiusSelectedPoint, 0, 2 * Math.PI);
      context.fill();

      context.beginPath();
      context.fillStyle = colors.background;
      context.arc(arcX, y, innerRadiusSelectedPoint, 0, 2 * Math.PI);
      context.fill();
    }
  });
};

export default (params: Params) => {
  lineX(params);
  points(params);
};

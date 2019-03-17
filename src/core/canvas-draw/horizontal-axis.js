// @flow

export default (context: Object, points: Array<[number, number]>) => {
  context.fillRect(
    0,
    parseInt(points[0][1], 10) - 1,
    parseInt(points[1][0] - points[0][0], 10),
    1,
  );
};

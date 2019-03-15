// @flow

export default (context: Object, points: Array<[number, number]>) => {
  context.fillRect(0, points[0][1] - 1, points[1][0] - points[0][0], 1);
};
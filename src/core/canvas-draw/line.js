// @flow

export default (context: Object, points: Array<[number, number]>) => {
  context.beginPath();

  points.forEach((point, index) => {
    if (index) {
      context.lineTo(...point);
    } else {
      context.moveTo(...point);
    }
  });

  context.stroke();
};

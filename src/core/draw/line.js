// @flow

export default (context: Object, points: Array<any>) => {
  context.beginPath();

  points.forEach((point, index) => {
    if (index) {
      if (index === 1) {
        context.moveTo(...point);
      } else {
        context.lineTo(...point);
      }
    }
  });

  context.stroke();
};

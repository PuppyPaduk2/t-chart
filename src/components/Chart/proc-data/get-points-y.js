// @flow

export default (showY: Object, y: Array<number>, state: Object) => {
  const { values } = showY;
  const max = values[values.length - 1];
  const { sizes } = state;
  const { height, width } = sizes.chart;
  const heightPercent = height / 100;
  const map = y.reduce((res, value) => {
    const percent = value / max * 100;
    const pointY = height - (heightPercent * percent);

    res.push([[0, pointY], [width, pointY]]);

    return res;
  }, []);

  return map;
};

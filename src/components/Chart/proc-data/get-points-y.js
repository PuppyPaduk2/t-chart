// @flow

type Params = {
  showY: Object,
  y: Array<number>,
  size: Object,
};

export default (params: Params) => {
  const { showY, size, y } = params;
  const { values } = showY;
  const max = values[values.length - 1];
  const { height, width } = size;
  const heightPercent = height / 100;
  const map = y.reduce((res, value) => {
    const percent = value / max * 100;
    const pointY = height - (heightPercent * percent);

    res.push([[0, pointY], [width, pointY]]);

    return res;
  }, []);

  return map;
};

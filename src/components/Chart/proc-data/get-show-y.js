// @flow

type Params = {
  border: Object,
  y: Array<number>,
  countSectionsAxis: Object,
};

export default (params: Params) => {
  const { border, y, countSectionsAxis } = params;
  const { max } = border;
  const valIndex = y.reduce(
    (res, step, index) => (step < max ? index : res),
    y.length - 1,
  ) + 1;
  const valMod = Math.floor(valIndex / countSectionsAxis.y) || 1;
  const values = y.reduce((res, value, index) => {
    if (index % valMod === 0 && index <= valIndex) {
      res.push(value);
    }

    return res;
  }, []);

  let indexLastValue = y.indexOf(values[values.length - 1]);

  while (values[values.length - 1] < max) {
    indexLastValue += 1;
    values[values.length - 1] = y[indexLastValue];
  }

  return {
    map: y.reduce((res, value) => [
      ...res,
      values.indexOf(value) !== -1 ? 1 : 0,
    ], []),
    values,
  };
};

// @flow

import getColumnsByType from './get-columns-by-type';

type Params = {
  data: Object,
  period: [number, number],
  size: Object,
  countSectionsAxis: Object,
};

export default (params: Params) => {
  const {
    data,
    size,
    period,
    countSectionsAxis,
  } = params;
  const { width } = size;
  const percentWidth = width / 100;
  const percentPeriod = (period[1] - period[0]) / 100;
  const [[id, ...columnX]] = getColumnsByType(data, 'x');
  const length = columnX.length - 1;
  const showInPeriod = [];
  const step = Math.round((length / countSectionsAxis.x));
  const result = columnX.reduce((res, value, index) => {
    const show = index % Math.round(step * percentPeriod) === 0 ? 1 : 0;
    let percentX = index / length * 100 / percentPeriod;

    percentX -= period[0] / percentPeriod;

    const point = [
      [percentX * percentWidth, 0],
      value,
      show,
    ];

    if (percentX >= 0 && percentX <= 100 && show === 1) {
      showInPeriod.push(index);
    }

    res.push(point);

    return res;
  }, []);

  return result;
};

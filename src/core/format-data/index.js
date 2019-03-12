// @flow

import checkTime from './check-time';

type Params = {
  state: Object,
  data: Object,
};

const getPercentX = (index, column) => (index - 1) / (column.length - 2) * 100;

const filterByPeriod = (params: Params, column) => {
  const { state } = params;
  const { period } = state.getValue();

  return column.filter((value, index) => {
    if (typeof value === 'number') {
      const persent = getPercentX(index, column);

      return period[0] <= persent && persent <= period[1];
    }
  });
};

const getMaxValue = (params: Params, column) => {
  return filterByPeriod(params, column).reduce((result, value) => (
    typeof value === 'number' && result < value
      ? value
      : result
  ), 0);
};

const checkStatusLine = (state, id) => {
  const { statusLine } = state.getValue();

  return statusLine[id] === undefined ||
    statusLine[id] === true;
};

const isLine = (data, id) => {
  const { types } = data;

  return types[id] === 'line';
};

const getMaxValues = (params: Params) => {
  const { state, data } = params;
  const { columns } = data;

  return columns.reduce((result, column) => {
    const id = column[0];

    if (isLine(data, id) && checkStatusLine(state, id)) {
      result[id] = getMaxValue(params, column);
    }

    return result;
  }, {});
};

const getMaxValueLines = (params: Params) => {
  const maxValues = getMaxValues(params);

  return Object.keys(maxValues).reduce((result, id) => (
    result < maxValues[id] ? maxValues[id] : result
  ), 0);
};

const getPrecentPointsYColumns = (params: Params, maxValue: number) => {
  const { data, state } = params;
  const { columns } = data;

  return columns.reduce((result, column) => {
    const id = column[0];

    if (isLine(data, id) && checkStatusLine(state, id)) {
      result[id] = filterByPeriod(params, column).reduce((columnResult, value, index) => {
        if (typeof value === 'number') {
          columnResult.push([
            getPercentX(index, column),
            value / maxValue * 100,
          ]);
        }

        return columnResult;
      }, []);
    }

    return result;
  }, {});
};

const getPointsYColumns = (params, precentPoints) => {
  const { state } = params;
  const { size, period } = state.getValue();
  const { width, height } = size;
  const widthPercentX = width / (period[1] - period[0]);
  const widthPercentY = height / 100;

    // console.log(widthPercentX, precentPoints);

  return Object.keys(precentPoints).reduce((result, id) => {
    const column = precentPoints[id];

    console.log(column.length)

    result[id] = column.map((precentPoint) => ([
      precentPoint[0] * widthPercentX,
      height - (precentPoint[1] * widthPercentY),
    ]));

    return result;
  }, {});
};

function formatData(params: Params) {
  return checkTime(() => {
    const maxValue = getMaxValueLines(params);
    const precentPointsY = getPrecentPointsYColumns(params, maxValue);
    const pointsY = getPointsYColumns(params, precentPointsY);

    return pointsY;
  }, 'formatData');
}

export default formatData;

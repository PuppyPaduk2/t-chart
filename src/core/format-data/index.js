// @flow

import checkTime from './check-time';

type Params = {
  state: Object,
  data: Object,
};

const getMaxValue = column => column.reduce((result, value) => (
  typeof value === 'number' && result < value
    ? value
    : result
), 0);

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
      result[id] = getMaxValue(column);
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

const getPercentX = (index, column) => (index - 1) / (column.length - 2) * 100;

const getPrecentPointsYColumns = (params: Params, maxValue: number) => {
  const { data, state } = params;
  const { columns } = data;

  return columns.reduce((result, column) => {
    const id = column[0];

    if (isLine(data, id) && checkStatusLine(state, id)) {
      result[id] = column.reduce((columnResult, value, index) => {
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
  console.log('@getPointsYColumns');
};

function formatData(params: Params) {
  checkTime(() => {
    const maxValue = getMaxValueLines(params);
    const precentPointsY = getPrecentPointsYColumns(params, maxValue);
    const pointsY = getPointsYColumns(params, precentPointsY);

    console.log(maxValue, precentPointsY);
  }, 'formatData');
}

export default formatData;

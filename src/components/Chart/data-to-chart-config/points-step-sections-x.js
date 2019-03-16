// @flow

import filterColumnByPeriod from './filter-column-by-period';
import { monthsNameShort } from '../../../core/constants';

type Params = {
  period: [number, number],
  columns: Array<Array<any>>,
  countSectionsAxis: { x: number },
  size: { width: number, height: number },
};

const dateToStr = (date: Date) => `${monthsNameShort[date.getMonth()]} ${date.getDate()}`;

export default (params: Params) => {
  const {
    period,
    columns,
    countSectionsAxis,
    size,
  } = params;
  const { width } = size;
  const widthPercent = width / 100;
  const columnX = columns.filter(column => column[0] === 'x')[0];
  const filteredColumnX = filterColumnByPeriod(period, columnX);
  const widthStep = Math.round(filteredColumnX.length / countSectionsAxis.x + 1);
  const offsetStep = 3;
  const result = [];
  let currentStep = 0;

  for (let index = 0; index < countSectionsAxis.x; index += 1) {
    currentStep = index * widthStep;
    currentStep = currentStep === 0 ? offsetStep : currentStep;
    currentStep = currentStep < filteredColumnX.length
      ? currentStep
      : filteredColumnX.length;

    const value = filteredColumnX[currentStep];
    const date = new Date(value);
    const percent = currentStep / filteredColumnX.length * 100;

    result.push({
      index: currentStep,
      dateStr: dateToStr(date),
      left: percent * widthPercent,
      percent,
      value,
      date,
    });
  }

  return result;
};

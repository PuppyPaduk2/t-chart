// @flow

import dragDrop from '../../../core/drag-drop';
import getEventOffset from '../../../core/drag-drop/get-event-offset';

const getPercentOffsetX = (dragDropState: Object, value: number) => {
  const { state } = dragDropState.getValue();
  const { sizes } = state.getValue();
  const { width } = sizes.map;

  return value / width * 100;
};

const setStatePeriod = (dragDropState: Object, period: [number, number]) => {
  const { state } = dragDropState.getValue();

  state.setValue({
    ...state.getValue(),
    period,
  });
};

const onStartDragDrop = dragDropState => (params: Object) => {
  const { eventStart } = params;
  const { state, configFrame } = dragDropState.getValue();
  const { period } = state.getValue();
  const { map, mapNote } = configFrame;
  const { offsetX } = getEventOffset(eventStart);
  let index = 0;

  for (index = 0; index < map.length; index += 1) {
    if (offsetX < map[index]) {
      break;
    }
  }

  return {
    eventObject: mapNote[index],
    period,
  };
};

const onMoveDragDropShadow = (dragDropState: Object, params: Object) => {
  const { eventDiff, eventStart } = params;
  const percentStart = getPercentOffsetX(
    dragDropState,
    getEventOffset(eventStart).offsetX,
  );
  const percentDiff = getPercentOffsetX(
    dragDropState,
    getEventOffset(eventDiff).offsetX,
  );

  if (percentDiff > 0) {
    let borderRight = percentStart + percentDiff;

    borderRight = borderRight < 100 ? borderRight : 100;

    setStatePeriod(dragDropState, [percentStart, borderRight]);
  } else {
    let borderLeft = percentStart + percentDiff;

    borderLeft = borderLeft > 0 ? borderLeft : 0;

    setStatePeriod(dragDropState, [borderLeft, percentStart]);
  }
};

const onMoveDragDropFrame = (dragDropState: Object, params: Object) => {
  const { stateStart, eventDiff } = params;
  const { period } = stateStart;
  const percentDiff = getPercentOffsetX(
    dragDropState,
    getEventOffset(eventDiff).offsetX,
  );
  const newPeriod = [period[0] + percentDiff, period[1] + percentDiff];

  newPeriod[0] = newPeriod[0] > 0 ? newPeriod[0] : 0;
  newPeriod[1] = newPeriod[1] < 100 ? newPeriod[1] : 100;

  if ((period[1] - period[0]) <= (newPeriod[1] - newPeriod[0])) {
    setStatePeriod(dragDropState, newPeriod);
  }
};

const onMoveDragDropTriggerLeft = (dragDropState: Object, params: Object) => {
  const { stateStart, eventDiff } = params;
  const { period } = stateStart;
  const percentDiff = getPercentOffsetX(
    dragDropState,
    getEventOffset(eventDiff).offsetX,
  );
  let borderLeft = period[0] + percentDiff;

  borderLeft = borderLeft > 0 ? borderLeft : 0;
  borderLeft = borderLeft < 100 ? borderLeft : 100;

  if (borderLeft <= period[1]) {
    setStatePeriod(dragDropState, [borderLeft, period[1]]);
  } else {
    setStatePeriod(dragDropState, [period[1], borderLeft]);
  }
};

const onMoveDragDropTriggerRight = (dragDropState: Object, params: Object) => {
  const { stateStart, eventDiff } = params;
  const { period } = stateStart;
  const percentDiff = getPercentOffsetX(
    dragDropState,
    getEventOffset(eventDiff).offsetX,
  );
  let borderRight = period[1] + percentDiff;

  borderRight = borderRight > 0 ? borderRight : 0;
  borderRight = borderRight < 100 ? borderRight : 100;

  if (borderRight >= period[0]) {
    setStatePeriod(dragDropState, [period[0], borderRight]);
  } else {
    setStatePeriod(dragDropState, [borderRight, period[0]]);
  }
};

const onMoveDragDropTrigger = (dragDropState: Object, params: Object) => {
  const { stateStart } = params;
  const { eventObject } = stateStart;
  const { position } = eventObject;

  if (position === 'left') {
    onMoveDragDropTriggerLeft(dragDropState, params);
  } else {
    onMoveDragDropTriggerRight(dragDropState, params);
  }
};

const onMoveDragDrop = dragDropState => (params: Object) => {
  const { stateStart, eventDiffPrev } = params;
  const { eventObject } = stateStart;
  const { name } = eventObject;

  if (eventDiffPrev.offsetX !== 0) {
    if (name === 'shadow') {
      onMoveDragDropShadow(dragDropState, params);
    } else if (name === 'frame') {
      onMoveDragDropFrame(dragDropState, params);
    } else if (name === 'trigger') {
      onMoveDragDropTrigger(dragDropState, params);
    }
  }
};

const onClickDragDrop = dragDropState => (params: Object) => {
  const { eventClick, stateStart } = params;
  const { eventObject } = stateStart;
  const { name } = eventObject;

  if (name === 'shadow' || name === 'frame') {
    const { offsetX } = getEventOffset(eventClick);
    const percentOffsetX = getPercentOffsetX(dragDropState, offsetX);
    const percentDiff = 3;
    const period = [
      percentOffsetX - percentDiff,
      percentOffsetX + percentDiff,
    ];

    period[0] = period[0] > 0 ? period[0] : 0;
    period[1] = period[1] < 100 ? period[1] : 100;

    setStatePeriod(dragDropState, period);
  }
};

const onDbclickDragDrop = dragDropState => (params: Object) => {
  const { stateStart } = params;
  const { eventObject } = stateStart;
  const { name } = eventObject;

  if (name === 'frame') {
    const { state } = dragDropState.getValue();

    state.setValue({
      ...state.getValue(),
      period: [0, 100],
    });
  }
};

export default (dragDropState: Object) => {
  const { owner } = dragDropState.getValue();

  dragDrop({
    listeners: {
      onStart: onStartDragDrop(dragDropState),
      onMove: onMoveDragDrop(dragDropState),
      onClick: onClickDragDrop(dragDropState),
      onDbclick: onDbclickDragDrop(dragDropState),
    },
    owner,
  });
};

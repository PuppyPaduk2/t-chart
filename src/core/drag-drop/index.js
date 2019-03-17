// @flow

import listenElement from '../listen-element';

type Params = {
  owner: Object,
  listeners: Object,
};

const getEventsDiff = (event1, event2) => ({
  clientX: event1.clientX - event2.clientX,
  clientY: event1.clientY - event2.clientY,
  offsetX: event1.offsetX - event2.offsetX,
  offsetY: event1.offsetY - event2.offsetY,
});

export default (params: Params) => {
  const { owner, listeners } = params;
  const {
    onStart,
    onEnd,
    onMove,
    onClick,
    onDbclick,
  } = listeners;
  let eventStart = null;
  let eventMovePrev = null;
  let stateStart = null;
  let status = null;
  let prev = null;

  const reset = () => {
    eventStart = null;
    eventMovePrev = null;
    status = null;
    stateStart = null;
  };

  return listenElement({
    element: window,
    listeners: {
      mousedown: (e) => {
        const { target } = e;

        if (target === owner) {
          eventStart = e;
          eventMovePrev = e;
          status = 'start';

          if (onStart) {
            stateStart = onStart({ eventStart }) || null;
          }

          prev = { eventStart, stateStart };
        }
      },

      mousemove: (eventMove) => {
        if (eventStart && eventMovePrev && onMove) {
          const eventDiffPrev = getEventsDiff(eventMove, eventMovePrev);

          if (eventDiffPrev.offsetX !== 0 || eventDiffPrev.offsetY !== 0) {
            status = 'move';

            onMove({
              eventDiff: getEventsDiff(eventMove, eventMovePrev),
              eventStart,
              eventMove,
              stateStart,
              eventDiffPrev,
            });
          }
        }
      },

      mouseup: (eventEnd) => {
        prev = { ...prev, status };

        if (prev.status === 'move') {
          if (onEnd) {
            onEnd({ ...prev, eventEnd });
          }

          reset();
        }
      },

      click: (eventClick) => {
        if (prev && prev.status === 'start') {
          if (onClick) {
            onClick({ ...prev, eventClick });
          }

          reset();
        }
      },

      dblclick: (eventClick) => {
        if (prev && prev.status === 'start') {
          if (onDbclick) {
            onDbclick({ ...prev, eventClick });
          }

          reset();
        }
      },
    },
  });
};

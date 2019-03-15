// @flow

import listenElement from '../listen-element';

type Params = {
  owner: Object,
  listeners: Object,
};

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
  let stateStart = null;
  let status = null;
  let prev = null;

  const reset = () => {
    eventStart = null;
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
          status = 'start';

          if (onStart) {
            stateStart = onStart({ eventStart }) || null;
          }

          prev = { eventStart, stateStart };
        }
      },

      mousemove: (eventMove) => {
        if (eventStart && onMove) {
          status = 'move';

          onMove({
            eventDiff: {
              clientX: eventMove.clientX - eventStart.clientX,
              clientY: eventMove.clientY - eventStart.clientY,
              offsetX: eventMove.offsetX - eventStart.offsetX,
              offsetY: eventMove.offsetY - eventStart.offsetY,
            },
            eventStart,
            eventMove,
            stateStart,
          });
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
      }
    },
  });
};

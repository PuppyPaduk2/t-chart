// @flow

import listenElement from '../listen-element';
import mousedown from './mousedown';
import mousemove from './mousemove';
import mouseup from './mouseup';
import click from './click';
import dblclick from './dblclick';

type Params = {
  owner: Object,
  listeners: Object,
};

export default (params: Params) => {
  const context = {
    eventStart: null,
    eventMovePrev: null,
    stateStart: null,
    status: null,
    prev: null,
    reset: () => {
      context.eventStart = null;
      context.eventMovePrev = null;
      context.status = null;
      context.stateStart = null;
    },
  };

  return listenElement({
    element: window,
    listeners: {
      mousedown: mousedown(params, context),
      touchstart: mousedown(params, context),

      mousemove: mousemove(params, context),
      touchmove: mousemove(params, context),

      mouseup: mouseup(params, context),
      touchend: mouseup(params, context),

      click: click(params, context),
      dblclick: dblclick(params, context),
    },
  });
};

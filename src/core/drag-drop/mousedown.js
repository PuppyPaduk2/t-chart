// @flow

export default (params: Object, context: Object) => (e: Object) => {
  const ctx = context;
  const { owner, listeners } = params;
  const { onStart } = listeners;
  const { target } = e;

  if (target === owner) {
    ctx.eventStart = e;
    ctx.eventMovePrev = e;
    ctx.status = 'start';

    if (onStart) {
      ctx.stateStart = onStart({ eventStart: ctx.eventStart }) || null;
    }

    ctx.prev = {
      eventStart: ctx.eventStart,
      stateStart: ctx.stateStart,
    };
  }
};

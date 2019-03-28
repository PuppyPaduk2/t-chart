// @flow

export default (params: Object, context: Object) => (eventEnd: Object) => {
  const { listeners } = params;
  const { onEnd } = listeners;
  const ctx = context;

  ctx.prev = { ...ctx.prev, status: ctx.status };

  if (ctx.prev.status === 'move') {
    if (onEnd) {
      onEnd({ ...ctx.prev, eventEnd });
    }

    ctx.reset();
  }
};

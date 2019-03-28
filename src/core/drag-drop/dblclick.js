// @flow

export default (params: Object, context: Object) => (eventClick: Object) => {
  const { listeners } = params;
  const { onDbclick } = listeners;
  const { prev, reset } = context;

  if (prev && prev.status === 'start') {
    if (onDbclick) {
      onDbclick({ ...prev, eventClick });
    }

    reset();
  }
};

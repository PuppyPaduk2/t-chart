// @flow

export default (params: Object, context: Object) => (eventClick: Object) => {
  const { listeners } = params;
  const { onClick } = listeners;
  const { prev, reset } = context;

  if (prev && prev.status === 'start') {
    if (onClick) {
      onClick({ ...prev, eventClick });
    }

    reset();
  }
};

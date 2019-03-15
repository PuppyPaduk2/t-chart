// @flow

type Params = {
  element: Object,
  listeners: Object,
};

export default (params: Params) => {
  const { element, listeners } = params;

  Object.keys(listeners).forEach(nameEvent =>
    element.addEventListener(nameEvent, listeners[nameEvent]));

  return () => {
    Object.keys(listeners).forEach(nameEvent =>
      element.removeEventListener(nameEvent, listeners[nameEvent]));
  };
};

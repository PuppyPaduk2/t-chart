// @flow

type Params = {
  owner?: Object,
  tagName?: string,
  id?: string,
  text?: string,
  className?: string,
  listeners?: Object,
};

function createElement(params?: Params = {}) {
  const {
    tagName = 'div',
    owner,
    id,
    text,
    className,
    listeners,
  } = params;
  const element = document.createElement(tagName);

  if (id) {
    element.id = id;
  }

  if (text) {
    element.innerText = text;
  }

  if (className) {
    element.className = className;
  }

  if (owner) {
    owner.append(element);
  }

  if (listeners) {
    Object.keys(listeners)
      .forEach(nameEvent =>
        element.addEventListener(nameEvent, listeners[nameEvent]));
  }

  return element;
}

export default createElement;

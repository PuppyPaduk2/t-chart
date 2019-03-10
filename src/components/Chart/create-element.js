// @flow

type Params = {
  id?: string,
  text?: string,
  className?: string,
};

function createElement(owner: Object, params?: Params = {}) {
  const element = document.createElement('div');
  const { id, text, className } = params;

  if (id) {
    element.id = id;
  }

  if (text) {
    element.innerText = text;
  }

  if (className) {
    element.className = className;
  }

  owner.append(element);

  return element;
}

export default createElement;

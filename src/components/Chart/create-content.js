// @flow

import createElement from '../../core/create-element';

function createContent(owner: Object) {
  const element = createElement({
    className: 'chart-content',
    owner,
  });
  const canvas = createElement({
    owner: element,
    tagName: 'canvas',
  });

  return element;
}

export default createContent;

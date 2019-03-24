// @flow

export default (event: Object) => {
  if (event instanceof TouchEvent) {
    const rect = event.target.getBoundingClientRect();

    return {
      offsetX: event.targetTouches[0].pageX - rect.left,
      offsetY: event.targetTouches[0].pageY - rect.top,
    };
  }
  return {
    offsetX: event.offsetX,
    offsetY: event.offsetY,
  };
};

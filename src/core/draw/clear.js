// @flow

export default (context: Object, size: Object, begin: Object = { x: 0, y: 0 }) => {
  const ctx = context;
  const { width, height } = size;
  const { x, y } = begin;

  ctx.clearRect(x, y, width, height);
};

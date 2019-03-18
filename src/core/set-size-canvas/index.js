// @flow

type Size = {
  width: number,
  height: number,
};

export default (canvas: Object, size: Size) => {
  const { width, height } = size;

  canvas.setAttribute('width', width.toString());
  canvas.setAttribute('height', height.toString());

  return canvas;
};

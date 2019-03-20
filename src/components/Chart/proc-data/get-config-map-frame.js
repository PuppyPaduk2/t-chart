// @flow

export default (state: Object) => {
  const { sizes, period } = state;
  const { height, width } = sizes.map;
  const percentWidth = width / 100;
  const offset = {
    left: period[0] * percentWidth,
    right: (100 - period[1]) * percentWidth,
  };
  const border = sizes.space * 0.25;
  const widthTriggers = sizes.space;
  const frameWidth = width - offset.right - offset.left;

  return {
    width: frameWidth,
    blocks: {
      border: [
        [offset.left, 0, frameWidth, border],
        [offset.left, height - border, frameWidth, border],
        [offset.left, border, widthTriggers, height - (border * 2)],
        [width - sizes.space - offset.right, border, widthTriggers, height - (border * 2)],
      ],
      shadow: [
        [0, 0, offset.left, height],
        [offset.left + frameWidth, 0, offset.right, height],
      ],
    },
    offset,
    widthTriggers,
    map: [
      offset.left, // left shadow block
      offset.left + widthTriggers, // left trigger
      offset.left + frameWidth - widthTriggers, // frame
      offset.left + frameWidth, // right trigger
      width, // right shadow block
    ],
    mapNote: [
      { name: 'shadow', position: 'left' },
      { name: 'trigger', position: 'left' },
      { name: 'frame', position: 'center' },
      { name: 'trigger', position: 'right' },
      { name: 'shadow', position: 'right' },
    ],
  };
};

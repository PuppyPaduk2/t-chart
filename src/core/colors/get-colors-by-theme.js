// @flow

export default (theme: string) => {
  if (theme === 'dark') {
    return {
      textY: '#526475',
      textX: '#526475',
      y: '#293544',
      mapFrame: {
        border: [91, 119, 148, 0.5],
        shadow: [31, 42, 56, 0.7],
      },
      selectedPoint: {
        line: '#526475',
      },
      background: '#242F3E',
    };
  }

  return {
    textY: '#96a2aa',
    textX: '#96a2aa',
    y: '#f2f4f5',
    mapFrame: {
      border: [221, 234, 243, 0.9],
      shadow: [245, 249, 251, 0.7],
    },
    selectedPoint: {
      line: '#dfe6eb',
    },
    background: '#ffffff',
  };
};

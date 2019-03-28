// @flow

export default (lines: Array<Array<any>>, hiddenLines: Array<string>) => lines.reduce(
  (res, line) => {
    const id = line[0];

    if (hiddenLines.indexOf(id) === -1) {
      res.push(line);
    }

    return res;
  },
  [],
);

// @flow

export default (lines: Array<Array<any>>, state: Object) => {
  const { statusLine } = state;

  return lines.reduce((res, line) => {
    const id = line[0];

    if (statusLine[id] === undefined || statusLine[id] === true) {
      res.push(line);
    }

    return res;
  }, []);
};

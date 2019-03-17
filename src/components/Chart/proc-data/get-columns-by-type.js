// @flow

export default (data: Object, type: string) => {
  const { columns, types } = data;

  return columns.reduce((res, column) => {
    const id = column[0];

    if (types[id] === type) {
      res.push(column);
    }

    return res;
  }, []);
};

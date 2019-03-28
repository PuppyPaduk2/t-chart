// @flow

type State = {
  getValue: Function,
  setValue: Function,
  subscribe: Function,
};

function createState(defaultValue: any): State {
  let value = defaultValue;
  let prevValue = defaultValue;
  const subscribers: Array<Function> = [];

  return {
    getValue: () => value,
    getPrevValue: () => prevValue,
    setValue: (nextValue: any) => {
      if (value !== nextValue) {
        prevValue = value;

        value = nextValue;

        subscribers.forEach(callback => callback(prevValue, nextValue));
      }
    },
    subscribe: (callback: Function): Function => {
      const index = subscribers.push(callback);

      return () => subscribers.splice(index, 1);
    },
  };
}

export default createState;

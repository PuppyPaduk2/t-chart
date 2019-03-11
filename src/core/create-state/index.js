// @flow

type State = {
  getValue: Function,
  setValue: Function,
  subscribe: Function,
};

function createState(defaultValue: any): State {
  let value = defaultValue;
  const subscribers: Array<Function> = [];

  return {
    getValue: () => value,
    setValue: (nextValue: any) => {
      if (value !== nextValue) {
        const prevValue = value;

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

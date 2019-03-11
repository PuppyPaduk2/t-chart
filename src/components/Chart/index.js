// @flow

import createElement from '../../core/create-element';
import createState from '../../core/create-state';
import formatData from '../../core/format-data';
import ToggleButtonLine from '../ToggleButtonLine';
import './styles.css';

type Props = {
  owner: Object,
  data: Object,
};

type State = {
  size: { width: number, hieght: number },
  period: [number, number],
  offLines: Object,
};

class Chart {
  container: Object
  props: Props
  state: Object

  constructor(props: Props) {
    this.props = props;
    this.state = createState({
      size: { width: 700, height: 450 },
      period: [0, 100],
      statusLine: {},
    });

    this.state.subscribe((prevState, nextState) => {
      formatData({
        state: this.state,
        data: this.props.data,
      });
    });

    formatData({
      state: this.state,
      data: this.props.data,
    });

    this.createContainer();
    this.render();
  }

  createContainer() {
    const { owner } = this.props;

    this.container = createElement({
      className: 'chart',
      owner,
    });

    return this.container;
  }

  createHeader() {
    createElement({
      className: 'chart-header',
      text: 'Followers',
      owner: this.container,
    });
  }

  createContent() {
    createElement({
      className: 'chart-content',
      owner: this.container,
    });
  }

  createMap() {
    createElement({
      className: 'chart-map',
      owner: this.container,
    });
  }

  createTogglersBar() {
    const { data } = this.props;
    const { names, colors } = data;
    const togglersBar = createElement({
      className: 'chart-togglers-bar',
      owner: this.container,
    });

    Object.keys(names).forEach(key => new ToggleButtonLine({
      owner: togglersBar,
      text: names[key],
      colorIcon: colors[key],
      value: true,
      onChange: this.onChangeLine(key),
    }));
  }

  render() {
    const { data } = this.props;

    this.createHeader();
    this.createContent();
    this.createMap();
    this.createTogglersBar();
  }

  onChangeLine = (id: string) => (value: boolean) => {
    const stateValue = { ...this.state.getValue() };

    stateValue.statusLine = {
      ...stateValue.statusLine,
      [id]: value,
    };

    this.state.setValue(stateValue);
  }
}

export default Chart;

// @flow

import createElement from '../../core/create-element';
import createState from '../../core/create-state';
import ToggleButtonLine from '../ToggleButtonLine';
import Content from './Content';
import Map from './Map';
import './styles.css';

type Props = {
  owner: Object,
  data: Object,
};

class Chart {
  container: Object

  content: Object

  map: Object

  props: Props

  state: Object

  constructor(props: Props) {
    this.props = props;
    this.state = createState({
      sizes: {
        space: 8,
        chart: { width: 700, height: 450 },
        heightAxisX: 30,
        map: { width: 700, height: 50 },
      },
      period: [35, 65],
      statusLine: {},
      countSectionsAxis: { y: 6, x: 6 },
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
    const { data } = this.props;

    this.content = new Content({
      owner: this.container,
      state: this.state,
      data,
    });
  }

  createMap() {
    const { data } = this.props;

    this.map = new Map({
      owner: this.container,
      state: this.state,
      data,
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

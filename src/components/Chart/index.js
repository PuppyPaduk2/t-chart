// @flow

import createElement from '../../core/create-element';
import createState from '../../core/create-state';
import createTimer from '../../core/create-timer';
import ToggleButtonLine from '../ToggleButtonLine';
import Content from './Content';
import Map from './Map';
import createY from './proc-data/create-y';
import getShotLines from './proc-data/get-shot-lines';
import getDiffShotLinesbyPercent from './proc-data/get-diff-shot-lines-by-percent';
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

  y: Object

  state: Object

  shotLines: Object

  diffShotLines: Object

  timer: any

  config: Object

  constructor(props: Props) {
    this.props = props;

    this.state = createState({
      sizes: {
        space: 8,
        chart: { width: 700, height: 420 },
        heightX: 30,
        map: { width: 700, height: 50 },
      },
      period: [0, 100],
      hiddenLines: [],
      countSectionsAxis: { y: 6, x: 6 },
      animationDuration: 250,
      colors: {
        textY: '#526475',
        y: '#293544',
      },
    });


    this.y = this.createY();

    this.render();

    this.state.subscribe(() => this.redraw());
  }

  createY() {
    const { data } = this.props;
    const { period, hiddenLines } = this.state.getValue();

    return createY({
      data,
      period,
      hiddenLines,
    });
  }

  getShotLines = (size: Object) => {
    const { data } = this.props;
    const { period, hiddenLines, countSectionsAxis } = this.state.getValue();

    return getShotLines({
      y: this.y,
      size,
      data,
      period,
      hiddenLines,
      countSectionsAxis,
    });
  }

  getDiffShotLines = (prevShot: Object, nextShot: Object, percent: number = 100) => {
    return getDiffShotLinesbyPercent({
      prevHiddenLines: this.state.getPrevValue().hiddenLines,
      nextHiddenLines: this.state.getValue().hiddenLines,
      data: this.props.data,
      y: this.y,
      prevShot,
      nextShot,
      percent,
    });
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
    const { sizes } = this.state.getValue();
    const { chart, heightX } = sizes;

    this.content = new Content({
      owner: this.container,
      size: {
        ...chart,
        height: chart.height + heightX,
      },
      getShotLines: this.getShotLines,
      getDiffShotLines: this.getDiffShotLines,
    });
  }

  createMap() {
    const { sizes } = this.state.getValue();
    const { map } = sizes;

    this.map = new Map({
      owner: this.container,
      size: map,
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
    this.createContainer();
    this.createHeader();
    this.createContent();
    // this.createMap();
    this.createTogglersBar();

    this.draw();
  }

  draw() {
    this.content.draw();
    // this.map.draw(drawParams);
  }

  redraw() {
    const prevShowLines = this.shotLines;
    const stateValue = this.state.getValue();
    const {
      period,
      hiddenLines,
      countSectionsAxis,
      sizes,
      animationDuration,
    } = stateValue;

    this.shotLines = getShotLines({
      y: this.y,
      size: sizes.chart,
      data: this.props.data,
      period,
      hiddenLines,
      countSectionsAxis,
    });

    if (!this.timer) {
      this.timer = createTimer((time, percent) => {
        this.diffShotLines = this.getDiffShotLines(
          prevShowLines,
          percent,
        );

        this.draw();
      }, animationDuration).then(() => {
        this.timer = null;
        return true;
      });
    }
  }

  onChangeLine = (id: string) => (value: boolean) => {
    const stateValue = { ...this.state.getValue() };

    stateValue.hiddenLines = [...stateValue.hiddenLines];

    if (value === false) {
      stateValue.hiddenLines.push(id);
    } else {
      stateValue.hiddenLines.splice(
        stateValue.hiddenLines.indexOf(id),
        1,
      );
    }

    this.state.setValue(stateValue);
  }
}

export default Chart;

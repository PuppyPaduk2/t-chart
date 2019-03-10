// @flow

import Chart from './components/Chart';
import './styles.css';
import chartData from './data/chart_data.json';

window.addEventListener('load', () => {
  const root = document.getElementById('root');

  chartData.forEach((data) => {
    const chart = new Chart({
      owner: root,
      data,
    });
  });
});

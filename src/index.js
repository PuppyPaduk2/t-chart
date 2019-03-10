// @flow

import Button from './components/ToggleButton';
import './styles.css';

window.addEventListener('load', () => {
  const chartToggler = document.getElementById('chart-toggler');
  const buttonChart1 = new Button({
    owner: chartToggler,
    text: 'Joined',
    colorIcon: '#4CAF50',
    value: true,
    onChange: value => console.log('@onChange', value),
  });
  const buttonChart2 = new Button({
    owner: chartToggler,
    text: 'Left',
    colorIcon: '#F44336',
    value: true,
    onChange: value => console.log('@onChange', value),
  });
});

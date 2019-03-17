// @flow

/* global documen */

import Chart from './components/Chart';
import createElement from './core/create-element';
import ToggleButton from './components/ToggleButton';
import './styles.css';

import chartData from './data/chart_data.json';

const textToggleTheme = value => value
  ? 'Switch to Day Mode'
  : 'Switch to Night Mode';

window.addEventListener('load', () => {
  const root = document.getElementById('root');
  const footer = createElement({ id: 'footer', owner: root });
  const toggleTheme = new ToggleButton({
    owner: footer,
    className: 'toggle-theme',
    text: textToggleTheme(),
    onChange: (value) => {
      const { firstElementChild } = document;

      toggleTheme.element.innerText = textToggleTheme(value);

      if (firstElementChild) {
        firstElementChild.setAttribute(
          'data-theme',
          value ? 'dark' : 'light',
        );
      }
    },
  });

  chartData.reverse().forEach((data) => {
    const chart = new Chart({
      owner: root,
      data,
    });
  });
});

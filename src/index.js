// @flow

/* global document */

import Chart from './components/Chart';
import createElement from './core/create-element';
import ToggleButton from './components/ToggleButton';
import createState from './core/create-state';
import getColorsByTheme from './core/colors/get-colors-by-theme';
import './styles.css';

import chartData from './data/chart_data.json';

const textToggleTheme = (value: string) => (
  value
    ? 'Switch to Day Mode'
    : 'Switch to Night Mode'
);

window.addEventListener('load', () => {
  const root = document.getElementById('root');
  const footer = createElement({ id: 'footer', owner: root });
  const theme = createState('light');
  const toggleTheme = new ToggleButton({
    owner: footer,
    className: 'toggle-theme',
    text: textToggleTheme(),
    onChange: (value) => {
      const { firstElementChild } = document;

      toggleTheme.element.innerText = textToggleTheme(value);

      if (firstElementChild) {
        const themeValue = value ? 'dark' : 'light';

        theme.setValue(themeValue);

        firstElementChild.setAttribute(
          'data-theme',
          themeValue,
        );
      }
    },
  });

  chartData.reverse().forEach((data) => {
    const chart = new Chart({
      colors: getColorsByTheme(theme.getValue()),
      owner: root,
      data,
    });

    theme.subscribe((prevValue, nextValue) => {
      chart.state.setValue({
        ...chart.state.getValue(),
        colors: getColorsByTheme(nextValue),
      });
    });
  });
});

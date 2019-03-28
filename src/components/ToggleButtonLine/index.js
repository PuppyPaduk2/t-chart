// @flow

import ToggleButton from '../ToggleButton';
import type { Props as ToggleButtonProps } from '../ToggleButton';
import './style.css';

const className = 'toggle-button-line';

type Props = ToggleButtonProps & {
  colorIcon?: string,
};

class ToggleButtonLine extends ToggleButton {
  constructor(props: Props) {
    super(props);

    const { colorIcon } = props;

    this.element.classList.add(className);

    this.setColorIcon(colorIcon);
  }

  setColorIcon(color: string = 'black') {
    this.element.style.cssText = `--bg-color-icon:${color}`;
  }
}

export default ToggleButtonLine;

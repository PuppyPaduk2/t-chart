// @flow

import createElement from '../../core/create-element';
import './styles.css';

export type Props = {
  owner: Object,
  value?: boolean,
  text?: string,
  onChange?: Function,
  className?: string,
};

class ToggleButton {
  props: Props
  element: Object
  value: boolean

  constructor(props: Props) {
    const {
      owner,
      value,
      text,
      className,
    } = props;

    this.props = props;
    this.element = createElement({
      listeners: { click: this.onClick },
      tagName: 'button',
      className: 'toggle-button',
      owner,
      text,
    });

    if (className) {
      this.element.className = `${this.element.className} ${className}`;
    }

    this.setValue(value);
  }

  setValue(value?: boolean = false) {
    if (this.value !== value) {
      this.value = value;
      this.element.dataset['value'] = value;
    }
  }

  onClick = () => {
    const { onChange } = this.props;

    this.element.dataset['click'] = undefined;

    setTimeout(() => {
      this.setValue(!this.value);
      this.element.dataset['click'] = 'true';

      if (onChange) {
        onChange(this.value);
      }
    }, 0);
  }
}

export default ToggleButton;

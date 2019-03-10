// @flow

import './styles.css';

type Props = {
  owner: Object,
  value?: boolean,
  text?: string,
  colorIcon?: string,
  onChange?: Function,
};

class Button {
  props: Props
  element: Object
  value: boolean
  onClick: Function

  constructor(props: Props) {
    const {
      owner,
      value,
      text,
      colorIcon,
    } = props;

    this.props = props;

    this.element = document.createElement('button');
    this.onClick = this.onClick.bind(this);
    this.element.addEventListener('click', this.onClick);

    this.setText(text);
    this.setClassName();
    this.setColorIcon(colorIcon);
    this.setValue(value);

    owner.append(this.element);
  }

  setText(text: string = 'Button') {
    this.element.innerText = text;
  }

  setClassName(className: string = '') {
    this.element.className = [
      'toggle-button',
      ...className.split(' '),
    ].filter(Boolean).join(' ');
  }

  getClassName() {
    return this.element.className;
  }

  setColorIcon(color: string = 'black') {
    this.element.style.cssText = `--bg-color-icon:${color}`;
  }

  setValue(value: boolean = false) {
    if (this.value !== value) {
      this.value = value;
      this.element.dataset['value'] = value;
    }
  }

  onClick() {
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

export default Button;

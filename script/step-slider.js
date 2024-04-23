export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.render();
    this.sliderChangeClick();
    this.sliderChange();
  }

  render() {
    let slider = document.createElement('div');
    slider.innerHTML = `
      <div class="slider__thumb">
        <span class="slider__value">${this.value}</span>
      </div>
      <div class="slider__progress"></div>
      <div class="slider__steps">
      </div>
    `;
    slider.classList.add('slider');

    let sliderSteps = slider.querySelector('.slider__steps');
    for (let i = 0; i < this.steps; i++) {
      sliderSteps.innerHTML += '<span></span>';
    }

    sliderSteps.querySelector('span').classList.add('slider__step-active');

    let progress = slider.querySelector('.slider__progress');

    let thumb = slider.querySelector('.slider__thumb');

    this.thumb = thumb;
    this.progress = progress;
    this.elem = slider;
  }

  initialPosition() {
    let initialThumbPosition = ((this.elem.offsetWidth / this.elem.offsetWidth) / (this.steps - 1)) * this.value * 100;
    this.progress.style.width = `${initialThumbPosition}%`;
    this.thumb.style.left = `${initialThumbPosition}%`;
  }

  fixedPosition(event) {
    let left = event.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;
    if (leftRelative < 0) {
      leftRelative = 0;
    }
    if (leftRelative > 1) {
      leftRelative = 1;
    }
    let segments = this.steps - 1;
    let approximateValue = leftRelative * segments;
    this.value = Math.round(approximateValue);
    let valuePercents = this.value / segments * 100;

    this.thumb.style.left = `${valuePercents}%`;

    this.progress.style.width = `${valuePercents}%`;
  }

  setSliderValue() {
    this.elem.querySelector('.slider__value').innerHTML = `${this.value}`;

    this.elem.querySelector('.slider__step-active').classList.remove('slider__step-active');
    let steps = this.elem.querySelectorAll('.slider__steps span');
    steps[this.value].classList.add('slider__step-active');
  }

  sliderChangeCustomEvent() {
    let sliderChangeCustom = new CustomEvent('slider-change', {
      detail: this.value,
      bubbles: true
    });
    this.elem.dispatchEvent(sliderChangeCustom);
  }

  sliderChangeClick() {
    let changeSlideClick = (event) => {
      this.fixedPosition(event);

      this.setSliderValue();

      this.sliderChangeCustomEvent();
    };

    this.elem.addEventListener('click', changeSlideClick);
  }

  sliderChange() {
    // Отмена действий по умолчанию
    this.thumb.ondragstart = () => false;
    this.thumb.onpointerdown = (event) => event.preventDefault();
    document.onpointermove = (event) => event.preventDefault();

    let changeSlide = () => {
      // Происходит при нажатии на ползунок
      let onPointerMove = (event) => {
        // Начало перемещения
        document.querySelector('.slider').classList.add('slider_dragging');

        // Получение относительных координат
        let left = event.clientX - this.elem.getBoundingClientRect().left;
        let leftRelative = left / this.elem.offsetWidth;
        if (leftRelative < 0) {
          leftRelative = 0;
        }
        if (leftRelative > 1) {
          leftRelative = 1;
        }
        let leftPercents = leftRelative * 100;
        let segments = this.steps - 1;
        let approximateValue = leftRelative * segments;
        this.value = Math.round(approximateValue);

        // Закрашивание области до ползунка
        this.progress.style.width = `${leftPercents}%`;

        // Динамическое изменение значения слайдера
        this.thumb.style.left = `${leftPercents}%`;

        this.setSliderValue();
      }

      document.addEventListener('pointermove', onPointerMove);

      // Окончание перемещения, фиксация результата
      document.onpointerup = (event) => {
        document.removeEventListener('pointermove', onPointerMove);

        document.querySelector('.slider').classList.remove('slider_dragging');

        this.fixedPosition(event);

        this.sliderChangeCustomEvent();

        document.onpointerup = null;
      };
    }

    this.thumb.addEventListener('pointerdown', changeSlide);
  };
}


import createElement from './create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.render();
    this.initCarousel();
  }

  render() {
    let carousel = createElement(`
      <div class="carousel">
        <div class="carousel__arrow carousel__arrow_right">
          <img src="../img/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left">
          <img src="../img/icons/angle-left-icon.svg" alt="icon">
        </div>
        <div class="carousel__inner">
        </div>
      </div>
    `);

    carousel.querySelector('.carousel__inner').innerHTML = this.slides
      .map(({name, price, image, id}) => `
        <div class="carousel__slide" data-id="${id}">
          <img src="../img/carousel/${image}" class="carousel__img" alt="slide">
          <div class="carousel__caption">
            <span class="carousel__price">€${price.toFixed(2)}</span>
            <div class="carousel__title">${name}</div>
            <button type="button" class="carousel__button">
              <img src="../img/icons/plus-icon.svg" alt="icon">
            </button>
          </div>
        </div>
      `)
      .join('');

    this.elem = carousel;
  }

  initCarousel() {
    let carouselInner = this.elem.querySelector('.carousel__inner');
    let carouselArrowRight = this.elem.querySelector('.carousel__arrow_right');
    let carouselArrowLeft = this.elem.querySelector('.carousel__arrow_left');
    let slidesNumber = this.slides.length;
    let carouselWidth;
    let counter = 0;

    carouselArrowLeft.style.display = 'none';

    carouselArrowRight.addEventListener('click', carouselRightClick);
    carouselArrowLeft.addEventListener('click', carouselLeftClick);
    carouselInner.addEventListener('click', (event) => {
      let btn = event.target.closest('.carousel__button');
      if (btn) {
        let uniqueId = event.target.closest('.carousel__slide').dataset.id;
        let productAdd = new CustomEvent('product-add', {
          detail: uniqueId,
          bubbles: true
        });
        this.elem.dispatchEvent(productAdd);
      }
    });

    function carouselRightClick() {
      carouselWidth = carouselInner.offsetWidth;
      counter++;
      changeSlide();
    }

    function carouselLeftClick() {
      carouselWidth = carouselInner.offsetWidth;
      counter--;
      changeSlide();
    }

    function changeSlide() {
      carouselInner.style.transform = `translateX(${-carouselWidth * counter}px)`;

      if (counter === 0) {
        carouselArrowLeft.style.display = 'none';
      } else {
        carouselArrowLeft.style.display = '';
      }

      if (counter === slidesNumber - 1) {
        carouselArrowRight.style.display = 'none';
      } else {
        carouselArrowRight.style.display = '';
      }
    }
  }
}

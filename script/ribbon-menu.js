import createElement from './create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.render();
    this.scroll();
    this.select();
  }

  render() {
    let ribbonMenu = createElement(`
      <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left">
          <img src="../img/icons/angle-icon.svg" alt="icon">
        </button>
        <nav class="ribbon__inner">
        </nav>
        <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
          <img src="../img/icons/angle-icon.svg" alt="icon">
        </button>
      </div>
    `);

    ribbonMenu.querySelector('.ribbon__inner').innerHTML = this.categories
      .map(({id, name}) => `
        <a href="#" class="ribbon__item" data-id="${id}">${name}</a>
      `)
      .join('');

    ribbonMenu.querySelector('.ribbon__item').classList.add('ribbon__item_active');

    this.elem = ribbonMenu;
  }

  scroll() {
    let ribbonInner = this.elem.querySelector('.ribbon__inner');
    let ribbonArrowRight = this.elem.querySelector('.ribbon__arrow_right');
    let ribbonArrowLeft = this.elem.querySelector('.ribbon__arrow_left');

    ribbonArrowRight.addEventListener('click', ribbonRightClick);
    ribbonArrowLeft.addEventListener('click', ribbonLeftClick);
    ribbonInner.addEventListener('scroll', ribbonHideBtns);

    function ribbonRightClick() {
      ribbonInner.scrollBy(350, 0);
    }

    function ribbonLeftClick() {
      ribbonInner.scrollBy(-350, 0);
    }

    function ribbonHideBtns() {
      let scrollLeft = ribbonInner.scrollLeft;
      let scrollWidth = ribbonInner.scrollWidth;
      let clientWidth = ribbonInner.clientWidth;
      let scrollRight = scrollWidth - scrollLeft - clientWidth;

      if (scrollLeft === 0) {
        ribbonArrowLeft.classList.remove('ribbon__arrow_visible');
      } else {
        ribbonArrowLeft.classList.add('ribbon__arrow_visible');
      }

      if (scrollRight < 1) {
        ribbonArrowRight.classList.remove('ribbon__arrow_visible');
      } else {
        ribbonArrowRight.classList.add('ribbon__arrow_visible');
      }
    }
  }

  select() {
    let ribbonInner = this.elem.querySelector('.ribbon__inner');

    let selectCategory = (event) => {
      event.preventDefault();

      ribbonInner.querySelector('.ribbon__item_active').classList.remove('ribbon__item_active');
      let item = event.target.closest('.ribbon__item');
      item.classList.add('ribbon__item_active');

      let ribbonSelect = new CustomEvent('ribbon-select', {
        detail: item.dataset.id,
        bubbles: true
      });
      this.elem.dispatchEvent(ribbonSelect);
    }

    ribbonInner.addEventListener('click', selectCategory);
  }
}

import createElement from './create-element.js';

export default class ProductCard {
  constructor(product) {
    this.product = product;
    this.render();
    this.addEventListeners();
  }

  render() {
    let card = createElement(`
      <div class="card">
        <div class="card__top">
          <img src="../img/products/${this.product.image}" class="card__image" alt="product">
          <span class="card__price">€${this.product.price.toFixed(2)}</span>
        </div>
        <div class="card__body">
          <div class="card__title">${this.product.name}</div>
          <button type="button" class="card__button">
            <img src="../img/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `);

    this.elem = card;
  }

  addEventListeners() {
    let cardBtn = this.elem.querySelector('.card__button');

    cardBtn.addEventListener('click', () => {
      let productAdd = new CustomEvent('product-add', {
        detail: this.product.id,
        bubbles: true
      });
      this.elem.dispatchEvent(productAdd);
    });
  }
}

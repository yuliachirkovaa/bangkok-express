import createElement from './create-element.js';
import escapeHtml from './escape-html.js';

import Modal from './modal.js';

export default class Cart {
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    let cartItem;

    if (product === undefined || product === null) {
      return;
    } else {
      let counter = 0;
      for (let item of this.cartItems) {
        if (item.product.id === product.id) {
          counter++;
          item.count++;
          cartItem = item;
        }
      }

      if (counter === 0) {
        cartItem = {product: product, count: 1};
        this.cartItems.push(cartItem);
      }
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItem;

    for (let item of this.cartItems) {
      if (item.product.id === productId) {
        if (amount === 1) {
          item.count++;
        } else if (amount === -1) {
          item.count--;
        }

        if (item.count === 0) {
          let index = this.cartItems.indexOf(item);
          this.cartItems.splice(index, 1);
        }

        cartItem = item;
      }
    }

    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    if (this.cartItems.length === 0) {
      return(true);
    } else {
      return(false);
    }
  }

  getTotalCount() {
    let totalCount = 0;
    for (let item of this.cartItems) {
      totalCount += item.count;
    }
    return(totalCount);
  }

  getTotalPrice() {
    let totalPrice = 0;
    for (let item of this.cartItems) {
      totalPrice += item.product.price * item.count;
    }
    return(totalPrice);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="../img/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="../img/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="../img/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    let cartModal = new Modal();
    cartModal.open();
    cartModal.setTitle("Your order");

    let cartModalBody = createElement(`
      <div>
      </div>
    `);

    for (let item of this.cartItems) {
      cartModalBody.append(this.renderProduct(item.product, item.count));
    }

    cartModalBody.append(this.renderOrderForm());

    cartModal.setBody(cartModalBody);

    this.modal = cartModal;
    this.modalBody = cartModalBody;

    document.querySelector('.modal__body').addEventListener('click', (event) => {
      let btnAdd = event.target.closest('.cart-counter__button');

      if (!btnAdd) {
        return;
      }

      let btnPlus = event.target.closest('.cart-counter__button_plus');
      let btnMinus = event.target.closest('.cart-counter__button_minus');
      let productId = event.target.closest('.cart-product').getAttribute('data-product-id');

      if (btnPlus) {
        this.updateProductCount(productId, 1);
      } else if (btnMinus) {
        this.updateProductCount(productId, -1);
      }
    });

    document.querySelector('.cart-form').addEventListener('submit', (event) => {
      this.onSubmit(event);
    });
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if (document.body.classList.contains('is-modal-open')) {
      if (this.isEmpty()) {
        this.modal.close();
      } else {
        let productId = cartItem.product.id;
        let productCount = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
        let productPrice = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
        let newPrice = cartItem.product.price * cartItem.count;
        let infoPrice = this.modalBody.querySelector(`.cart-buttons__info-price`);

        if (cartItem.count === 0) {
          this.modalBody.querySelector(`[data-product-id="${productId}"]`).remove();
        }

        productCount.innerHTML = `${cartItem.count}`;
        productPrice.innerHTML = `€${newPrice.toFixed(2)}`;
        infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

        this.modal.setBody(this.modalBody);

        document.querySelector('.cart-form').addEventListener('submit', (event) => {
          this.onSubmit(event);
        });
      }
    }
  }

  onSubmit(event) {
    event.preventDefault();

    this.modalBody.querySelector(`[type="submit"]`).classList.add('is-loading');

    let sendDatForm = document.querySelector('.cart-form');
    let fd = new FormData(sendDatForm);

    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: fd
    })
    .then(() => {
      this.modal.setTitle('Success!');
      this.cartItems.splice(0, this.cartItems.length);
      this.cartIcon.update(this);
      this.modal.setBody(createElement(`
        <div class="modal__body-inner">
          <p>
            Order successful! Your order is being cooked :) <br>
            We’ll notify you about delivery time shortly.<br>
            <img src="../img/delivery.gif">
          </p>
        </div>
      `));
    });
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}


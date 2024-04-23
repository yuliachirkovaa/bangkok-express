import Carousel from './carousel.js';
import slides from './slides.js';

import RibbonMenu from './ribbon-menu.js';
import categories from './categories.js';

import StepSlider from './step-slider.js';
import ProductsGrid from './products-grid.js';
import products from './products.js';

import CartIcon from './cart-icon.js';
import Cart from './cart.js';

export default class Main {

  constructor() {
  }

  render() {
    // Базовые компоненты
    let carousel = new Carousel(slides);
    document.querySelector('[data-carousel-holder]').append(carousel.elem);

    let ribbonMenu = new RibbonMenu(categories);
    document.querySelector('[data-ribbon-holder]').append(ribbonMenu.elem);

    let stepSlider = new StepSlider({steps: 5, value: 3});
    document.querySelector('[data-slider-holder]').append(stepSlider.elem);
    stepSlider.initialPosition();

    let cartIcon = new CartIcon();
    document.querySelector('[data-cart-icon-holder]').append(cartIcon.elem);

    let cart = new Cart(cartIcon);

    // Список товаров
    let productsGrid = new ProductsGrid(products);
    let productsGridHolder = document.querySelector('[data-products-grid-holder]');
    productsGridHolder.innerHTML = '';
    productsGridHolder.append(productsGrid.elem);

    // Начальная фильтрация товаров
    productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: stepSlider.value,
      category: ribbonMenu.value
    });

    // События
    document.body.addEventListener('product-add', (event) => {
      for (let product of products) {
        if (product.id === event.detail) {
          cart.addProduct(product);
        }
      }
    });

    document.body.addEventListener('slider-change', (event) => {
      productsGrid.updateFilter({
        maxSpiciness: event.detail
      });
    });

    document.body.addEventListener('ribbon-select', (event) => {
      productsGrid.updateFilter({
        category: event.detail
      });
    });

    document.querySelector('#nuts-checkbox').addEventListener('change', (event) => {
      productsGrid.updateFilter({
        noNuts: event.target.checked
      });
    });

    document.querySelector('#vegeterian-checkbox').addEventListener('change', (event) => {
      productsGrid.updateFilter({
        vegeterianOnly: event.target.checked
      });
    });
  }
}

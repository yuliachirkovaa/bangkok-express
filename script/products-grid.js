import createElement from './create-element.js';
import ProductCard from './product-card.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.productsFiltered = [];
    this.filters = {};
    this.render();
    this.gridFiller(this.products);
  }

  render() {
    let productsGrid = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>
    `)

    this.elem = productsGrid;
  }

  gridFiller(products) {
    for (let product of products) {
      let productCard = new ProductCard(product);
      this.elem.querySelector('.products-grid__inner').append(productCard.elem);
    }
  }

  updateFilter(filters) {
    // Проверяем фильтры и записываем свойства в объект фильтров
    if (filters.noNuts === true) {
      this.filters.noNuts = true;
    } else if (filters.noNuts === false) {
      delete this.filters.noNuts;
    }

    if (filters.vegeterianOnly === true) {
      this.filters.vegetarianOnly = true;
    } else if (filters.vegeterianOnly === false) {
      delete this.filters.vegetarianOnly;
    }

    if (filters.maxSpiciness === 4) {
      delete this.filters.maxSpiciness;
    } else if (filters.maxSpiciness) {
      this.filters.maxSpiciness = filters.maxSpiciness;
    }

    if (filters.category === '') {
      delete this.filters.category;
    } else if (filters.category) {
      this.filters.category = filters.category;
    }

    // Копируем полный список продуктов в массив отфильтрованных продуктов
    this.productsFiltered = this.products;

    // Проходимся по именам свойств объекта фильтров, обновляем массив отфильтрованных продуктов
    for (let key in this.filters) {
      if (key === 'noNuts') {
        this.productsFiltered = this.productsFiltered.filter(product => product.nuts === false || !product.hasOwnProperty('nuts'));
      }
      if (key === 'vegetarianOnly') {
        this.productsFiltered = this.productsFiltered.filter(product => product.vegeterian === true);
      }
      if (key === 'maxSpiciness') {
        this.productsFiltered = this.productsFiltered.filter(product => product.spiciness <= this.filters.maxSpiciness);
      }
      if (key === 'category') {
        this.productsFiltered = this.productsFiltered.filter(product => product.category === this.filters.category);
      }
    }

    // Отрисовываем только отфильтрованные продукты
    this.elem.querySelector('.products-grid__inner').innerHTML = '';
    this.gridFiller(this.productsFiltered);
  }
}

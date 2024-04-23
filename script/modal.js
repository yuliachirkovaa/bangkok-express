import createElement from './create-element.js';

export default class Modal {
  constructor() {
    this.render();

    this.elem.addEventListener('click', this.onClick);
  }

  render() {
    this.elem = createElement(`
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="../img/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title"></h3>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>
    `);
  }


  open() {
    document.body.append(this.elem);
    document.body.classList.add('is-modal-open');
    document.addEventListener('keydown', this.onKeyDown);
  }

  onClick = (event) => {
    if (event.target.closest('.modal__close')) {
      event.preventDefault();
      this.close();
    }
  };

  onKeyDown = (event) => {
    if (event.code === 'Escape') {
      event.preventDefault();
      this.close();
    }
  };

  setTitle(title) {
    this.elem.querySelector('.modal__title').textContent = title;
  }

  setBody(node) {
    this.elem.querySelector('.modal__body').innerHTML = '';
    this.elem.querySelector('.modal__body').append(node);
  }

  close() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.body.classList.remove('is-modal-open');
    this.elem.remove();
  }
}


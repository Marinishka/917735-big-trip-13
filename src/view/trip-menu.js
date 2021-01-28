import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createTripMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
  <h2 class="visually-hidden">Switch trip view</h2>
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item=${MenuItem.TABLE}>${MenuItem.TABLE}</a>
    <a class="trip-tabs__btn" href="#" data-menu-item=${MenuItem.STATS}>${MenuItem.STATS}</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }
  getTemplate() {
    return createTripMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }
    this.setMenuItem(evt.target.dataset.menuItem);
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);
    const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    if (item !== null) {
      items.forEach((someItem) => {
        if (someItem === item) {
          item.classList.add(`trip-tabs__btn--active`);
        } else {
          someItem.classList.remove(`trip-tabs__btn--active`);
        }
      });
    }
  }
}

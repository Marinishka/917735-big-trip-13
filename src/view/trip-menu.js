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
    this._callback.menuClick(evt.target.textContent);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}

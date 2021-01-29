import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createTripBtnNewPoint = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" data-menu-item=${MenuItem.ADD_NEW_POINT}>New event</button>`;
};

export default class BtnNewPoint extends AbstractView {
  constructor() {
    super();
    this._btnClickHandler = this._btnClickHandler.bind(this);
  }

  getTemplate() {
    return createTripBtnNewPoint();
  }

  deactivateBtn() {
    if (!this.getElement().disabled === true) {
      this.getElement().disabled = true;
    }
  }

  activateBtn() {
    if (this.getElement().disabled === true) {
      this.getElement().disabled = false;
    }
  }

  _btnClickHandler(evt) {
    evt.preventDefault();
    this._callback.btnClick(evt.target.dataset.menuItem);
  }

  setBtnClickHanler(callback) {
    this._callback.btnClick = callback;
    this.getElement().addEventListener(`click`, this._btnClickHandler);
  }
}


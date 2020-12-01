import {createElement} from '../utils.js';

const tripEventsItemTemplate = () => {
  return `<li class="trip-events__item"></li>`;
};

export default class EventsItem {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return tripEventsItemTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

import {createElement} from '../utils.js';

const tripEventsDetailsTemplate = () => {
  return `<section class="event__details"></section>`;
};

export default class EventsDetails {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return tripEventsDetailsTemplate();
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

import AbstractView from './abstract.js';

const createTripBtnNewPoint = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
};

export default class BtnNewPoint extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createTripBtnNewPoint();
  }
}


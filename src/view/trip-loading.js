import AbstractView from './abstract.js';

const createTripLoading = () => {
  return `<p class="trip-events__msg">Loading...</p>`;
};

export default class Loaing extends AbstractView {
  getTemplate() {
    return createTripLoading();
  }
}

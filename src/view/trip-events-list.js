import AbstractView from './abstract.js';

const createTripEventsListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class EventsList extends AbstractView {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}

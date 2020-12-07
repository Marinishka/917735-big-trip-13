import AbstractView from './abstract.js';

const tripEventsItemTemplate = () => {
  return `<li class="trip-events__item"></li>`;
};

export default class EventsItem extends AbstractView {
  getTemplate() {
    return tripEventsItemTemplate();
  }
}

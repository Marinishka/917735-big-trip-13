import AbstractView from './abstract.js';

const tripEventsDetailsTemplate = () => {
  return `<section class="event__details"></section>`;
};

export default class EventsDetails extends AbstractView {
  getTemplate() {
    return tripEventsDetailsTemplate();
  }
}

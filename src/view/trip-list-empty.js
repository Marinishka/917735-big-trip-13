import AbstractView from './abstract.js';

const tripListEmptyTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class EmptyList extends AbstractView {

  getTemplate() {
    return tripListEmptyTemplate();
  }
}

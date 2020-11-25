import {createTripInfoTemlate} from './view/trip-info.js';
import {createTripMenuTemplate} from './view/trip-menu.js';
import {createTripFiltersTemplate} from './view/trip-filters.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createTripEventsListTemplate} from './view/trip-events-list.js';
import {createTripNewPointTemplate} from './view/trip-new-point.js';
import {createTripNewPointDestinationTemplate} from './view/trip-new-point-destination.js';
import {createTripNewPointOffersTemplate} from './view/trip-new-point-offers.js';
import {createTripPointTemplate} from './view/trip-point.js';
import {generatePoint} from './mock/point.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeader = document.querySelector(`.page-header`);
const tripMainElement = pageHeader.querySelector(`.trip-main`);
const tripControlsElement = pageHeader.querySelector(`.trip-controls`);

render(tripMainElement, createTripInfoTemlate(), `afterbegin`);
render(tripControlsElement, createTripMenuTemplate(), `beforeend`);
render(tripControlsElement, createTripFiltersTemplate(), `beforeend`);

const pageMain = document.querySelector(`.page-main`);
const tripEventsElement = pageMain.querySelector(`.trip-events`);
render(tripEventsElement, createTripSortTemplate(), `beforeend`);
render(tripEventsElement, createTripEventsListTemplate(), `beforeend`);

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const tripEventsListElement = tripEventsElement.querySelector(`.trip-events__list`);
render(tripEventsListElement, createTripNewPointTemplate(points[0]), `beforeend`);

const tripEventsDetailsElement = tripEventsListElement.querySelector(`.event__details`);

const renderOffersTemplate = (point) => {
  return point.type.offers === null ? `` : render(tripEventsDetailsElement, createTripNewPointOffersTemplate(points[0]), `beforeend`);
};
renderOffersTemplate(points[0]);

const renderDestination = (point) => {
  return point.destination === null ? `` : render(tripEventsDetailsElement, createTripNewPointDestinationTemplate(point), `beforeend`);
};
renderDestination(points[0]);

for (let i = 1; i < POINT_COUNT; i++) {
  render(tripEventsListElement, createTripPointTemplate(points[i]), `beforeend`);
}

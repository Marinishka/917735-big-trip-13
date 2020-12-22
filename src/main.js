import MenuView from './view/trip-menu.js';
import FiltersView from './view/trip-filters.js';
import {generatePoint} from './mock/point.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/Trip.js';

const pageHeader = document.querySelector(`.page-header`);
const tripMainElement = pageHeader.querySelector(`.trip-main`);
const tripControlsElement = pageHeader.querySelector(`.trip-controls`);

render(tripControlsElement, new MenuView(), RenderPosition.BEFOREEND);
render(tripControlsElement, new FiltersView(), RenderPosition.BEFOREEND);

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);
const pageMain = document.querySelector(`.page-main`);
const tripEventsElement = pageMain.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripEventsElement, tripMainElement);
tripPresenter.init(points);

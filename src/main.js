import MenuView from './view/trip-menu.js';
import {generatePoint, generateTypes, generateCities} from './mock/point.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/Trip.js';
import FilterPresenter from './presenter/Filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import Api from './api.js';
import { UpdateType } from './const.js';

const AUTHORIZATION = `Basic jtw58wghs85o4isetg8`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const api = new Api(END_POINT, AUTHORIZATION);

const pageHeader = document.querySelector(`.page-header`);
const tripMainElement = pageHeader.querySelector(`.trip-main`);
const tripControlsElement = pageHeader.querySelector(`.trip-controls`);

render(tripControlsElement, new MenuView(), RenderPosition.BEFOREEND);

// const POINT_COUNT = 20;
const types = generateTypes();
const accessibleСities = generateCities();
// const points = new Array(POINT_COUNT).fill({types, accessibleСities}).map(generatePoint);
const pageMain = document.querySelector(`.page-main`);
const tripEventsElement = pageMain.querySelector(`.trip-events`);

const pointsModel = new PointsModel();
// pointsModel.setPoints(points);
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(tripEventsElement, tripMainElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, pointsModel);
filterPresenter.init();
tripPresenter.init();
document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint(types, accessibleСities);
});

api.getPoints()
.then((points) => {
  pointsModel.setPoints(UpdateType.INIT, points);
});
// .catch((points) => {
//   pointsModel.setPoints(UpdateType.INIT, points); //заменить на пустой массив
// });

import MenuView from './view/trip-menu.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/Trip.js';
import FilterPresenter from './presenter/Filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import Api from './api.js';
import {UpdateType} from './const.js';

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const api = new Api(END_POINT, AUTHORIZATION);

const pageHeader = document.querySelector(`.page-header`);
const tripMainElement = pageHeader.querySelector(`.trip-main`);
const tripControlsElement = pageHeader.querySelector(`.trip-controls`);

const menuComponent = new MenuView();

render(tripControlsElement, menuComponent, RenderPosition.BEFOREEND);

const pageMain = document.querySelector(`.page-main`);
const tripEventsElement = pageMain.querySelector(`.trip-events`);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(tripEventsElement, tripMainElement, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, pointsModel);
filterPresenter.init();
tripPresenter.init();
api.getData()
.then((data) => {
  pointsModel.setData(UpdateType.INIT, data);
})
.catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
});

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

import MenuView from './view/trip-menu.js';
import BtnNewPoint from './view/trip-btn-new-point.js';
import StatsView from './view/trip-stats.js';
import {render, RenderPosition, remove} from './utils/render.js';
import TripPresenter from './presenter/Trip.js';
import FilterPresenter from './presenter/Filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import Api from './api.js';
import {UpdateType, FilterType, MenuItem} from './const.js';

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const api = new Api(END_POINT, AUTHORIZATION);

const pageHeader = document.querySelector(`.page-header`);
const tripMainElement = pageHeader.querySelector(`.trip-main`);
const tripControlsElement = pageHeader.querySelector(`.trip-controls`);

const menuComponent = new MenuView();
const btnNewPointComponent = new BtnNewPoint();

render(tripControlsElement, menuComponent, RenderPosition.BEFOREEND);
render(tripMainElement, btnNewPointComponent, RenderPosition.BEFOREEND);

const pageMain = document.querySelector(`.page-main`);
const pageMainBodyContainer = pageMain.querySelector(`.page-body__container`);
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
  pointsModel.setData(UpdateType.INIT, []);
});

const handlePointNewFormClose = () => {
  btnNewPointComponent.activateBtn();
};

let statsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      remove(statsComponent);
      tripPresenter.destroy();
      filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init({renderInfo: false});
      tripPresenter.createPoint(handlePointNewFormClose);
      menuComponent.setMenuItem(MenuItem.TABLE);
      btnNewPointComponent.deactivateBtn();
      break;
    case MenuItem.TABLE:
      remove(statsComponent);
      tripPresenter.init({renderInfo: false});
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statsComponent = new StatsView(pointsModel.getPoints());
      render(pageMainBodyContainer, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);
btnNewPointComponent.setBtnClickHanler(handleSiteMenuClick);

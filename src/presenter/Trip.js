import InfoView from '../view/trip-info.js';
import BtnNewPointView from '../view/trip-btn-new-point.js';
import ListEmptyView from '../view/trip-list-empty';
import EventsItemView from '../view/trip-events-item.js';
import SortView from '../view/trip-sort.js';
import EventsListView from '../view/trip-events-list.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import PointPresenter from '../presenter/Point.js';
import PointNewPresenter from '../presenter/PointNew.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {sortPointDate, sortPointPrice, sortPointTime} from '../utils/point.js';
import {filter} from '../utils/filter.js';

export default class Trip {
  constructor(eventsContainer, infoContainer, pointsModel, filterModel) {
    this._eventsContainer = eventsContainer;
    this._infoContainer = infoContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._listEmptyComponent = null;
    this._sortComponent = null;
    this._infoComponent = null;
    this._btnNewPointComponent = null;
    this._eventsListComponent = new EventsListView();
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._eventsListComponent, this._handleViewAction);
    this._renderBtnNewPoint();
  }

  init() {
    this._renderTrip();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);
    switch (this._currentSortType) {
      case SortType.DAY:
        return filtredPoints.sort(sortPointDate);
      case SortType.TIME:
        return filtredPoints.sort(sortPointTime);
      case SortType.PRICE:
        return filtredPoints.sort(sortPointPrice);
    }

    return filtredPoints;
  }

  createPoint(types, accessibleСities) {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(types, accessibleСities);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearTripList();
    this._renderTripList();
  }

  _renderListEmpty() {
    if (this._listEmptyComponent !== null) {
      this._listEmptyComponent = null;
    }
    this._listEmptyComponent = new ListEmptyView();
    render(this._eventsContainer, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _renderInfo() {
    if (this._infoComponent !== null) {
      this._infoComponent = null;
    }
    this._infoComponent = new InfoView(this._getPoints());
    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderBtnNewPoint() {
    if (this._btnNewPointComponent !== null) {
      this._btnNewPointComponent = null;
    }
    this._btnNewPointComponent = new BtnNewPointView();
    render(this._infoContainer, this._btnNewPointComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._eventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEventsList() {
    render(this._eventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderEventsItem() {
    render(this._eventsListComponent, this._eventsItemComponent, RenderPosition.BEFOREEND);
  }

  _clearTripList() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    this._pointNewPresenter.destroy();
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true, resetListEmpty: true});
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderTripList() {
    const pointsCount = this._getPoints().length;
    const points = this._getPoints().slice();
    for (let i = 0; i < pointsCount; i++) {
      this._eventsItemComponent = new EventsItemView();
      this._renderEventsItem();
      const pointPresenter = new PointPresenter(this._eventsItemComponent, this._handleViewAction, this._handleModeChange);
      pointPresenter.init(points[i]);
      this._pointPresenter[points[i].id] = pointPresenter;
    }
  }

  _clearTrip({resetSortType = false, resetListEmpty = false} = {}) {
    this._pointNewPresenter.destroy();
    Object
    .values(this._pointPresenter)
    .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._infoComponent);
    remove(this._sortComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }

    if (resetListEmpty) {
      remove(this._listEmptyComponent);
    }
  }

  _renderTrip() {
    const amountOfPoints = this._getPoints().length;
    if (amountOfPoints === 0) {
      this._renderListEmpty();
    } else {

      this._renderInfo();

      this._renderSort();

      this._renderEventsList();

      this._renderTripList();
    }
  }
}

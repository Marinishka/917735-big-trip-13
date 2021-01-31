import InfoView from '../view/trip-info.js';
import ListEmptyView from '../view/trip-list-empty';
import EventsItemView from '../view/trip-events-item.js';
import SortView from '../view/trip-sort.js';
import EventsListView from '../view/trip-events-list.js';
import LoadingView from '../view/trip-loading.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import PointPresenter, {State as PointPresenterViewState} from '../presenter/Point.js';
import PointNewPresenter from '../presenter/PointNew.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import {sortPointDate, sortPointPrice, sortPointTime} from '../utils/point.js';
import {filter} from '../utils/filter.js';
import {FilterType} from '../const.js';

export default class Trip {
  constructor(eventsContainer, infoContainer, pointsModel, filterModel, api) {
    this._eventsContainer = eventsContainer;
    this._infoContainer = infoContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._api = api;
    this._listEmptyComponent = null;
    this._sortComponent = null;
    this._infoComponent = null;
    this._isLoading = true;
    this._eventsListComponent = new EventsListView();
    this._loadingComponent = new LoadingView();
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._eventsListComponent, this._handleViewAction);
  }

  init(renderInfo) {
    this._renderTrip(renderInfo);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearTrip({resetListEmpty: true, resetInfo: false});

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getPoints() {
    const filterType = this._filterModel.get();
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

  _getPointsSortDay() {
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[FilterType.EVERYTHING](points);
    return filtredPoints.sort(sortPointDate);
  }

  _getOffers() {
    return this._pointsModel.getOffers();
  }

  _getDestinations() {
    return this._pointsModel.getDestinations();
  }

  createPoint(callback) {
    const offers = this._getOffers();
    const destinations = this._getDestinations();
    this._currentSortType = SortType.DAY;
    this._pointNewPresenter.init(offers, destinations, callback);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearTrip({resetInfo: false});
    this._renderTrip({renderInfo: false});
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
    this._infoComponent = new InfoView(this._getPointsSortDay());
    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    render(this._eventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderLoading() {
    render(this._eventsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
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
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._pointNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
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
        this._clearTrip({resetSortType: true, resetInfo: false});
        this._renderTrip({renderInfo: false});
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true, resetListEmpty: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
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
    const offers = this._getOffers().slice();
    const destinations = this._getDestinations().slice();
    for (let i = 0; i < pointsCount; i++) {
      this._eventsItemComponent = new EventsItemView();
      this._renderEventsItem();
      const pointPresenter = new PointPresenter(this._eventsItemComponent, this._handleViewAction, this._handleModeChange);
      pointPresenter.init(points[i], offers, destinations);
      this._pointPresenter[points[i].id] = pointPresenter;
    }
  }

  _clearTrip({resetSortType = false, resetListEmpty = false, resetInfo = true} = {}) {
    this._pointNewPresenter.destroy();
    Object
    .values(this._pointPresenter)
    .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._loadingComponent);

    if (resetInfo) {
      remove(this._infoComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }

    if (resetListEmpty) {
      remove(this._listEmptyComponent);
    }
  }

  _renderTrip({renderInfo = true} = {}) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    const amountOfPoints = this._getPoints().length;
    if (amountOfPoints === 0) {
      this._renderListEmpty();
    } else {

      if (renderInfo) {
        this._renderInfo();
      }

      this._renderSort();

      this._renderEventsList();

      this._renderTripList();
    }
  }
}

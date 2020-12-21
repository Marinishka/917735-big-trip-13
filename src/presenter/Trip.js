import InfoView from '../view/trip-info.js';
import ListEmptyView from '../view/trip-list-empty';
import EventsItemView from '../view/trip-events-item.js';
import SortView from '../view/trip-sort.js';
import EventsListView from '../view/trip-events-list.js';
import {render, RenderPosition} from '../utils/render.js';
import PointPresenter from '../presenter/Point.js';
import {updateItem} from '../utils/common.js';

export default class Trip {
  constructor(eventsContainer, infoContainer) {
    this._eventsContainer = eventsContainer;
    this._infoContainer = infoContainer;
    this._listEmptyComponent = new ListEmptyView();
    this._sortComponent = new SortView();
    this._eventsListComponent = new EventsListView();
    this._pointPresenter = {};
    this._hundlePointChange = this._hundlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points;
    this._renderTrip();
  }

  _renderListEmpty() {
    render(this._eventsContainer, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _renderInfo() {
    this._infoComponent = new InfoView(this._points);
    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._eventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderEventsList() {
    render(this._eventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderEventsItem() {
    render(this._eventsListComponent, this._eventsItemComponent, RenderPosition.BEFOREEND);
  }

  _clearTripList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _hundlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderTrip() {
    if (this._amountOfPoints === 0) {
      this._renderListEmpty();
    } else {

      this._renderInfo();

      this._renderSort();

      this._renderEventsList();

      for (let i = 0; i < this._points.length; i++) {
        this._eventsItemComponent = new EventsItemView();
        this._renderEventsItem();
        const pointPresenter = new PointPresenter(this._eventsItemComponent, this._hundlePointChange, this._handleModeChange);
        pointPresenter.init(this._points[i]);
        this._pointPresenter[this._points[i].id] = pointPresenter;
      }
    }
  }
}

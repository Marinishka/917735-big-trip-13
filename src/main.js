import InfoView from './view/trip-info.js';
import MenuView from './view/trip-menu.js';
import FiltersView from './view/trip-filters.js';
import ListEmptyView from './view/trip-list-empty';
import EventsItemView from './view/trip-events-item.js';
import EventsDetailsView from './view/trip-events-details.js';
import SortView from './view/trip-sort.js';
import EventsListView from './view/trip-events-list.js';
import TripEditPointView from './view/trip-edit-point.js';
import TripEditPointDestinationView from './view/trip-edit-point-destination.js';
import TripEditPointOffersView from './view/trip-edit-point-offers.js';
import TripPointView from './view/trip-point.js';
import {generatePoint} from './mock/point.js';
import {render, RenderPosition, replace} from './utils/render.js';

const renderPoint = (eventsItem, point) => {
  const tripPointView = new TripPointView(point);
  const tripEditPointView = new TripEditPointView(point);

  const renderDetails = () => {
    if (point.destination === null && point.type.offers === null) {
      return;
    }

    const eventsDetails = new EventsDetailsView();
    render(tripEditPointView.getElement(), eventsDetails.getElement(), RenderPosition.BEFOREEND);

    const renderOffers = () => {
      return point.type.offers === null ? `` : render(eventsDetails.getElement(), new TripEditPointOffersView(point).getElement(), RenderPosition.BEFOREEND);
    };

    const renderDestination = () => {
      return point.destination === null ? `` : render(eventsDetails.getElement(), new TripEditPointDestinationView(point).getElement(), RenderPosition.BEFOREEND);
    };
    renderOffers();
    renderDestination();
  };

  renderDetails();

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replacePointToForm = () => {
    replace(tripEditPointView, tripPointView);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const replaceFormToPoint = () => {
    replace(tripPointView, tripEditPointView);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  tripPointView.setFormClick(() => {
    replacePointToForm();
  });

  tripEditPointView.setPointClick(() => {
    replaceFormToPoint();
  });

  tripEditPointView.setFormSubmitHandler(() => {
    replaceFormToPoint();
  });

  render(eventsItem, tripPointView.getElement(), RenderPosition.BEFOREEND);
};

const pageHeader = document.querySelector(`.page-header`);
const tripMainElement = pageHeader.querySelector(`.trip-main`);
const tripControlsElement = pageHeader.querySelector(`.trip-controls`);

render(tripControlsElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(tripControlsElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);
const pageMain = document.querySelector(`.page-main`);
const tripEventsElement = pageMain.querySelector(`.trip-events`);

if (POINT_COUNT === 0) {
  render(tripEventsElement, new ListEmptyView().getElement(), RenderPosition.BEFOREEND);
} else {
  render(tripMainElement, new InfoView().getElement(), RenderPosition.AFTERBEGIN);

  render(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);

  const eventsList = new EventsListView();
  render(tripEventsElement, eventsList.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < POINT_COUNT; i++) {
    const eventsItem = new EventsItemView();
    render(eventsList.getElement(), eventsItem.getElement(), RenderPosition.BEFOREEND);
    renderPoint(eventsItem.getElement(), points[i]);
  }
}

import TripEditPointView from '../view/trip-edit-point.js';
import TripEditPointDestinationView from '../view/trip-edit-point-destination.js';
import TripEditPointOffersView from '../view/trip-edit-point-offers.js';
import TripPointView from '../view/trip-point.js';
import EventsDetailsView from '../view/trip-events-details.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._hundleFavoriteClick = this._hundleFavoriteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(point) {
    this._point = point;
    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;
    this._pointComponent = new TripPointView(point);
    this._pointEditComponent = new TripEditPointView(point);
    this._eventsDetails = new EventsDetailsView();

    this._pointComponent.setFavoriteClick(() => {
      this._hundleFavoriteClick();
    });

    this._pointComponent.setFormClick(() => {
      this._replacePointToForm();
    });

    this._pointEditComponent.setPointClick(() => {
      this._replaceFormToPoint();
    });

    this._pointEditComponent.setFormSubmitHandler(() => {
      this._replaceFormToPoint();
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      this._renderPoint(point);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    if (this._pointContainer.getElement().contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._pointContainer.getElement().contains(prevPointEditComponent.getElement())) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  _renderPoint(point) {
    this._renderDetails(point);

    render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
  }

  _hundleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }

  _renderDetailsContainer() {
    render(this._pointEditComponent, this._eventsDetails, RenderPosition.BEFOREEND);
  }

  _renderDetails(point) {
    if (point.destination === null && point.type.offers === null) {
      return;
    }
    this._renderDetailsContainer();

    if (point.type.offers !== null) {
      this._renderOffers(point);
    }

    if (point.destination !== null) {
      this._renderDestination(point);
    }
  }

  _renderOffers(point) {
    render(this._eventsDetails, new TripEditPointOffersView(point), RenderPosition.BEFOREEND);
  }

  _renderDestination(point) {
    render(this._eventsDetails, new TripEditPointDestinationView(point), RenderPosition.BEFOREEND);
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

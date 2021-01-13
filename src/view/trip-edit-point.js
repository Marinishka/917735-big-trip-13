import dayjs from 'dayjs';
import SmartView from './smart.js';

const TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

const createTripPointOffersTemplate = (editPoint) => {
  const {activeOffers} = editPoint;

  const getIdActiveOffers = () => {
    let idActiveOffers = [];
    if (activeOffers === null) {
      return idActiveOffers;
    }
    for (let offer of activeOffers) {
      const {id} = offer;
      idActiveOffers.push(id);
    }
    return idActiveOffers;
  };

  const isOfferActive = (offers, offer) => {
    return offers.includes(offer);
  };

  const getOfferSelectors = (point) => {
    const idActiveOffers = getIdActiveOffers();
    const {type} = point;
    const {offers: typeOffers} = type;
    let offersList = ``;
    typeOffers.forEach(function (typeOffer) {
      const {id, title, price} = typeOffer;
      offersList += `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-${id}" data-offer-name = "${id}" ${isOfferActive(idActiveOffers, id) ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${id}-1">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
        </div>`;
    });
    return offersList;
  };

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
    <div class="event__available-offers">
      ${getOfferSelectors(editPoint)}
    </div>
  </section>`;
};

const createTripPointDestinationTemplate = (editPoint) => {
  const {destination} = editPoint;
  const {description, pictures} = destination;

  const getPhotosList = (somePhotos) => {
    let photoList = ``;
    somePhotos.forEach(function (photo) {
      photoList += `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
    });
    return photoList;
  };

  const getPhotosTemplate = () => {
    return pictures === null ? `` : `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${getPhotosList(pictures)}
    </div>
  </div>`;
  };

  const getDescriptionTemplate = () => {
    return description === null ? `` : `<p class="event__destination-description">${description}</p>`;
  };

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${getDescriptionTemplate()}
    ${getPhotosTemplate()}
  </section>`;
};

const isDestination = (point) => {
  return point.destination.pictures !== null || point.destination.description !== null;
};

const createTripEventsDetailsTemplate = (point) => {
  let eventsDetailsTemplate = ``;
  if (point.destination.pictures === null && point.destination.description === null && point.type.offers === null) {
    return eventsDetailsTemplate;
  }
  eventsDetailsTemplate = `<section class="event__details">${point.type.offers !== null ? createTripPointOffersTemplate(point) : ``}
  ${isDestination(point) ? createTripPointDestinationTemplate(point) : ``}</section>`;
  return eventsDetailsTemplate;
};

const isTypeChecked = (type, typeOfPoint) => {
  return type === typeOfPoint ? `checked` : ``;
};

const createTypeItem = (type, typeOfPoint) => {
  return `<div class="event__type-item">
  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isTypeChecked(type, typeOfPoint)}>
  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`;
};

const createTypeList = (types, typeOfPoint) => {
  let typeList = ``;
  types.forEach(function (someType) {
    typeList += createTypeItem(someType, typeOfPoint);
  });
  return `<div class="event__type-list">
  <fieldset class="event__type-group">
  <legend class="visually-hidden">Event type</legend>
  ${typeList}
  </fieldset>
  </div>`;
};

const createTripEditPointTemplate = (data) => {
  const eventDetailsTemplate = createTripEventsDetailsTemplate(data);

  const CITIES = [`Riga`, `Amsterdam`, `Berlin`, `Paris`, `Krakow`, `Hannover`];
  const generateOptions = (cities) => {
    let options = ``;
    cities.forEach(function (value) {
      options += `<option value="${value}"></option>`;
    });
    return options;
  };

  return `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${data.type.title}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
           ${createTypeList(TYPES, data.type.title)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${data.type.title}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${data.destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${generateOptions(CITIES)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(data.dateStart).format(`DD/MM/YY HH:mm`)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(data.dateFinish).format(`DD/MM/YY HH:mm`)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${data.price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
      </header>
      ${eventDetailsTemplate}
    </form>`;
};

export default class EditPoint extends SmartView {
  constructor(editPoint) {
    super();
    this._data = editPoint;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._setClickHandler = this._setClickHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._activeOffersChangeHandler = this._activeOffersChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  _setClickHandler() {
    this._callback.click();
  }

  getTemplate() {
    return createTripEditPointTemplate(this._data);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setPointClick(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._setClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._callback.click);
    this.getElement().addEventListener(`submit`, this._callback.formSubmit);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._cityChangeHandler);
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._typeChangeHandler);
    if (this.getElement().querySelector(`.event__available-offers`)) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._activeOffersChangeHandler);
    }
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._priceChangeHandler);
  }

  _cityChangeHandler(evt) {
    const newcity = this._data.accessibleСities.find((city) => city.name === evt.target.value);
    this.updateData({
      destination: newcity
    }, false);
  }

  _typeChangeHandler(evt) {
    const newType = this._data.types.find((type) => type.title === evt.target.value);
    this.updateData({
      type: newType,
      activeOffers: null
    }, false);
  }

  _activeOffersChangeHandler(evt) {
    let newActiveOffers = [];
    if (this._data.activeOffers === null) {
      newActiveOffers.push(this._data.type.offers.find((offer) => offer.id === evt.target.dataset.offerName));
    } else {
      newActiveOffers = this._data.activeOffers.slice();
      const isItOfferActive = this._data.activeOffers.find((offer) => offer.id === evt.target.dataset.offerName);
      if (!isItOfferActive) {
        newActiveOffers.push(this._data.type.offers.find((offer) => offer.id === evt.target.dataset.offerName));
      } else {
        newActiveOffers.splice(newActiveOffers.findIndex((offer) => offer.id === evt.target.dataset.offerName), 1);
        if (newActiveOffers.length === 0) {
          newActiveOffers = null;
        }
      }
    }
    this.updateData({
      activeOffers: newActiveOffers
    });
  }

  _priceChangeHandler(evt) {
    this.updateData({
      price: evt.target.value
    }, true);
  }
}

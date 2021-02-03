import dayjs from 'dayjs';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const isOfferActive = (offers, offer) => {
  return offers.some((offersItem) => offersItem.title === offer);
};

const getOfferSelectors = (point, offersOfType, isDisabled) => {
  const {activeOffers} = point;
  let id = ``;
  if (point.id) {
    id = point.id;
  } else {
    id = `new`;
  }
  let offersList = ``;
  offersOfType.forEach(function (typeOffer) {
    const {title, price} = typeOffer;
    offersList += `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-${offersOfType.indexOf(typeOffer)}" type="checkbox" name="event-offer-${id}-${offersOfType.indexOf(typeOffer)}" data-offer-index="${offersOfType.indexOf(typeOffer)}" ${isOfferActive(activeOffers, title) ? `checked` : ``}  ${isDisabled ? `disabled` : ``}>
      <label class="event__offer-label" for="event-offer-${id}-${offersOfType.indexOf(typeOffer)}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
      </div>`;
  });
  return offersList;
};

const createTripPointOffersTemplate = (editPoint, offersOfType, isDisabled) => {

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
    <div class="event__available-offers">
      ${getOfferSelectors(editPoint, offersOfType, isDisabled)}
    </div>
  </section>`;
};

const getPhotosList = (somePhotos) => {
  let photoList = ``;
  somePhotos.forEach(function (photo) {
    photoList += `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
  });
  return photoList;
};

const createTripPointDestinationTemplate = (editPoint) => {
  const {destination} = editPoint;
  const {description, pictures} = destination;

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
  return point.destination.pictures.length !== 0 || point.destination.description.length !== 0;
};

const getOffersOfType = (point, allOffers) => {
  const type = allOffers.filter((offersItem) => offersItem.type === point.type);
  return type[0].offers;
};

const createTripEventsDetailsTemplate = (point, offersOfType, isDisabled) => {
  let eventsDetailsTemplate = ``;
  if (point.destination.pictures.length === 0 && point.destination.description === `` && offersOfType.length === 0) {
    return eventsDetailsTemplate;
  }
  eventsDetailsTemplate = `<section class="event__details">${offersOfType.length !== 0 ? createTripPointOffersTemplate(point, offersOfType, isDisabled) : ``}
  ${isDestination(point) ? createTripPointDestinationTemplate(point) : ``}</section>`;
  return eventsDetailsTemplate;
};

const isTypeChecked = (type, typeOfPoint) => {
  return type === typeOfPoint ? `checked` : ``;
};

const createTypeItem = (type, typeOfPoint, isDisabled) => {
  return `<div class="event__type-item">
  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isTypeChecked(type, typeOfPoint)}  ${isDisabled ? `disabled` : ``}>
  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`;
};

const createTypeList = (allTypes, typeOfPoint, isDisabled) => {
  let typeList = ``;
  allTypes.forEach(function (someType) {
    typeList += createTypeItem(someType, typeOfPoint, isDisabled);
  });
  return `<div class="event__type-list">
  <fieldset class="event__type-group">
  <legend class="visually-hidden">Event type</legend>
  ${typeList}
  </fieldset>
  </div>`;
};

const getCities = (destinations) => {
  return destinations.map((destinationOfPoint) => destinationOfPoint.name);
};

const generateOptions = (cities) => {
  let options = ``;
  cities.forEach(function (value) {
    options += `<option value="${value}"></option>`;
  });
  return options;
};

const getTypes = (offers) => {
  return offers.map((offer) => offer.type);
};

const createTripEditPointTemplate = (dataOfPoint, offers, destinations, offersOfType, isNewPoint) => {
  const {isSaving, isDeleting, isDisabled} = dataOfPoint;
  const cities = getCities(destinations);
  const types = getTypes(offers);
  const eventDetailsTemplate = createTripEventsDetailsTemplate(dataOfPoint, offersOfType, isDisabled);
  const getBtnText = () => {
    let btnText = `Delete`;
    if (isNewPoint) {
      btnText = `Cancel`;
    } else if (isDeleting) {
      btnText = `Deleting`;
    }
    return btnText;
  };

  return `<form class="event event--edit" >
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${dataOfPoint.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>
           ${createTypeList(types, dataOfPoint.type, isDisabled)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${dataOfPoint.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${dataOfPoint.destination.name}" list="destination-list-1" ${isDisabled ? `disabled` : ``}>
          <datalist id="destination-list-1">
            ${generateOptions(cities)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dataOfPoint.dateStart).format(`DD/MM/YY HH:mm`)}" ${isDisabled ? `disabled` : ``}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dataOfPoint.dateFinish).format(`DD/MM/YY HH:mm`)}" ${isDisabled ? `disabled` : ``}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${dataOfPoint.price}" ${isDisabled ? `disabled` : ``} min="0">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving` : `Save`}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${getBtnText()}</button>
        ${isNewPoint ? `` : `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`}
      </header>
      ${eventDetailsTemplate}
    </form>`;
};

export default class EditPoint extends SmartView {
  constructor(editPoint, offers, destinations, isNewPoint = false) {
    super();
    this._datepickerStart = null;
    this._datepickerFinish = null;
    this._data = EditPoint.parsePointToData(editPoint);
    this._isNewPoint = isNewPoint;
    this._offers = offers;
    this._destinations = destinations;
    this._offersOfType = [];

    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateFinishChangeHandler = this._dateFinishChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._setClickHandler = this._setClickHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._activeOffersChangeHandler = this._activeOffersChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerStart();
    this._setDatepickerFinish();
  }

  _dateStartChangeHandler([userDate]) {
    this.updateData({
      dateStart: dayjs(userDate).toISOString()
    }, true);
  }

  _dateFinishChangeHandler([userDate]) {
    this.updateData({
      dateFinish: dayjs(userDate).toISOString()
    }, true);
  }

  _setDatepickerStart() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    this._datepickerStart = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/Y H:i`,
          defaultDate: dayjs(this._data.dateStart).toDate(),
          onChange: this._dateStartChangeHandler
        }
    );
  }

  _setDatepickerFinish() {
    if (this._datepickerFinish) {
      this._datepickerFinish.destroy();
      this._datepickerFinish = null;
    }

    this._datepickerFinish = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/Y H:i`,
          minDate: dayjs(this._data.dateStart).toDate(),
          defaultDate: dayjs(this._data.dateFinish).toDate(),
          onChange: this._dateFinishChangeHandler
        }
    );
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditPoint.parseDataToPoint(this._data));
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditPoint.parseDataToPoint(this._data));
  }

  _setClickHandler() {
    this._callback.click();
  }

  getTemplate() {
    this._offersOfType = getOffersOfType(this._data, this._offers);
    return createTripEditPointTemplate(this._data, this._offers, this._destinations, this._offersOfType, this._isNewPoint);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setPointClick(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._setClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickerStart();
    this._setDatepickerFinish();
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._callback.deleteClick);
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
    if (this.getElement().querySelector(`.event__rollup-btn`)) {
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._callback.click);
    }
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
    evt.preventDefault();
    const cities = getCities(this._destinations);
    if (evt.target.value === `` || !cities.includes(evt.target.value)) {
      return;
    } else {
      const newDestination = this._destinations.find((destination) => destination.name === evt.target.value);
      this.updateData({
        destination: newDestination
      }, false);
    }
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    const newType = this._offers.find((offer) => offer.type === evt.target.value);
    this.updateData({
      type: newType.type,
      activeOffers: []
    }, false);
  }

  _activeOffersChangeHandler(evt) {
    evt.preventDefault();
    const checkedOffer = this._offersOfType[evt.target.dataset.offerIndex];
    let newActiveOffers = [];
    if (this._data.activeOffers.length === 0) {
      newActiveOffers.push(this._offersOfType[evt.target.dataset.offerIndex]);
    } else {
      newActiveOffers = this._data.activeOffers.slice();
      const isItOfferActive = this._data.activeOffers.find((offer) => offer.title === checkedOffer.title);
      if (!isItOfferActive) {
        newActiveOffers.push(this._offersOfType.find((offer) => offer === this._offersOfType[evt.target.dataset.offerIndex]));
      } else {
        newActiveOffers.splice(newActiveOffers.findIndex((offer) => offer.title === checkedOffer.title), 1);
        if (newActiveOffers.length === 0) {
          newActiveOffers = [];
        }
      }
    }
    this.updateData({
      activeOffers: newActiveOffers
    }, true);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: Number(evt.target.value)
    }, true);
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    return data;
  }
}

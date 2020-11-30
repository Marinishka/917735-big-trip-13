import {createElement} from '../utils.js';

const createTripNewPointOffersTemplate = (editPoint) => {
  const {activeOffers} = editPoint;

  const getIdActiveOffers = () => {
    let idActiveOffers = [];
    for (let offer of activeOffers) {
      const {id} = offer;
      idActiveOffers.push(id);
    }
    return idActiveOffers;
  };

  const isOfferActive = (offer) => {
    const idActiveOffers = getIdActiveOffers();
    return idActiveOffers.includes(offer);
  };

  const getOfferSelectors = (point) => {
    const {type} = point;
    const {offers: typeOffers} = type;
    let offersList = ``;
    typeOffers.forEach(function (typeOffer) {
      const {id, title, price} = typeOffer;
      offersList += `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-${id}" ${isOfferActive(id) ? `checked` : ``}>
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

export default class EditPointOffers {
  constructor(point) {
    this._element = null;
    this._point = point;
  }

  getTemplate() {
    return createTripNewPointOffersTemplate(this._point);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

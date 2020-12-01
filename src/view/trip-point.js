import dayjs from 'dayjs';
import {createElement} from '../utils.js';

const createTripPointTemplate = (point) => {
  const {type, city, activeOffers, price, dateStart, dateFinish, isFavorite} = point;
  const {title} = type;

  const getOffersTemplate = (offers) => {
    const offerItems = offers.map(({title: titleOffer, price: priceOffer}) =>
      `<li class="event__offer">
      <span class="event__offer-title">${titleOffer}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${priceOffer}</span>
      </li>`).join(``);
    return `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">${offerItems}</ul>`;
  };

  const getTimeDuration = (start, finish) => {
    const minuteDuration = finish.diff(start, `minute`);
    const MINUTE_IN_HOUR = 60;
    const HOUR_IN_DAY = 24;
    const minuteInDay = MINUTE_IN_HOUR * HOUR_IN_DAY;

    let duration = ``;
    if (minuteDuration < MINUTE_IN_HOUR) {
      duration = `${minuteDuration}M`;
    } else if (minuteDuration < minuteInDay) {
      const hourDuration = minuteDuration / MINUTE_IN_HOUR;
      const restMinuteDuration = (minuteDuration - Math.floor(hourDuration) * MINUTE_IN_HOUR);
      duration = `${Math.floor(hourDuration)}H ${restMinuteDuration}M`;
    } else {
      const dayDuration = minuteDuration / MINUTE_IN_HOUR / HOUR_IN_DAY;
      const restHourDuration = (minuteDuration - Math.floor(dayDuration) * HOUR_IN_DAY * MINUTE_IN_HOUR) / MINUTE_IN_HOUR;
      const restMinuteDuration = (minuteDuration - Math.floor(dayDuration) * HOUR_IN_DAY * MINUTE_IN_HOUR - Math.floor(restHourDuration) * MINUTE_IN_HOUR);
      duration = `${Math.floor(dayDuration)}D ${Math.floor(restHourDuration)}H ${restMinuteDuration}M`;
    }
    return duration;
  };

  const image = title.toLowerCase();
  return `<div class="event">
      <time class="event__date" datetime="${dayjs(dateStart).format(`YYYY-MM-DD`)}">${dayjs(dateStart).format(`MMM DD`)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${image}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${title} ${city}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dayjs(dateStart).format(`YYYY-MM-DDTHH:mm`)}">${dayjs(dateStart).format(`HH:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="${dayjs(dateFinish).format(`YYYY-MM-DDTHH:mm`)}">${dayjs(dateFinish).format(`HH:mm`)}</time>
        </p>
        <p class="event__duration">${getTimeDuration(dateStart, dateFinish)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${activeOffers !== null ? getOffersTemplate(activeOffers) : ``}
      <button class="event__favorite-btn ${isFavorite ? `event__favorite-btn--active` : ``}event__favorite-btn--active" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`;
};

export default class Point {
  constructor(point) {
    this._element = null;
    this._point = point;
  }

  getTemplate() {
    return createTripPointTemplate(this._point);
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

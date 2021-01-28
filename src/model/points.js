import Observer from '../utils/observer.js';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this._offers = [];
    this._destinations = [];
  }

  setData(updateType, data) {
    const {points, destinations, offers} = data;
    this.setOffers(offers);
    this.setDestinations(destinations);
    this.setPoints(updateType, points);
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getPoints() {
    return this._points;
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptPointToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          dateStart: point.date_from,
          dateFinish: point.date_to,
          price: point.base_price,
          isFavorite: point.is_favorite,
          activeOffers: point.offers
        }
    );

    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.offers;
    delete adaptedPoint.base_price;

    return adaptedPoint;
  }

  static adaptPointToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          'date_from': new Date(point.dateStart).toISOString(),
          'date_to': new Date(point.dateFinish).toISOString(),
          'is_favorite': point.isFavorite,
          'offers': point.activeOffers,
          'base_price': Number(point.price)
        }
    );

    delete adaptedPoint.dateStart;
    delete adaptedPoint.dateFinish;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.activeOffers;
    delete adaptedPoint.price;

    return adaptedPoint;
  }
}

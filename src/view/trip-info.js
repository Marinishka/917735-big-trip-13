import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const getPrice = (points) => {
  let fullPrice = 0;
  points.forEach((element) => {
    fullPrice += element.price;
  });
  return fullPrice;
};

const getRoute = (points) => {
  let route = [];
  route[0] = points[0].destination.name;
  for (let i = 1; i < points.length; i++) {
    if (points[i].destination.name !== route[route.length - 1]) {
      route[route.length] = points[i].destination.name;
    }
  }
  return route;
};

const getInfoTitle = (route) => {
  let infoTitle = ``;
  const numberOfCities = route.length;
  if (numberOfCities === 1) {
    infoTitle = route[0];
  } else if (numberOfCities === 2) {
    infoTitle = `${route[0]} &mdash; ${route[1]}`;
  } else if (numberOfCities === 3) {
    infoTitle = `${route[0]} &mdash; ${route[1]} &mdash; ${route[2]}`;
  } else {
    infoTitle = `${route[0]} &mdash; ... &mdash; ${route.pop()}`;
  }
  return infoTitle;
};

const getDates = (points) => {
  let dates = [dayjs(points[0].dateStart).format(`DD MMM`), dayjs(points.pop().dateStart).format(`DD MMM`)];
  return dates;
};

export const createTripInfoTemlate = (points) => {
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getInfoTitle(getRoute(points))}</h1>

      <p class="trip-info__dates">${getDates(points)[0]}&nbsp;&mdash;&nbsp;${getDates(points)[1]}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getPrice(points)}</span>
    </p>
  </section>`;
};

export default class Info extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }
  getTemplate() {
    return createTripInfoTemlate(this._points);
  }
}

import AbstractView from './abstract.js';

const isPoints = (points) => {
  if (points === undefined) {
    return false;
  } else if (points.length === 0) {
    return false;
  } else {
    return true;
  }
};

const createTripFiltersItemTemplate = (filter, currentFilterType, points) => {
  const {type, name} = filter;

  return `<div class="trip-filters__filter">
  <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? `checked` : ``} ${isPoints(points) ? `` : `disabled`}>
  <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
</div>`;
};

const createTripFiltersTemplate = (filterItems, currentFilterType, points) => {
  const filtersItemsTemplate = filterItems.map((filter) => createTripFiltersItemTemplate(filter, currentFilterType, points)).join(``);
  return `<form class="trip-filters" action="#" method="get">
  <h2 class="visually-hidden">Filter events</h2>
  ${filtersItemsTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType, points) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._points = points;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters, this._currentFilter, this._points);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}

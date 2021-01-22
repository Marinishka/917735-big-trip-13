import AbstractView from './abstract.js';

const createTripFiltersItemTemplate = (filter, currentFilterType) => {
  const {type, name} = filter;
  return `<div class="trip-filters__filter">
  <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? `checked` : ``}>
  <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
</div>`;
};

const createTripFiltersTemplate = (filterItems, currentFilterType) => {
  const filtersItemsTemplate = filterItems.map((filter) => createTripFiltersItemTemplate(filter, currentFilterType)).join(``);
  return `<form class="trip-filters" action="#" method="get">
  <h2 class="visually-hidden">Filter events</h2>
  ${filtersItemsTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters, this._currentFilter);
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

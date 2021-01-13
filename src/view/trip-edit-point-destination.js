import AbstractView from './abstract.js';

const createTripNewPointDestinationTemplate = (editPoint) => {
  const {destination} = editPoint;
  const {description, pictures} = destination;

  const getPhotosList = (somePictures) => {
    let photoList = ``;
    somePictures.forEach(function (picture) {
      photoList += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
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

export default class EditPointDestination extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createTripNewPointDestinationTemplate(this._point);
  }
}

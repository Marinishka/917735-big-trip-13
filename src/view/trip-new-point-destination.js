export const createTripNewPointDestinationTemplate = (editPoint) => {
  const {destination} = editPoint;
  const {description, photos} = destination;

  const getPhotosList = (somePhotos) => {
    let photoList = ``;
    somePhotos.forEach(function (photo) {
      photoList += `<img class="event__photo" src="${photo}" alt="Event photo">`;
    });
    return photoList;
  };

  const getPhotosTemplate = () => {
    return photos === null ? `` : `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${getPhotosList(photos)}
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

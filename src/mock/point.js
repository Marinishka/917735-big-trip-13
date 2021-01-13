import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateId = () => {
  return nanoid();
};

const OFFERS = [
  {
    id: `luggage`,
    title: `Add luggage`,
    price: 30
  },
  {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  },
  {
    id: `meal`,
    title: `Add meal`,
    price: 15
  },
  {
    id: `seats`,
    title: `Choose seats`,
    price: 5
  },
  {
    id: `train`,
    title: `Travel by train`,
    price: 40
  }
];

const generateOffers = (offers) => {
  const quantityOffers = getRandomInteger(1, offers.length - 1);
  let offersList = [];
  for (let i = 0; i < quantityOffers; i++) {
    offersList.push(offers[i]);
  }
  return offersList;
};

const isOffers = () => {
  return Boolean(getRandomInteger(0, 1));
};

export const generateTypes = () => {
  return [
    {
      title: `taxi`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `bus`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `ship`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `transport`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `drive`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `flight`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `check-in`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `sightseeing`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `restaurant`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `train`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    }
  ];
};

const generateStartDate = () => {
  const daysGap = getRandomInteger(0, 5);
  const hour = getRandomInteger(0, 23);
  const min = getRandomInteger(0, 59);
  return dayjs().add(daysGap, `day`).hour(hour).minute(min).second(0).millisecond(0);
};

const generateFinishDate = (startDate) => {
  const timeGap = getRandomInteger(0, 5000);
  return dayjs(startDate).add(timeGap, `minute`);
};

const generateType = (types) => {
  const randomIndex = getRandomInteger(0, types.length - 1);
  return types[randomIndex];
};

const CITIES = [`Riga`, `Amsterdam`, `Berlin`, `Paris`, `Krakow`, `Hannover`];

export const generateCities = () => {
  let cities = [];
  for (const city of CITIES) {
    const isDescriptionCity = Boolean(getRandomInteger(0, 1));
    const isPhotos = Boolean(getRandomInteger(0, 1));
    cities.push({
      name: city,
      description: isDescriptionCity ? generateDescription() : null,
      pictures: isPhotos ? generatePhoto() : null
    });
  }
  return cities;
};

const generateCity = (cities) => {
  const randomIndex = getRandomInteger(0, cities.length - 1);
  return cities[randomIndex];
};

const DESCRIPTION = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus`];
const generateDescription = () => {
  let quantityDescription = new Set();
  quantityDescription.add(getRandomInteger(0, DESCRIPTION.length - 1));
  quantityDescription.add(getRandomInteger(0, DESCRIPTION.length - 1));
  quantityDescription.add(getRandomInteger(0, DESCRIPTION.length - 1));
  quantityDescription.add(getRandomInteger(0, DESCRIPTION.length - 1));
  quantityDescription.add(getRandomInteger(0, DESCRIPTION.length - 1));
  quantityDescription = Array.from(quantityDescription);
  let description = ``;
  for (let i = 0; i < quantityDescription.length; i++) {
    description += `${DESCRIPTION[i]}`;
  }
  return description;
};

const generatePhoto = () => {
  const randomNumber = getRandomInteger(1, 5);
  let photos = [];
  for (let i = 0; i < randomNumber; i++) {
    photos.push(
        {
          src: `http://picsum.photos/248/152?r=${Math.random()}`,
          description: generateDescription()
        }
    );
  }
  return photos;
};

export const generatePoint = (destinationInfo) => {
  const {types, accessibleСities} = destinationInfo;
  const isFavorite = Boolean(getRandomInteger(0, 1));
  const price = getRandomInteger(1, 500);
  const dateStart = generateStartDate();
  const dateFinish = generateFinishDate(dateStart);
  const type = generateType(types);
  const city = generateCity(accessibleСities);
  return {
    accessibleСities,
    types,
    type,
    activeOffers: type.offers === null ? null : generateOffers(type.offers),
    destination: city,
    price,
    isFavorite,
    dateStart,
    dateFinish,
    id: generateId()
  };
};

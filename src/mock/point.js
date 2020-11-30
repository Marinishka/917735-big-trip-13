import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
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

const generateTypes = () => {
  return [
    {
      title: `Taxi`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `Bus`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `Ship`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `Transport`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `Drive`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `Flight`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `Check-in`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `Sightseeing`,
      offers: isOffers() ? generateOffers(OFFERS) : null
    },
    {
      title: `Restaurant`,
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

const generateType = () => {
  const types = generateTypes();
  const randomIndex = getRandomInteger(0, types.length - 1);
  return types[randomIndex];
};

const CITIES = [`Riga`, `Amsterdam`, `Berlin`, `Paris`, `Krakow`, `Hannover`];

const generateCity = () => {
  const randomIndex = getRandomInteger(0, CITIES.length - 1);
  return CITIES[randomIndex];
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
  let photo = [];
  for (let i = 0; i < randomNumber; i++) {
    photo.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photo;
};

export const generatePoint = () => {
  const isFavorite = Boolean(getRandomInteger(0, 1));
  const isDesctription = Boolean(getRandomInteger(0, 1));
  const isPhotos = Boolean(getRandomInteger(0, 1));
  const price = getRandomInteger(1, 500);
  const dateStart = generateStartDate();
  const dateFinish = generateFinishDate(dateStart);
  const type = generateType();
  return {
    type,
    city: generateCity(),
    activeOffers: type.offers === null ? null : generateOffers(type.offers),
    destination: isDesctription || isPhotos ? {
      description: isDesctription ? generateDescription() : null,
      photos: isPhotos ? generatePhoto() : null} : null,
    price,
    isFavorite,
    dateStart,
    dateFinish
  };
};

import dayjs from 'dayjs';

export const sortPointDate = (pointA, pointB) => {
  return dayjs(pointA.dateStart).diff(dayjs(pointB.dateStart));
};

export const sortPointPrice = (pointA, pointB) => {
  return pointB.price - pointA.price;
};

export const sortPointTime = (pointA, pointB) => {
  return dayjs(pointA.dateStart).diff(dayjs(pointA.dateFinish)) - dayjs(pointB.dateStart).diff(dayjs(pointB.dateFinish));
};
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

export const sortPointDate = (pointA, pointB) => {
  return dayjs(pointA.dateStart).diff(dayjs(pointB.dateStart));
};

export const sortPointPrice = (pointA, pointB) => {
  return pointB.price - pointA.price;
};

export const sortPointTime = (pointA, pointB) => {
  return dayjs(pointA.dateStart).diff(dayjs(pointA.dateFinish)) - dayjs(pointB.dateStart).diff(dayjs(pointB.dateFinish));
};

export const isPointFuture = (point) => {
  return dayjs().isBefore(point.dateStart);
};

export const isPointPast = (point) => {
  return dayjs().isAfter(point.dateStart);
};

export const generateId = () => {
  return nanoid();
};

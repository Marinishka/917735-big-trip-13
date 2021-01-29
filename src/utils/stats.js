import dayjs from 'dayjs';

export const getInfoOfTrip = (data) => {
  const points = data.slice();
  const types = new Map();
  points.forEach((point) => {
    if (types.has(point.type.toUpperCase())) {
      types.get(point.type.toUpperCase()).count += 1;
      types.get(point.type.toUpperCase()).money += point.price;
      types.get(point.type.toUpperCase()).timeSpend += dayjs(point.dateFinish).diff(dayjs(point.dateStart), `minute`);
    } else {
      types.set(point.type.toUpperCase(), {
        count: 1,
        money: point.price,
        timeSpend: dayjs(point.dateFinish).diff(dayjs(point.dateStart), `minute`)
      });
    }
  });
  return types;
};

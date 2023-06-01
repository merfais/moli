import dayjs from 'dayjs';

export function getStaticDayjsValue(staticVal) {
  if (!staticVal) {
    return;
  }
  if (dayjs.isDayjs(staticVal)) {
    return staticVal;
  }
  return dayjs(staticVal);
}

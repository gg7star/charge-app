import moment from 'moment';

export function openHourStatus(openHours) {
  var openStatus = false;
  var hour = 0;
  const currentHour = moment().hour();
  const currentWeekDay = moment().format('dddd');
  const openHourKeys = Object.keys(openHours);
  for (var i = 1; i < openHours.length; i++) {
    const key = openHourKeys[i];
    const item = openHours[key];
    const openHour = item.openHour;
    const closeHour = item.closeHour;
    if (item.day === currentWeekDay) {
      if (
        openHour && 
        closeHour &&
        (currentHour >= moment({hour: openHour}).hour()) &&
        (currentHour < moment({hour: closeHour}).hour())
      ) {
        openStatus = true;
        hour = openHour;
      } else {
        openStatus = false;
        hour = closeHour;
      }
    }
  }
  
  return { openStatus, hour };
}

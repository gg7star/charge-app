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

export function calculateDurationString(start_time, end_time) {
  if (!start_time) return `48:00:00`;
  var startTime = moment(start_time, 'DD/MM/YY hh:mm:ss a');
  // calculate total duration
  var duration = moment.duration(end_time.diff(startTime));
  // var hours = parseInt(duration.asHours());
  // var minutes = parseInt(duration.asMinutes())%60;
  // var seconds = parseInt(duration.asSeconds())%60;

  // 48*3600 = 172800 milliseconds
  var diff_duration = 172800 - parseInt(duration.as('seconds'));
  if (diff_duration <= 0 ) {
    return `00:00:00`;
  }

  var hours = Math.floor(diff_duration / 3600);
  var minutes = Math.floor((diff_duration - hours * 3600) / 60);
  var seconds =  Math.floor(diff_duration - hours * 3600 - minutes * 60);

  var strHours = ("0" + hours).slice(-2);
  var strMinues = ("0" + minutes).slice(-2);
  var strSeconds = ("0" + seconds).slice(-2);
  // console.log(`${strHours}:${strMinues}:${strSeconds}`);
  return `${strHours}:${strMinues}:${strSeconds}`;
}

export function calculateDurationWithMins(start_time, end_time) {
  console.log('===== start_time, end_time: ', start_time, end_time);
  if (!start_time || !end_time) return `0 min`;
  var startTime = moment(start_time, 'DD/MM/YY hh:mm:ss a');
  var endTime = moment(end_time, 'DD/MM/YY hh:mm:ss a');
  // calculate total duration
  var duration = moment.duration(endTime.diff(startTime)).as('minutes');
  duration = Math.round(duration);
  console.log('===== duration: ', duration);
  return `${duration} ${(duration > 1) ? 'mins' : 'min'}`;
}
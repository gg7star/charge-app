export function getStationStatus(stationStatusArray) {
  var totalBaterries = 0;
  var totalPlaces = 0;
  if (stationStatusArray && (stationStatusArray.length > 0)) {
    for (var i = 0; i < stationStatusArray.length; i++) {
      totalBaterries += stationStatusArray[i].baterries;
      totalPlaces += stationStatusArray[i].places;
    }
  }
  return { batterries: totalBaterries, places: totalPlaces };
}
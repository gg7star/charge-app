export function getStationStatus(stationStatuArray) {
  var totalBaterries = 0;
  var totalPlaces = 0;
  if (stationStatuArray && (stationStatuArray.length > 0)) {
    for (var i = 0; i < stationStatuArray.length; i++) {
      totalBaterries += stationStatuArray[i].baterries;
      totalPlaces += stationStatuArray[i].places;
    }
  }
  return { batterries: totalBaterries, places: totalPlaces };
}
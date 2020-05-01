export function getDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

export function filterPlaces(places, value, currentLocation, radius) {
  const searchVal = value;
  var filteredPlaces = [];
  Object.keys(places).map((key) => {
    const place = places[key];
    filteredPlaces.push(place);
    // Disable filter feature by current location.
    // if (place.name.toLowerCase().search(searchVal.toLowerCase()) > -1 || 
    //   key.toLowerCase().search(searchVal.toLowerCase()) > -1
    // ) {
    //   if (currentLocation) {
    //     const {latitude, longitude} = currentLocation.coordinate;
    //     const filteringRadius = radius | 2; // Km
    //     const distance = getDistance(
    //       latitude, longitude,
    //       place.coordinate.latitude, place.coordinate.longitude,
    //       "K"
    //     );
    //     if ( distance <= filteringRadius) {
    //       filteredPlaces.push(place);
    //     }
    //   } else {
    //     filteredPlaces.push(place);
    //   }
    // }
  });
  return filteredPlaces
}

export function getPlace(places, stationSn) {
  
}
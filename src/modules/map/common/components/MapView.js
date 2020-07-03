import React from 'react';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Dimensions, View, Image, Platform } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import googleMapConfig from '~/common/config/googleMap';
import convertUnits from 'convert-units';
import { W, H } from '~/common/constants';
import { generateColor } from '~/common/utils/gradientColor';
import defaultCurrentLocation from '~/common/config/locations';
import { openHourStatus } from '~/common/utils/time';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 60;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const PIN_OPEN_IMAGE = require('~/common/assets/images/png/pin-open.png');
const PIN_CLOSE_IMAGE = require('~/common/assets/images/png/pin-close.png');
const PIN_SELECT_IMAGE = require('~/common/assets/images/png/pin-select.png');
const CURRENT_LOCATION_IMAGE = require('~/common/assets/images/png/currentLocation.png');

export default class CustomMapView extends React.Component {
  state = {
    mapView: null,
    directionCoordinates: [],
    degree: 0,
    currentLocation: this.props.currentLocation
  }

  onGoToLocation = (coordinate) => {
    this.mapView.animateToRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.0059397161733585335,
      longitudeDelta: 0.005845874547958374
    });  
  };

  renderMarkers = () => {
    const { places, selectedPlace } = this.props
    // const currentLocation = this.state.currentLocation;
    const selectedIndex = places.findIndex(p => {
        return selectedPlace && p.name === selectedPlace.name
      });
    var placeImage = PIN_OPEN_IMAGE;
   
    return (
      <React.Fragment>
        {places && Object.keys(places).map((key, index) => {
          const place = places[key];
          if(place) {
            if (selectedPlace && (key === `${selectedIndex}`)) placeImage = PIN_SELECT_IMAGE;
            else {
              // placeImage = place.isOpened ? PIN_OPEN_IMAGE : PIN_CLOSE_IMAGE;
              const hourStatus = openHourStatus(place.openHours);
              placeImage = hourStatus.openStatus ? PIN_OPEN_IMAGE : PIN_CLOSE_IMAGE;
            };
            return (
              <MapView.Marker
                key={`station-${index}`}
                coordinate={place.coordinate}
                onPress={() => this.props.onSelectMarker(key)}
              >
                <Image
                  source={placeImage}
                  style={{width: 40, height: 40}}
                />
              </MapView.Marker>
              );
            }
          })
        }
       {/* { (currentLocation && currentLocation.coordinate) && this.renderCurrentLocationMarker() } */}
      </React.Fragment>
    )
  };

  calculateDegree = (l1, l2) => {
    x = l2.latitude - l1.latitude;
    y = l2.longitude - l1.longitude;
    return Math.atan2(y, x) * 180 / Math.PI + 90;
  };

  onUserLocationChange = async (currLoc) => {
    // console.log('====== onUserLocationChange: currLoc: ', currLoc.nativeEvent);
    if (currLoc.nativeEvent && currLoc.nativeEvent.coordinate) {
      const { onDetectCurrentLocation } = this.props;
      onDetectCurrentLocation && onDetectCurrentLocation(currLoc.nativeEvent.coordinate);
      this.setState({currentLocation: {coordinate: currLoc.nativeEvent.coordinate}})
    }
  };

  renderCurrentLocationMarker = () => {
    const currentLocation = this.state.currentLocation;
    const { directionCoordinates } = this.state;
    // const degree = (directionCoordinates.length > 2)
    //   ? this.calculateDegree(directionCoordinates[0], directionCoordinates[1])
    //   : 90;
    
    return (
      <MapView.Marker.Animated
        key={'my-location'}
        coordinate={currentLocation.coordinate}
        anchor={{x: 0.5, y: 0.5}}
        rotation={130}
      >
       <Image
          source={CURRENT_LOCATION_IMAGE}
          style={{width: 44, height: 40,
            // transform: [{rotate: `${degree}deg`}],
          }}
        />
      </MapView.Marker.Animated>
    )
  };

  renderCustomDirection = () => {
    const { directionCoordinates } = this.state;
    const startColor = '#FFDF00';
    const endColor = '#FF52A8';
    const strokeColors = generateColor(
      startColor,
      endColor,
      directionCoordinates ? directionCoordinates.length : 1
    );

    return (
      <MapView.Polyline
        coordinates={directionCoordinates}
        strokeWidth={4}
        strokeColor={startColor}
        strokeColors={strokeColors}
      />
    );
  };

  render() {
    const { directionCoordinates, currentLocation } = this.state;
    const { selectedPlace, onDetectDirection, children } = this.props;
    const GOOGLE_MAPS_APIKEY = Platform.OS === 'ios' 
      ? googleMapConfig.IOS_GOOGLE_MAPS_APIKEY
      : googleMapConfig.ANDROID_GOOGLE_MAPS_APIKEY;
    var region = null;
    if (currentLocation)
      region = {
        latitude: currentLocation.coordinate.latitude,
        longitude: currentLocation.coordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };

    return (
      <View 
        style={{
          position: 'absolute', left: 0, top: 0,
          width: W, height: H, zIndex: 10
        }}
      >
        <React.Fragment>
          <MapView 
            style={{width: '100%', height: '100%'}}
            initialRegion={region}
            provider={PROVIDER_GOOGLE}
            mapType={Platform.OS == "android" ? "terrain" : "standard"}
            showsUserLocation={true}
            // followsUserLocation={true}
            showsCompass={true}
            rotateEnabled={true}
            loadingEnabled={true}
            showsBuildings={true}
            pitchEnabled={true}
            rotateEnabled={true}
            onUserLocationChange={this.onUserLocationChange}
            zoomTapEnabled={false}
            ref={c => this.mapView = c}
          >
            { this.renderMarkers() }
            {(selectedPlace && selectedPlace.coordinate && currentLocation && currentLocation.coordinate) && 
              <MapViewDirections
                origin={currentLocation.coordinate}
                destination={selectedPlace.coordinate}
                apikey={GOOGLE_MAPS_APIKEY}
                mode={"WALKING"}
                strokeWidth={0}
                strokeColor="hotpink"
                optimizeWaypoints={true}
                precision={'high'}
                onStart={(params) => {
                  console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                }}
                onReady={result => {
                  console.log('====== result: ', result);
                  if (!result) {
                    console.log('====== reset direction');
                    this.setState({directionCoordinates: []});
                    onDetectDirection && onDetectDirection({
                      distance: null,
                      duration: null
                    });
                    return;
                  }
                  var distance = convertUnits(result.distance).from('km').toBest({ cutOffNumber: 1 });
                  var duration = convertUnits(result.duration).from('min').toBest({ cutOffNumber: 1 });
                  onDetectDirection && onDetectDirection({
                    distance: `${Math.round(distance.val * 100)/100} ${distance.unit}`,
                    duration: `${Math.round(duration.val)} ${duration.unit}`
                  })
                  var directionCoordinates = [];
                  directionCoordinates.push(currentLocation.coordinate);
                  for(var i = 0; i < result.coordinates.length - 1; i++) {
                    var coord = result.coordinates[i];
                    directionCoordinates.push(coord);
                  }
                  directionCoordinates.push(selectedPlace.coordinate);
                  const counts = directionCoordinates.length;
                  // this.mapView && this.mapView.fitToCoordinates(directionCoordinates, {
                  //   edgePadding: {
                  //     right: (width / 10),
                  //     bottom: (height / 5 * 2),
                  //     left: (width / 10),
                  //     top: (height / 7),
                  //   }
                  // });
                  this.setState({directionCoordinates});
                }}
                onError={(errorMessage) => {
                  console.log('==== GOT AN ERROR');
                  onDetectDirection && onDetectDirection({
                    distance: null,
                    duration: null
                  });
                  this.setState({directionCoordinates: []});
                }}
              />
            }
            { selectedPlace && (directionCoordinates.length > 0) && this.renderCustomDirection() }
          </MapView>
          { children && children }
        </React.Fragment>
      </View>
    )
  }
}

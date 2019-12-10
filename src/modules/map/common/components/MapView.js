import React from 'react';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Dimensions, View, Image, Platform } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import googleMapConfig from '~/common/config/googleMap';
import { W, H } from '~/common/constants';
import { generateColor } from '~/common/utils/gradientColor';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const PIN_OPEN_IMAGE = require('~/common/assets/images/png/pin-open.png');
const PIN_CLOSE_IMAGE = require('~/common/assets/images/png/pin-close.png');
const PIN_SELECT_IMAGE = require('~/common/assets/images/png/pin-select.png');

export default class CustomMapView extends React.Component {
  state = {
    mapView: null,
    directionCoordinates: []
  }

  handleUserLocationChange = (coordinate) => {
    console.log('===== handleUserLocationChange: ', coordinate);
  }

  render() {
    const { children } = this.props
    const { currentLocation, selectedPlace, onDetectDirection } = this.props
    const GOOGLE_MAPS_APIKEY = Platform.OS === 'ios' 
      ? googleMapConfig.IOS_GOOGLE_MAPS_APIKEY
      : googleMapConfig.ANDROID_GOOGLE_MAPS_APIKEY
    let region = {}
    if (currentLocation) {
      region = {
        latitude: currentLocation.coordinate.latitude,
        longitude: currentLocation.coordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    }

    return (
      <View 
        style={{
          position: 'absolute', left: 0, top: 0,
          width: W, height: H, zIndex: 10
        }}
      >
        { currentLocation && 
        <React.Fragment>
          <MapView 
            style={{width: '100%', height: '100%'}}
            initialRegion={region}
            // showsUserLocation={true}
            // provider={PROVIDER_GOOGLE}
            mapType={Platform.OS == "android" ? "terrain" : "mutedStandard"}
            // showsMyLocationButton={true}
            // followsUserLocation={true}
            showsCompass={true}
            showsTraffic={true}
            rotateEnabled={true}
            loadingEnabled={true}
            showsBuildings={true}
            pitchEnabled={true}
            ref={c => this.mapView = c}
            onUserLocationChange={this.handleUserLocationChange}
          >
            { this.renderMarkers() }
            { this.renderCurrentLocationMarker() }
            {(selectedPlace && selectedPlace.coordinate && currentLocation.coordinate) && <MapViewDirections
              origin={currentLocation.coordinate}
              destination={selectedPlace.coordinate}
              apikey={GOOGLE_MAPS_APIKEY}
              mode="WALKING"
              strokeWidth={1}
              strokeColor="hotpink"
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
              }}
              onReady={result => {
                // console.log(`==== Distance: ${result.distance} km`)
                // console.log(`==== Duration: ${result.duration} min.`)
                // console.log('====== result: ', result);
                onDetectDirection && onDetectDirection({
                  distance: Math.round(result.distance * 100),
                  duration: Math.round(result.duration)
                })
                this.mapView && this.mapView.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: (width / 20),
                    bottom: (height / 20),
                    left: (width / 20),
                    top: (height / 20),
                  }
                });
                this.setState({directionCoordinates: result.coordinates});
              }}
              onError={(errorMessage) => {
                // console.log('GOT AN ERROR');
              }}
            />}
            { this.renderCustomDirection() }
          </MapView>
          { children && children }
        </React.Fragment>
        }
      </View>      
    )
  }
  renderMarkers() {
    const { places, selectedPlace } = this.props

    return (
      <React.Fragment>
        {places && Object.keys(places).map((key, i) => {
          const place = places[key];
          if (place)
            return (
              <MapView.Marker
                key={`station-${i}`}
                title={place.name} 
                coordinate={place.coordinate}
                onPress={() => this.props.onSelectMarker(key)}
              >
                <Image
                  source={
                    place.isOpened 
                    ? ((key === selectedPlace.name) 
                        ? PIN_SELECT_IMAGE
                        : PIN_OPEN_IMAGE
                      )
                    : PIN_CLOSE_IMAGE} 
                  style={{width: 40, height: 40}}
                />            
              </MapView.Marker>
              );
            })
        }
      </React.Fragment>
    )
  }

  renderCurrentLocationMarker() {
    const { currentLocation } = this.props    

    return (
      <MapView.Marker
        key='my-location'
        coordinate={currentLocation.coordinate}
        title={'Me'}
      >
        <Image
          source={require('~/common/assets/images/png/currentLocation.png')}
          style={{width: 150, height: 150}}
        />
      </MapView.Marker>
    )
  }

  renderCustomDirection() {
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
    )
  }
}

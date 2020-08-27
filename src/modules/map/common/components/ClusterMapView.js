import React from 'react';
import { PROVIDER_GOOGLE, Polyline, Marker, AnimatedRegion } from 'react-native-maps';
import { ClusterMap } from 'react-native-cluster-map';
import { Dimensions, View, Image, Platform, Text, StyleSheet } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import googleMapConfig from '~/common/config/googleMap';
import convertUnits from 'convert-units';
import { W, H } from '~/common/constants';
import { generateColor } from '~/common/utils/gradientColor';
import defaultCurrentLocation from '~/common/config/locations';
import { openHourStatus } from '~/common/utils/time';
import { translate } from '~/common/i18n';
import moment from 'moment';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = 0.04; //LATITUDE_DELTA * ASPECT_RATIO;
const INIT_VIEW_LATITUDE_DELTA = 0.04;
const INIT_VIEW_LONGITUDE_DELTA = 0.04;// INIT_VIEW_LATITUDE_DELTA * ASPECT_RATIO;
const CURRENT_LOCATION_LATITUDE_DELTA = 0.0059397161733585335;
const CURRENT_LOCATION_LONGITUDE_DELTA = 0.005845874547958374;

const INITIALIZE_REGION = {
  latitude: defaultCurrentLocation.coordinate.latitude,
  longitude: defaultCurrentLocation.coordinate.longitude,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const PIN_OPEN_IMAGE = require('~/common/assets/images/png/pin-open.png');
const PIN_CLOSE_IMAGE = require('~/common/assets/images/png/pin-close.png');
const PIN_SELECT_IMAGE = require('~/common/assets/images/png/pin-select.png');
const CURRENT_LOCATION_IMAGE = require('~/common/assets/images/png/currentLocation.png');

const GOOGLE_MAPS_APIKEY = Platform.OS === 'ios'
  ? googleMapConfig.IOS_GOOGLE_MAPS_APIKEY
  : googleMapConfig.ANDROID_GOOGLE_MAPS_APIKEY;

export default class ClusterMapView extends React.Component {
  state = {
    directionCoordinates: [],
    degree: 0,
    tracksViewChangesAll: true,
    tracksViewChangesIndex: -1,
    isSelectedTracksViewChangesIndex: true
  };

  mapView = null;

  componentDidUpdate(prevProps) {
    if (prevProps.places !== this.props.places
      || prevProps.place !== this.props.place
      ) {
      this.setState({ tracksViewChangesAll: true })
    }
  }

  onMapReady = (coordinate) => {
    // Marked to fix lagging
    this.mapView.mapRef.animateToRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: INIT_VIEW_LATITUDE_DELTA,
      longitudeDelta: INIT_VIEW_LONGITUDE_DELTA
    });  
  };

  onRegionChange = (region) => {
    // console.log('===== onRegionChange: region', region);
  } 

  onGoToLocation = (coordinate) => {
    this.mapView.mapRef.animateToRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: CURRENT_LOCATION_LATITUDE_DELTA,
      longitudeDelta: CURRENT_LOCATION_LONGITUDE_DELTA
    });  
  };

  onSelectMarker = (index) => {
    const that = this;
    this.setState({ tracksViewChangesIndex: index, isSelectedTracksViewChangesIndex: true }, () => {
      that.props.onSelectMarker(index);
    });
  }

  renderMarkers = () => {
    const { places, selectedPlace } = this.props;
    const { tracksViewChangesAll, tracksViewChangesIndex, isSelectedTracksViewChangesIndex } = this.state;
    const selectedIndex = places.findIndex(p => {
        return selectedPlace && p.name === selectedPlace.name
      });
    var placeImage = PIN_OPEN_IMAGE;
    if (!places || (places.length === 0)) return null;
    var markers = [];
    if (places) {
      const placeMakers = Object.keys(places).map((key, index) => {
        const place = places[key];
        const isTracksViewChanges = (key === tracksViewChangesIndex) || isSelectedTracksViewChangesIndex;
        if(place && place.coordinate) {
          if (selectedPlace && (key === `${selectedIndex}`)){
            placeImage = PIN_SELECT_IMAGE;
          }else {
            // placeImage = place.isOpened ? PIN_OPEN_IMAGE : PIN_CLOSE_IMAGE;
            if (place.openHours) {
              // const currentWeekDay = translate(moment().format('dddd'), 'fr');
              const hourStatus = openHourStatus(place.openHours);
              placeImage = hourStatus.openStatus ? PIN_OPEN_IMAGE : PIN_CLOSE_IMAGE;
            } else {
              placeImage = PIN_CLOSE_IMAGE;
            }
          };
          const marker = <Marker
            key={`station-${index}`}
            coordinate={place.coordinate}
            tracksViewChanges={isTracksViewChanges || tracksViewChangesAll}
            onPress={() => this.onSelectMarker(key)}
          >
            <Image source={placeImage} style={{ width: 40, height: 40 }} />
          </Marker>
          markers.push(marker);
          return marker;
        }
      });
    };
    var newState = {};
    if (tracksViewChangesAll) {
      newState = {
        ...newState,
        tracksViewChangesAll: false
      }
    }
    if (isSelectedTracksViewChangesIndex) {
      newState = {
        ...newState,
        isSelectedTracksViewChangesIndex: false
      }
    }
    if (Object.keys(newState).length > 0) {
      this.setState({...newState});
    }
    return markers;
  };

  calculateDegree = (l1, l2) => {
    x = l2.latitude - l1.latitude;
    y = l2.longitude - l1.longitude;
    return Math.atan2(y, x) * 180 / Math.PI + 90;
  };

  onUserLocationChange = async (currLoc) => {
    if (currLoc.nativeEvent && currLoc.nativeEvent.coordinate) {
      const { onDetectCurrentLocation } = this.props;
      onDetectCurrentLocation && onDetectCurrentLocation(currLoc.nativeEvent.coordinate);
    }
  };

  handleMapDirectionViewOnReady = (result, that) => {
    const { directionCoordinates } = that.state;
    const { selectedPlace, onDetectDirection, currentLocation } = that.props;
    if (!currentLocation || !selectedPlace) return;

    if (!result) {
      this.setState({ directionCoordinates: [] });
      onDetectDirection && onDetectDirection({
        distance: null,
        duration: null
      });
      return;
    }
    var distance = convertUnits(result.distance).from('km').toBest({ cutOffNumber: 1 });
    var duration = convertUnits(result.duration).from('min').toBest({ cutOffNumber: 1 });
    var tmpDirectionCoordinates = [];
    tmpDirectionCoordinates.push(currentLocation.coordinate);
    for (var i = 0; i < result.coordinates.length - 1; i++) {
      var coord = result.coordinates[i];
      tmpDirectionCoordinates.push(coord);
    }
    tmpDirectionCoordinates.push(selectedPlace.coordinate);
    const counts = tmpDirectionCoordinates.length;
    this.setState({directionCoordinates: tmpDirectionCoordinates}, () => {
      onDetectDirection && onDetectDirection({
        distance: `${Math.round(distance.val * 100) / 100} ${distance.unit}`,
        duration: `${Math.round(duration.val)} ${duration.unit}`
      });
    });
  }

  renderCurrentLocationMarker = () => {
    const { currentLocation } = this.props;
    const { directionCoordinates } = this.state;
    // const degree = (directionCoordinates.length > 2)
    //   ? this.calculateDegree(directionCoordinates[0], directionCoordinates[1])
    //   : 90;
    
    return (
      <Marker.Animated
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
      </Marker.Animated>
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
      <Polyline
        coordinates={directionCoordinates}
        strokeWidth={4}
        strokeColor={startColor}
        strokeColors={strokeColors}
        key={'polyline'}
      />
    );
  };

  renderMapViewDirection = () => {
    const { directionCoordinates } = this.state;
    const { selectedPlace, onDetectDirection, currentLocation } = this.props;
    var mapDirections = [];
    if (selectedPlace && selectedPlace.coordinate && 
      currentLocation && currentLocation.coordinate) {
      mapDirections.push(
        <MapViewDirections
          key={'MapDirection'}
          origin={currentLocation.coordinate}
          destination={selectedPlace.coordinate}
          apikey={GOOGLE_MAPS_APIKEY}
          mode={"WALKING"}
          strokeWidth={0}
          strokeColor="hotpink"
          optimizeWaypoints={true}
          precision={'high'}
          onStart={(params) => {
            console.log(`====== Started routing between "${params.origin}" and "${params.destination}"`);
          }}
          onReady={result => this.handleMapDirectionViewOnReady(result, this)}
          onError={(errorMessage) => {
            console.log('==== GOT AN ERROR: ', errorMessage);
            onDetectDirection && onDetectDirection({
              distance: null,
              duration: null
            });
            this.setState({directionCoordinates: []});
          }}
          {...{ isOutsideCluster: true }}
        />
      );
      if (selectedPlace && (directionCoordinates.length > 0))
        mapDirections.push(this.renderCustomDirection());
      // return mapDirections;
    }
    return mapDirections;
  };

  renderCustomClusterMarker = (count) => {
    return (
      <View style={{margin: 5, width: 45, height: 45,}}>
        <View
          style={{
            width: 35,
            height: 35,
            borderRadius: 25,
            backgroundColor: '#35cdfa',
            justifyContent: 'center',
            alignItems: 'center',
            ...Platform.select({
              ios: {
              // shadowColor: "#000000",
              shadowOffset: { width: 2, height: 3 },
              shadowOpacity: 0.23,
              shadowRadius: 4.62,
              },
              android: {
                elevation: 8,
              }
            }),
          }}>
          <Text style={{color: "#FFFFFF", fontSize: 17, fontWeight: '500'}}>
            {count}
          </Text>
        </View>
      </View>
    );
  }

  renderClusterMap = () => {
    const { currentLocation } = this.props;
    const { selectedPlace, children } = this.props;
    var region = INITIALIZE_REGION;
    if (currentLocation && currentLocation.coordinate
      && currentLocation.coordinate.latitude &&
      currentLocation.coordinate.longitude
    ){
      region = {
        latitude: currentLocation.coordinate.latitude,
        longitude: currentLocation.coordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
    }
    const mapDirections = this.renderMapViewDirection();

    return (
      <View style={styles.container}>
        <ClusterMap
          initialRegion={INITIALIZE_REGION}
          region={region}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          mapType={"standard"}
          showsUserLocation={true}
          showsCompass={true}
          rotateEnabled={true}
          loadingEnabled={true}
          showsBuildings={true}
          pitchEnabled={true}
          onMapReady={() => this.onMapReady(region)}
          onRegionChange={this.onRegionChange}
          onUserLocationChange={this.onUserLocationChange}
          zoomTapEnabled={false}
          renderClusterMarker={this.renderCustomClusterMarker}
          ref={c => this.mapView = c}
          // priorityMarker={this.renderMapViewDirection()}
          key={"cluster-map"}
        >
          {(mapDirections.length > 0) && mapDirections}
          {this.renderMarkers()}
        </ClusterMap>
        {children && children}
      </View>
    );
  };

  render() {
    const { children } = this.props;

    return (
      <View style={styles.container}>
        { this.renderClusterMap() }
        { children && children }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,

    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',

    position: 'absolute', left: 0, top: 0,
    width: W, height: H, zIndex: 10
  },
  map: {
    // flex: 1,
    // width: W,
    // height: H,
    ...StyleSheet.absoluteFillObject

    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
  },
});
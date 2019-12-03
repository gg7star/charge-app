import React from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { View, Image, Platform } from 'react-native'
import MapViewDirections from 'react-native-maps-directions'
import googleMapConfig from '~/common/config/googleMap'
import { W, H } from '~/common/constants'

export default class CustomMapView extends React.Component {
  render() {
    const { children } = this.props
    const { currentLocation, selectedPlace } = this.props
    const GOOGLE_MAPS_APIKEY = Platform.OS === 'ios' 
      ? googleMapConfig.IOS_GOOGLE_MAPS_APIKEY
      : googleMapConfig.ANDROID_GOOGLE_MAPS_APIKEY
    console.log('===== GOOGLE_MAPS_APIKEY: ', GOOGLE_MAPS_APIKEY)
    let region = {}
    if (currentLocation) {
      region = {
        latitude: currentLocation.coordinate.latitude,
        longitude: currentLocation.coordinate.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
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
        <>
          <MapView 
            style={{width: '100%', height: '100%'}}
            region={region}
            showsUserLocation={true}
            // provider={PROVIDER_GOOGLE} 
            mapType={Platform.OS == "android" ? "none" : "standard"}
            showsMyLocationButton={true}
            followsUserLocation={true}
            showsCompass={true}
            showsTraffic={true}
            rotateEnabled={true}
            loadingEnabled={true}
            pitchEnabled={true}
          >
            { this.renderMarkers() }
            { this.renderCurrentLocationMarker() }
            {(selectedPlace && selectedPlace.coordinate) && <MapViewDirections
              origin={currentLocation.coordinate}
              destination={selectedPlace.coordinate}
              apikey={GOOGLE_MAPS_APIKEY}
              // mode="WALKING"
            />}
          </MapView>
          { children && children }
        </>
        }
      </View>      
    )
  }
  renderMarkers() {
    const { places } = this.props

    return (
      <>
        {Object.keys(places).map((key, i) => {
          const place = places[key];
          return (
            <MapView.Marker
              key={i}
              title={place.name} 
              coordinate={place.coordinate}
              onPress={() => this.props.onSelectMarker(i)}
            >
              {place.isOpened ?
                <Image
                  source={require('~/common/assets/images/png/pin-open.png')} 
                  style={{width: 40, height: 40}}
                />
                :
                <Image
                  source={require('~/common/assets/images/png/pin-close.png')} 
                  style={{width: 40, height: 40}}
                />
              }            
            </MapView.Marker>
            );
          })
        }
      </>
    )
  }

  renderCurrentLocationMarker() {
    const { currentLocation } = this.props    

    return (
      <>
        <MapView.Marker key='my-location' coordinate={currentLocation.coordinate}>
          <Image
            source={require('~/common/assets/images/png/currentLocation.png')}
            style={{width: 150, height: 150}}
          />
        </MapView.Marker>
      </>
    )
  }
}

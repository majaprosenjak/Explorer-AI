import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { markers } from './markers';

const INITIAL_REGION = {
  latitude: 46.5547,
  longitude: 15.6459,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const GOOGLE_MAPS_APIKEY = 'AIzaSyDcJdWLYO_2ueX-G6D9Z-CoF_dFfbsb7rA';

const MapPage = () => {
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    const createDirections = () => {
      if (markers.length > 1) {
        const startMarker = markers[0];
        const newDirections = markers.slice(1).map(marker => ({
          origin: { latitude: startMarker.latitude, longitude: startMarker.longitude },
          destination: { latitude: marker.latitude, longitude: marker.longitude },
        }));
        setDirections(newDirections);
      }
    };

    createDirections();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            onPress={() => Alert.alert(marker.name, marker.description)}
          />
        ))}
        {directions.map((direction, index) => (
          <MapViewDirections
            key={index}
            origin={direction.origin}
            destination={direction.destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5FC',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapPage;

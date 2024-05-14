import React from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { markers } from './markers';

const INITIAL_REGION = {
  latitude: 46.5547,
  longitude: 15.6459,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const onMarkerClick = (marker) => {
  Alert.alert(marker.name, marker.description);
};


const MapPage = () => {
  return (
    <View style={styles.container}>
      <Text>Zemljevid atrakcij</Text>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} onPress={() => onMarkerClick(marker)} />
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

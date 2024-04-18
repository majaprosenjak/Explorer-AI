import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { markers } from './markers';
import { Alert } from 'react-native';

const INITIAL_REGION = {
  latitude: 46.5547,
  longitude: 15.6459,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
} 

const onMarkerClick = (marker) => {
  Alert.alert(marker.name);
};

export default function App() {
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
          <Marker key={index} coordinate={marker} onPress={() => onMarkerClick(marker)}/>
        )
      )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

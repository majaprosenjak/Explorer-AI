import { registerRootComponent } from 'expo';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapScreen from './Components/MapScreen'

export default function App() {
  return (
    <View style={styles.container}>
      <MapScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

registerRootComponent(App);


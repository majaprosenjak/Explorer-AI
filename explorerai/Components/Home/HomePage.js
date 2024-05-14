import React from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';

const HomePage = () => {
    return (
      <View style={styles.container}>
        <Text>Home page</Text>
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
  
  export default HomePage;
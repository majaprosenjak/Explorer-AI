import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const RoutesPublished = ({ routesCreated }) => {
  const publishedRoutes = routesCreated.filter(route => route.published === true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [monumentCoordinates, setMonumentCoordinates] = useState([]);

  const handleRoutePress = (route) => {
    setSelectedRoute(route);
    setModalVisible(true);

    const coordinates = route.monuments
      .filter(monument => monument.coordinates)
      .map(monument => ({
        ...monument.coordinates,
        name: monument.name,
        description: monument.description,
      }));
    
    setMonumentCoordinates(coordinates);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRoute(null);
    setMonumentCoordinates([]);
  };

  const onMarkerPress = (marker) => {
    Alert.alert(marker.name, marker.description);
  };

  return (
    <ScrollView style={styles.container}>
      {publishedRoutes.map((route, index) => (
        <TouchableOpacity key={`route-${index}`} style={styles.routeCard} onPress={() => handleRoutePress(route)}>
          <Text>{route.name}</Text>
        </TouchableOpacity>
      ))}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {selectedRoute && (
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedRoute.name}</Text>
              <Text style={styles.modalText}>{selectedRoute.description}</Text>
              <Text style={styles.modalText}>{selectedRoute.duration}</Text>
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>{selectedRoute.tags}</Text>
              </View>
              <Text>Znamenitosti:</Text>
              {selectedRoute.monuments && selectedRoute.monuments.length > 0 ? (
                selectedRoute.monuments.map((monument, monumentIndex) => (
                  <View key={`modal-monument-${monumentIndex}`} style={styles.monumentContainer}>
                    <Text>{monument.name}</Text>
                    <Text>{monument.description}</Text>
                  </View>
                ))
              ) : (
                <Text>Ni znamenitosti</Text>
              )}
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: 46.5547,
                    longitude: 15.6459,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                >
                  {monumentCoordinates.map((marker, index) => (
                    <Marker
                      key={`marker-${index}`}
                      coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                      title={marker.name}
                      description={marker.description}
                      onPress={() => onMarkerPress(marker)}
                    />
                  ))}
                </MapView>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Zapri</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5FC',
  },
  routeContainer: {
    marginBottom: 10,
  },
  monumentContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  monumentName: {
    fontWeight: 'bold',
  },
  monumentDescription: {
    marginTop: 5,
  },
  mapContainer: {
    marginVertical: 20,
  },
  map: {
    width: '100%',
    height: 200,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    elevation: 2,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '95%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tagContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
    marginTop: 5,
  },
  tagText: {
    color: 'white',
  },
});

export default RoutesPublished;
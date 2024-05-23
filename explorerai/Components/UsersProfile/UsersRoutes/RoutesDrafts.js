import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Avatar } from 'react-native-paper';
import EditRoute from './EditRoute';
import EditMonument from './EditMonument';

const RoutesDrafts = ({ routesCreated }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedMonument, setSelectedMonument] = useState(null);
  const [showEditRoute, setShowEditRoute] = useState(false);
  const [showEditMonument, setShowEditMonument] = useState(false);

  const draftRoutes = routesCreated.filter(route => route.published === false);


  const handleRoutePress = (route) => {
    setSelectedRoute(route);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRoute(null);
    setSelectedMonument(null);
  };

  const monumentCoordinates = [];
  draftRoutes.forEach(route => {
    route.monuments.forEach(monument => {
      if (monument.coordinates) {
        monumentCoordinates.push({
          ...monument.coordinates,
          name: monument.name,
          description: monument.description,
        });
      }
    });
  });

  const onMarkerPress = (marker) => {
    Alert.alert(marker.name, marker.description);
  };

  const handleMonumentPress = (monument) => {
    setSelectedMonument(monument);
    setShowEditMonument(true);
  };

  return (
    <ScrollView style={styles.container}>
      {draftRoutes.map((route, index) => (
        <TouchableOpacity key={`route-${index}`} style={styles.routeCard} onPress={() => handleRoutePress(route)}>
          <Text >{route.name}</Text>
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
              <View style={styles.monumentContainer}>
                <TouchableOpacity onPress={() => setShowEditRoute(true)}>
                  <Avatar.Icon icon="pencil" backgroundColor="#2196F3" size={30} style={styles.avatar}/>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedRoute.name}</Text>
                <Text style={styles.modalText}>{selectedRoute.description}</Text>
                <Text style={styles.modalText}>{selectedRoute.duration}</Text>
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>{selectedRoute.tags}</Text>
                </View>
              </View>
              
              <Text>Znamenitosti:</Text>
              {selectedRoute.monuments && selectedRoute.monuments.length > 0 ? (
                selectedRoute.monuments.map((monument, monumentIndex) => (
                  <View key={`modal-monument-${monumentIndex}`} style={styles.monumentContainer}>
                    <TouchableOpacity onPress={() => handleMonumentPress(monument)}>
                      <Avatar.Icon icon="pencil" backgroundColor="#2196F3" size={30} style={styles.avatar} />
                    </TouchableOpacity>
                    <Text>{monument.name}</Text>
                    <Text>{monument.description}</Text>
                  </View>
                ))
              ) : (
                <Text>Ni znamenitosti</Text>
              )}

              
              
              <TouchableOpacity style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Objavi pot</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Izbriši pot</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Zapri</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>
      <EditRoute visible={showEditRoute} onClose={() => setShowEditRoute(false)} selectedRoute={selectedRoute} />
      <EditMonument visible={showEditMonument} onClose={() => setShowEditMonument(false)} selectedMonument={selectedMonument} selectedRoute={selectedRoute} /> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5FC',
    padding: 20,
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
    width: '100%',
    maxHeight: '100%',
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
  avatar:{
    alignSelf: 'flex-end'  }
});

export default RoutesDrafts;

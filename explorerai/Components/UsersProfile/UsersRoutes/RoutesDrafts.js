import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Avatar } from 'react-native-paper';
import EditRoute from './EditRoute';
import EditMonument from './EditMonument';
import { updateDoc, doc, deleteDoc, collection, query, where, getDocs, arrayRemove } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig'; 

const RoutesDrafts = ({ routesCreated, user }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedMonument, setSelectedMonument] = useState(null);
  const [showEditRoute, setShowEditRoute] = useState(false);
  const [showEditMonument, setShowEditMonument] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);


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

  const handlePublishPress = async(selectedRoute) => {
    if (!selectedRoute) {
      console.log('No route selected')
      return;
    }
    try {
      const routeDocRef = doc(firestore, "routes", selectedRoute.id);
      await updateDoc(routeDocRef, { published: true });
      console.log('Published route:', selectedRoute.id);
      Alert.alert( "Uspešno ste objavili pot.");
    } catch (e) {
      Alert.alert("Napaka", "Prišlo je do napake. Poskusite ponovno.");
      console.error('Error publishing the route', e);
    }
  }

  

  const handleDeletePress = async (selectedRoute) => {
    setConfirmModalVisible(false);

    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', user));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.log('No user found with the specified email.');
        return;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      const userDocRef = doc(firestore, 'users', userId);
  
      const routeDocRef = doc(firestore, "routes", selectedRoute.id);
      await deleteDoc(routeDocRef);
      console.log('Deleted Route:', selectedRoute.id);
      console.log(selectedRoute.routesCreated)
      await updateDoc(userDocRef, {
        routesCreated: arrayRemove(routeDocRef)
      });
      Alert.alert("Uspešno ste izbrisali pot:", selectedRoute.name);
      closeModal()

      console.log('Removed route reference from user document:', userId);

    } catch (error) {
      console.error('Error deleting route and updating user document:', error);
    }
  };

  const onConfirmSaveRoute = () => {
    console.log("clicked")
    setConfirmModalVisible(true);
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

              
              
              <TouchableOpacity style={styles.draftButton} onPress={() => handlePublishPress(selectedRoute)}>
                <Text style={styles.draftButtonText}>Objavi pot</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.draftButton} onPress={onConfirmSaveRoute}>
                <Text style={styles.draftButtonText}>Izbriši pot</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.draftButtonClose} onPress={closeModal}>
                <Text style={styles.draftButtonCloseText}>Zapri</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.confirmModalBackground}>
          <View style={styles.confirmModalContainer}>
            <Text>Ste prepričani, da želite izbrisati pot?</Text>
            <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => handleDeletePress(selectedRoute)} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Da</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setConfirmModalVisible(false)} style={styles.buttonNe}>
              <Text style={styles.buttonTextNe}>Ne</Text>
            </TouchableOpacity>
          </View>
          </View>
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
  
  monumentContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    elevation: 2,
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
  draftButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  draftButtonClose: {
    backgroundColor: 'white',
    borderColor: '#2196F3', 
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50
  },
  draftButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',

  },
  draftButtonCloseText: {
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'uppercase',

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
    alignSelf: 'flex-end' 
  },
    buttonNe: {
      margin: 10, 
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      borderColor: '#2196F3', 
      borderWidth: 1.5, 
    },
    confirmButton: {
      margin: 10, 
      padding: 10,
      backgroundColor: '#2196F3',
      borderRadius: 5,
    },
    buttonTextNe: {
      color: 'black',
      textAlign: 'center',
      textTransform: 'uppercase', 
    },
    confirmButtonText: {
      color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase', 
    },
    buttonRow: {
      flexDirection: 'row', 
      marginTop: 20, 
    },
    confirmModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },confirmModalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },

});

export default RoutesDrafts;

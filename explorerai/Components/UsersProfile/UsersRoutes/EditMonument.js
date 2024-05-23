import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker

const EditMonument = ({ visible, onClose, selectedMonument, selectedRoute }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');


  useEffect(() => {
    if (selectedMonument) {
      setName(selectedMonument.name);
      setDescription(selectedMonument.description);
      setLatitude(selectedMonument.coordinates.latitude.toString());
      setLongitude(selectedMonument.coordinates.longitude.toString());
    }
  }, [selectedMonument]);

  const handleSave = async () => {
    if (!selectedMonument || !selectedRoute) {
      return;
    }

    const updatedMonument = {
      name,
      description,
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    };

    try {
      const monumentDocRef = doc(firestore, `routes/${selectedRoute.id}/monuments`, selectedMonument.id);
      await updateDoc(monumentDocRef, updatedMonument);
      console.log('Updated Monument:', updatedMonument);
      onClose();
      Alert.alert("Uspešno ste uredili znamenitost");
    } catch (e) {
      Alert.alert("Napaka", "Prišlo je do napakae. Poskusite znova.");
      console.error('Error updating the monument: ', e);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View contentContainerStyle={styles.modalContainer}>
      <ScrollView>

        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Urejanje znamenitosti</Text>
          <Text>Ime znamenitosti</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={text => setName(text)}
          />
          <Text>Opis znamenitosti</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={text => setDescription(text)}
          />
          <Text>Latitude</Text>
          <TextInput
            style={styles.input}
            value={latitude}
            onChangeText={text => setLatitude(text)}
          />
          <Text>Longitude</Text>
          <TextInput
            style={styles.input}
            value={longitude}
            onChangeText={text => setLongitude(text)}
          />
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
          <Marker
            coordinate={{ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }}
          />
        </MapView>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Shrani spremembe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={onClose}>
            <Text style={styles.buttonText}>Zapri</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    width: '100%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  mapContainer: {
    marginVertical: 20,
  },
  map: {
    width: '100%',
    height: 200,
  },
  
});

export default EditMonument;
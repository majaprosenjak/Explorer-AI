import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import MapView, { Marker } from 'react-native-maps';
import { useTranslation } from 'react-i18next';


const EditMonument = ({ visible, onClose, selectedMonument, selectedRoute }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation(); 


  useEffect(() => {
    if (selectedMonument) {
      setName(selectedMonument.name);
      setDescription(selectedMonument.description);
      setSelectedCoordinates(selectedMonument.coordinates);
    }
  }, [selectedMonument]);

  const onSearchAddress = () => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=API`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setSelectedCoordinates({ latitude: lat, longitude: lng });
        } else {
          Alert.alert(t('cantFindAdress'));
        }
      })
      .catch(error => console.error('Error searching address:', error));
  };

  const handleSave = async () => {
    if (!selectedMonument || !selectedRoute) {
      return;
    }

    const updatedMonument = {
      name,
      description,
      coordinates: selectedCoordinates,
    };

    try {
      const monumentDocRef = doc(firestore, `routes/${selectedRoute.id}/monuments`, selectedMonument.id);
      await updateDoc(monumentDocRef, updatedMonument);
      onClose();
      Alert.alert(t('ur-monumentUpdateSuccess'));
    } catch (e) {
      Alert.alert('ur-routeUpdateError');
      console.error('Error updating the monument: ', e);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('editMonument')}</Text>
          <Text>{t('addMName')}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={text => setName(text)}
          />
          <Text>{t('addMDesc')}</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={text => setDescription(text)}
          />
          <Text>{t('addMcoordinates')}</Text>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>
                {selectedCoordinates ?
                  `${selectedCoordinates.latitude}, ${selectedCoordinates.longitude}`
                  : t('addMNoLoc')}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>{t('pickLocation')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>{t('ur-saveChanges')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>{t('ur-close')}</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: selectedCoordinates ? selectedCoordinates.latitude : 46.5547,
                longitude: selectedCoordinates ? selectedCoordinates.longitude : 15.6459,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              onPress={(event) => {
                setSelectedCoordinates(event.nativeEvent.coordinate);
              }}
            >
              {selectedCoordinates && (
                <Marker coordinate={selectedCoordinates} />
              )}
            </MapView>
            <TextInput
              style={styles.input}
              placeholder={t('addMAddress')}
              value={address}
              onChangeText={text => setAddress(text)}
            />
            <TouchableOpacity onPress={onSearchAddress} style={styles.button}>
              <Text style={styles.buttonText}>{t('addMSearch')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
              <Text style={styles.buttonText}>{t('addMAdd')}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'black',
    textTransform: 'uppercase',

  },
  closeButton: {
    backgroundColor: 'white',
    borderColor: '#2196F3', 
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50
  },
  buttonText: {
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  card: {
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#ccc',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    color: 'grey',
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

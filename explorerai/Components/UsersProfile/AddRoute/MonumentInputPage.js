import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { API_KEY_GOOGLE_GEOCODING } from '@env';

const MonumentInputPage = ({ navigation, route }) => {
  const [monumentName, setMonumentName] = useState('');
  const [monumentDescription, setMonumentDescription] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation(); 


  const onSearchAddress = () => {
    console.log(route.params.monuments)
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY_GOOGLE_GEOCODING}`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setSelectedCoordinates({ latitude: lat, longitude: lng });
        } else {
          Alert.alert("Error", "Address not found.");
          console.log('Address not found');
        }
      })
      .catch(error => {
        console.error('Error searching address:', error);
        Alert.alert("Error", "Failed to search address. Please try again.");
      });
  };


  const onSaveMonument = () => {
    if (selectedCoordinates) {
      const monument = {
        name: monumentName,
        description: monumentDescription,
        coordinates: selectedCoordinates,
      };

      console.log(monument);
      route.params.updateMonuments([...route.params.monuments, monument]); 
      navigation.goBack();
    } else {
      Alert.alert("Error", "Please select a monument location.");
      console.log('No coordinates selected.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text>{t('addMName')}</Text>
      <TextInput
        style={styles.input}
        value={monumentName}
        placeholder={t('addMName')}
        onChangeText={text => setMonumentName(text)}
      />
      <Text>{t('addMDesc')}</Text>
      <TextInput
        style={styles.input}
        value={monumentDescription}
        placeholder={t('addMDesc')}
        onChangeText={text => setMonumentDescription(text)}
      />

      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>{selectedCoordinates ?
            `${t('addMcoordinates')}: ${selectedCoordinates.latitude}, ${selectedCoordinates.longitude}`
            : t('cantFindAdress')}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>{t('addMLoc')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSaveMonument} style={styles.button}>
        <Text style={styles.buttonText}>{t('addMAddM')}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 46.5547,
              longitude: 15.6459,
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
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    margin:10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase', 
  },
  button: {
    marginTop: 10, 
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  map: {
    width: '100%',
    height: '75%',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  card: {
    margin: 10,
    padding: 20,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderRadius: 8,
},
cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
},
cardText: {
  color: '#ccc'

}
});

export default MonumentInputPage;
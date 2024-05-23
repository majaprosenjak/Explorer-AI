import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


const MonumentInputPage = ({ navigation, route }) => {
  const { routeName, duration, description, addMonument } = route.params;
  const [monumentName, setMonumentName] = useState('');
  const [monumentDescription, setMonumentDescription] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  

  const onSearchAddress = () => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAwfLPfBqyBl6LoKqFZXP6MkbcjV0HTevY`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setSelectedCoordinates({ latitude: lat, longitude: lng });
        } else {
          Alert.alert("Napaka", "Naslova ni bilo mogoče najti.");
          console.log('Address not found');
        }
      })
      .catch(error => console.error('Error searching address:', error));
  };

  const onSaveMonument = () => {
    if (selectedCoordinates) {
      const monument = {
        name: monumentName,
        description: monumentDescription,
        coordinates: selectedCoordinates,
      };

      addMonument(monument);
      setMonumentName('');
      setMonumentDescription('');
      setAddress('');
      setSelectedCoordinates(null);
      navigation.goBack();
    } else {
      Alert.alert("Napaka", "Dodajte lokacijo znamenitosti.");
      console.log('No coordinates selected.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text>Ime znamenitosti</Text>
      <TextInput
        style={styles.input}
        value={monumentName}
        placeholder="Ime znamenitosti"
        onChangeText={text => setMonumentName(text)}
      />
      <Text>Opis znamenitosti</Text>
      <TextInput
        style={styles.input}
        value={monumentDescription}
        placeholder="Opis znamenitosti"
        onChangeText={text => setMonumentDescription(text)}
      />

      <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}> {selectedCoordinates ?
             `Koordinate: ${selectedCoordinates.latitude}, ${selectedCoordinates.longitude}` 
             : "Lokacija znamenitosti še ni določena"}
            </Text>
          </View>
      </View> 

      

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Lokacija znamenitosti</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSaveMonument} style={styles.button}>
        <Text style={styles.buttonText}>Dodaj znamenitost</Text>
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
            placeholder="Naslov"
            value={address}
            onChangeText={text => setAddress(text)}
          />

          <TouchableOpacity onPress={onSearchAddress} style={styles.button}>
            <Text style={styles.buttonText}>Išči</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
            <Text style={styles.buttonText}>Dodaj</Text>
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

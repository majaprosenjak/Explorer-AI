import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig'; 

const EditRoute = ({ visible, onClose, selectedRoute }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    console.log(selectedRoute?.id);

    if (selectedRoute) {
      setName(selectedRoute.name || '');
      setDuration(selectedRoute.duration || '');
      setDescription(selectedRoute.description || '');
      setTags(selectedRoute.tags ? selectedRoute.tags.join(", ") : '');
    }
  }, [selectedRoute]);

  const handleSave = async () => {
    if (!selectedRoute) {
      return;
    }

    const tagsArray = tags.split(',').map(tag => tag.trim());
    const updatedRoute = {
      name,
      duration,
      description,
      tags: tagsArray,
    };

    try {
      const routeDocRef = doc(firestore, "routes", selectedRoute.id);
      await updateDoc(routeDocRef, updatedRoute);
      console.log('Updated Route:', updatedRoute);
      onClose();
      Alert.alert( "Uspešno ste posodobili pot.");
    } catch (e) {
      Alert.alert("Napaka", "Prišlo je do napake. Poskusite ponovno.");
      console.error('Error updating the route', e);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Urejanje poti</Text>
          <ScrollView style={styles.container}>
            <Text>Ime poti</Text>
            <TextInput
              style={styles.input}
              value={name}
              placeholder="Ime poti"
              onChangeText={text => setName(text)}
            />
            <Text>Trajanje poti</Text>
            <TextInput
              style={styles.input}
              value={duration}
              placeholder="Trajanje poti"
              onChangeText={text => setDuration(text)}
            />
            <Text>Opis poti</Text>
            <TextInput
              style={styles.input}
              value={description}
              placeholder="Opis poti"
              onChangeText={text => setDescription(text)}
            />
            <Text>Oznake</Text>
            <TextInput
              style={styles.input}
              value={tags}
              placeholder="Oznake"
              onChangeText={text => setTags(text)}
            />
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={handleSave}>
            <Text style={styles.closeButtonText}>Shrani spremembe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Zapri</Text>
          </TouchableOpacity>
        </View>
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
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  container: {
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    marginTop: 5,
  },
});

export default EditRoute;

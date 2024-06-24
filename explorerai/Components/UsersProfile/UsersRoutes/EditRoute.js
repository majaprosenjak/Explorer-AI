import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { useTranslation } from 'react-i18next';


const EditRoute = ({ visible, onClose, selectedRoute }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const { t } = useTranslation(); 


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
      Alert.alert(t('ur-routeUpdateSuccess'));
    } catch (e) {
      Alert.alert(t('ur-routeUpdateError'));
      console.error('Error updating the route', e);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{t('ur-editRoute')}</Text>
          <ScrollView style={styles.container}>
            <Text>{t('addName')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              placeholder={t('addName')}
              onChangeText={text => setName(text)}
            />
            <Text>{t('addDuration')}</Text>
            <TextInput
              style={styles.input}
              value={duration}
              placeholder={t('addDuration')}
              onChangeText={text => setDuration(text)}
            />
            <Text>{t('addDesc')}</Text>
            <TextInput
              style={styles.input}
              value={description}
              placeholder={t('addDesc')}
              onChangeText={text => setDescription(text)}
            />
            <Text>{t('addTags')}</Text>
            <TextInput
              style={styles.input}
              value={tags}
              placeholder={t('addTags')}
              onChangeText={text => setTags(text)}
            />
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>{t('ur-saveChanges')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>{t('ur-close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
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
    backgroundColor: 'white',
    borderColor: '#2196F3', 
    borderWidth: 1.5,
    borderRadius: 8,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  closeButtonText: {
    color: 'black',
    textTransform: 'uppercase',
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

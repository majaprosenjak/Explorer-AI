import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Modal, Alert, TouchableOpacity } from 'react-native';
import { Divider, Avatar } from 'react-native-paper';
import { firestore } from "../../firebaseConfig";
import { collection, addDoc, query, where, getDocs, updateDoc, arrayUnion, doc } from "firebase/firestore"; 
import { useUser } from '../UserContext'; 
import { useTranslation } from "react-i18next";

const RouteInputPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [tagsArray, setTagsArray] = useState([]);
  const [monuments, setMonuments] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const { user } = useUser();
  const { t } = useTranslation();

  const onNextPress = () => {
    navigation.navigate(t('addMonument'), {
      name, duration, description, tagsArray, published, admin, monuments, updateMonuments
    });
  };

  const onSaveRoute = async () => {
    setConfirmModalVisible(false);
    const routeData = {
      name,
      duration,
      description,
      tags: tagsArray,
      published, 
      admin,
      walkedCounter: 0,
    };
  
    try {
      const routeDocRef = await addDoc(collection(firestore, "routes"), routeData);
      const routeId = routeDocRef.id;

      const userQuery = query(collection(firestore, "users"), where("email", "==", user));
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0];
        const userId = userDoc.id;

        const routeRef = doc(firestore, "routes", routeId);
        await updateDoc(userDoc.ref, { routesCreated: arrayUnion(routeRef) });

        console.log('Route added to user:', userId);
      } else {
        console.log('User not found', currentUser.email);
      }
  
      for (const monument of monuments) {
        await addDoc(collection(routeDocRef, "monuments"), monument);
        console.log('Monument:', monument);
      }
  
      setSuccessModalVisible(true);
    } catch (e) {
      Alert.alert("Error", "Error adding new route. Please try again.");
      console.log('Error adding route: ', e);
    }
  };

  const updateMonuments = (updatedMonuments) => {
    setMonuments(updatedMonuments);
  };

  const onConfirmSaveRoute = () => {
    setConfirmModalVisible(true);
  };

  const onSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigation.navigate(t('up-userRoutes'));
  };

  const onAddTag = () => {
    if (tags.trim() !== '') {
      setTagsArray([...tagsArray, tags.trim()]);
      setTags('');
    }
  };

  return (
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
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {tagsArray.map((tag, index) => (
          <TouchableOpacity key={index} style={styles.tagContainer}>
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={tags}
        placeholder={t('addTags')}
        onChangeText={text => setTags(text)}
        onSubmitEditing={onAddTag}
      />
      <Divider style={{ height: 1 }} />
      <Text style={{ marginTop: 10, marginBottom: 10 }}>{t('addMon')}</Text>

      {monuments.length === 0 ? (
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={{ color: '#ccc' }}>{t('addNoMon')}</Text>
          </View>
        </View>
      ) : (
        monuments.map((monument, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <Avatar.Icon icon="map-marker" style={styles.avatar} backgroundColor="#2196F3" size={40} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{monument.name}</Text>
                <Text style={styles.description}>{monument.description}</Text>
              </View>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity onPress={onNextPress} style={styles.button}>
        <Text style={styles.buttonText}>{t('addAddMon')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onConfirmSaveRoute} style={styles.buttonShrani}>
        <Text style={styles.buttonText}>{t('addSaveRoute')}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>{t('addConfirm')}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={onSaveRoute} style={styles.button}>
                <Text style={styles.buttonText}>{t('addYes')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setConfirmModalVisible(false)} style={styles.buttonNe}>
                <Text style={styles.buttonTextNe}>{t('addNo')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={onSuccessModalClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>{t('addSuccess')}</Text>
            <TouchableOpacity onPress={onSuccessModalClose} style={styles.button}>
              <Text style={styles.buttonText}>{t('addToRoutes')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  buttonShrani: {
    margin: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginBottom: 30
  },
  buttonNe: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#2196F3',
    borderWidth: 1.5,
  },
  buttonTextNe: {
    color: 'black',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    marginTop: 5,
  },
  card: {
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    margin: 5,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    textTransform: 'uppercase',
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
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

export default RouteInputPage;

import React, { useState } from 'react';
import { StyleSheet, View, Alert, Text, TouchableOpacity, Button, Modal, FlatList } from 'react-native';
import i18next, { languageResources } from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import languagesList from '../../services/languagesList.json';
import { changeLanguage } from 'i18next';

const HomePage = () => {

  const [visible, setVisible] = useState(false);
  const {t} = useTranslation();

  const changeLang = (lang) => {
    i18next.changeLanguage(lang);
    setVisible(false);
  }

    return (
      <View style={styles.container}>
        <Modal visible={visible} onRequestClose={() => setVisible(false)}>
          <View style={styles.languageList}>
            <FlatList data={Object.keys(languageResources)} renderItem={({item}) => 
            <TouchableOpacity style={styles.languageButton} onPress={() => changeLang(item)}>
              <Text style={styles.languageName}>{languagesList[item].nativeName}</Text>
            </TouchableOpacity>}/>
          </View>
        </Modal>
        <Text>{t('welcome')}</Text>
        <Button style={styles.changeLanguageButton} title={t('change-language')} onPress={() => setVisible(true)} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#EDF5FC',
      alignItems: "center",
      justifyContent: "center", //spremeni na "top"
    },
    map: {
      width: '100%',
      height: '100%',
    },
    languageList: {
      flex: 1,
      justifyContent: "center",
      padding: 10,
      backgroundColor: "#6258e8",
    },
    changeLanguageButton: {
      padding: 10,
    },
    languageButton: {
      padding: 10,
      borderBottomColor: "#dddddd",
      borderBottomWidth: 1,
    },
    languageName: {
      fontSize: 16,
      color: "white",
    },
  });
  
  export default HomePage;
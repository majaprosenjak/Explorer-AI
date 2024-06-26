import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import MapPage from './Components/Routes/MapPage';
import ProfilePage from './Components/UsersProfile/ProfilePage';
import HomePage from './Components/Home/HomePage';
import UserStatistics from './Components/UsersProfile/UserStatistics/UserStatistics';
import TextDetectionComponent from './Components/UsersProfile/TextTranslation/TextTranslationPage';
import AddRoutePage from './Components/UsersProfile/AddRoute/AddRoutePage';
import UserRoutesPage from './Components/UsersProfile/UsersRoutes/UserRoutesPage';
import RoutesPage from './Components/Routes/RoutesPage';
import { UserProvider } from './Components/UsersProfile/UserContext';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Portal, Provider } from 'react-native-paper';
import i18next from 'i18next';
import languagesList from './services/languagesList.json';
import { languageResources } from './services/i18next';
import Quiz from './Components/Home/Quiz';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function App() {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const changeLang = (lang) => {
    i18next.changeLanguage(lang);
    closeModal();
  };

  const HeaderButton = ({ openModal }) => (
    <Button style={styles.languageBtn} onPress={openModal} labelStyle={styles.buttonLabel}>{t('change-language')}</Button>
  );

  const LanguageModal = ({ visible, onClose, changeLang }) => (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <FlatList
        data={Object.keys(languageResources)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.languageButton} onPress={() => changeLang(item)}>
            <Text style={styles.languageName}>{languagesList[item].nativeName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
      />
    </Modal>
  );

  return (
    <Provider>
      <UserProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ navigation }) => ({
              headerRight: () => <HeaderButton openModal={openModal} />
            })}
          >
            <Tab.Screen name="ExplorerAI">
              {() => (
                <SettingsStack.Navigator>
                  <SettingsStack.Screen name={t('home-page')} component={HomePage} options={{ headerShown: false }} />
                  <SettingsStack.Screen name={t('quiz-page')} component={Quiz} options={{ headerShown: false }} />
                </SettingsStack.Navigator>
              )}
            </Tab.Screen>
            <Tab.Screen name={t('routes')}>
              {() => (
                <HomeStack.Navigator>
                  <HomeStack.Screen name={"routes-page"} component={RoutesPage} options={{ headerShown: false }} />
                  <HomeStack.Screen name={t('monuments-map')} component={MapPage} options={{ headerShown: false }} />
                </HomeStack.Navigator>
              )}
            </Tab.Screen>
            <Tab.Screen name={t('profile')} options={{ headerShown: false }}>
              {() => (
                <ProfileStack.Navigator>
                  <ProfileStack.Screen name={t('user-profile')} component={ProfilePage} />
                  <ProfileStack.Screen name={t('up-statistics')} component={UserStatistics} />
                  <ProfileStack.Screen name={t('up-addRoute')} component={AddRoutePage} />
                  <ProfileStack.Screen name={t('up-userRoutes')} component={UserRoutesPage} />
                  <ProfileStack.Screen name={t('up-translate')} component={TextDetectionComponent} />
                </ProfileStack.Navigator>
              )}
            </Tab.Screen>
          </Tab.Navigator>
          <Portal>
            <LanguageModal visible={isModalVisible} onClose={closeModal} changeLang={changeLang} />
          </Portal>
        </NavigationContainer>
      </UserProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF5FC",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  languageName: {
    fontSize: 16,
  },
  buttonLabel: {
    color: 'black',
    backgroundColor: "white",
    padding: 8,
    borderRadius: 10,
  },
});

export default App;

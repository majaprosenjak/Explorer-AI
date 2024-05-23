import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import MapPage from './Components/MapPage';
import ProfilePage from './Components/UsersProfile/ProfilePage';
import HomePage from './Components/Home/HomePage';
import UserStatistics from './Components/UsersProfile/UserStatistics/UserStatistics';
import TextDetectionComponent from './Components/UsersProfile/TextTranslation/TextTranslationPage';
import AddRoutePage from './Components/UsersProfile/AddRoute/AddRoutePage';
import UserRoutesPage from './Components/UsersProfile/UsersRoutes/UserRoutesPage';
import { UserProvider } from './Components/UsersProfile/UserContext';  

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator(); 

function App() {

  const {t} = useTranslation();

    return (
      <UserProvider>  
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="ExplorerAI">
              {() => (
                <SettingsStack.Navigator>
                  <SettingsStack.Screen name="Domača stran" component={HomePage} />
                </SettingsStack.Navigator>
              )}
            </Tab.Screen>
            <Tab.Screen name="Poti">
              {() => (
                <HomeStack.Navigator>
                  <HomeStack.Screen name="Zemljevid atrakcij" component={MapPage} />
                </HomeStack.Navigator>
              )}
            </Tab.Screen>
            <Tab.Screen name="Profil">
              {() => (
                <ProfileStack.Navigator>
                  <ProfileStack.Screen name="Profil uporabnika" component={ProfilePage} />
                  <ProfileStack.Screen name="Statistika" component={UserStatistics} />
                  <ProfileStack.Screen name="Dodaj pot" component={AddRoutePage} />
                  <ProfileStack.Screen name="Uporabnikove poti" component={UserRoutesPage} />
                  <ProfileStack.Screen name="Prevod" component={TextDetectionComponent} />
                </ProfileStack.Navigator>
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </UserProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EDF5FC",
        alignItems: "center",
        justifyContent: "center",
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
        backgroundColor: '#B8C5D6',
    },
    footerButton: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    footerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default App;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import MapPage from './Components/Routes/MapPage';
import ProfilePage from './Components/UsersProfile/ProfilePage';
import HomePage from './Components/Home/HomePage';
import UserStatistics from './Components/UsersProfile/UserStatistics/UserStatistics';
import TextDetectionComponent from './Components/UsersProfile/TextTranslation/TextTranslationPage';
import AddRoutePage from './Components/UsersProfile/AddRoute/AddRoutePage';
import UserRoutesPage from './Components/UsersProfile/UsersRoutes/UserRoutesPage';
import RoutesPage from './Components/Routes/RoutesPage'
import { UserProvider } from './Components/UsersProfile/UserContext';  
import { useTranslation } from 'react-i18next';

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
                  <SettingsStack.Screen name={t('home-page')} component={HomePage} options={{ headerShown: false }} />
                </SettingsStack.Navigator>
              )}
            </Tab.Screen>
            <Tab.Screen name={t('routes')} >
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
                  <ProfileStack.Screen name={t('up-addRoute')}  component={AddRoutePage} />
                  <ProfileStack.Screen name={t('up-userRoutes')} component={UserRoutesPage} />
                  <ProfileStack.Screen name={t('up-translate')} component={TextDetectionComponent} />
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

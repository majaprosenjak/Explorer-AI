import { registerRootComponent } from 'expo';
import React, { useState } from "react";
import { StyleSheet, View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import MapPage from './Components/MapPage';
import {  getAuth, signOut } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfilePage from './Components/ProfilePage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './Components/Home/HomePage';
import { useTranslation } from 'react-i18next';

const auth = getAuth();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

function App() {

  const {t} = useTranslation();

    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="ExplorerAI">
            {() => (
              <SettingsStack.Navigator>
                <SettingsStack.Screen name={t('home-page')} component={HomePage} />
              </SettingsStack.Navigator>
            )}
          </Tab.Screen>
          <Tab.Screen name="Poti">
            {() => (
              <HomeStack.Navigator>
                <HomeStack.Screen name={t('monuments-map')} component={MapPage} />
              </HomeStack.Navigator>
            )}
          </Tab.Screen>
          <Tab.Screen name="Profil">
            {() => (
              <HomeStack.Navigator>
                <HomeStack.Screen name="Profil Uporabnika" component={ProfilePage} />
                <HomeStack.Screen name="Map" component={MapPage} />
              </HomeStack.Navigator>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
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

//registerRootComponent(App);
export default App;
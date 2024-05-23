import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RouteInputPage from './RouteInputPage'; 
import MonumentInputPage from './MonumentInputPage';  

const Stack = createStackNavigator();

const AddRoutePage = () => {
  return (
    <Stack.Navigator initialRouteName="Vnos poti">
      <Stack.Screen name="Vnos poti" component={RouteInputPage} />
      <Stack.Screen name="Vnos znamenitosti" component={MonumentInputPage} />
    </Stack.Navigator>
  );
};

export default AddRoutePage;

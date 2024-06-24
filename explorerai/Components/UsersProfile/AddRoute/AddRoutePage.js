import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RouteInputPage from './RouteInputPage'; 
import MonumentInputPage from './MonumentInputPage';  
import { useTranslation } from 'react-i18next';


const Stack = createStackNavigator();

const AddRoutePage = () => {
  const { t } = useTranslation(); 

  return (
    <Stack.Navigator initialRouteName="Vnos poti">
      <Stack.Screen name={t('addRoute')} component={RouteInputPage} options={{ headerShown: false }} />
      <Stack.Screen name={t('addMonument')} component={MonumentInputPage}  />
    </Stack.Navigator>
  );
};

export default AddRoutePage;

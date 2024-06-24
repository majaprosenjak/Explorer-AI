import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig'; 
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import RoutesDrafts from './RoutesDrafts'; 
import RoutesPublished from "./RoutesPublished";
import { useUser } from '../UserContext'; 
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');

const UserRoutesPage = () => {
  
  const { t } = useTranslation(); 

  const { user } = useUser();
  const [routesCreated, setRoutesCreated] = useState([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'osnutki', title: t('ur-drafts') },
    { key: 'objavljene', title: t('ur-published') },
  ]);




  useEffect(() => {
    const fetchRoutesCreated = async () => {
      try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', user));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
          console.log('No user found with the specified email.');
          return;
        }
    
        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;
        const userData = userDoc.data();
        
        const routesRefs = userData.routesCreated || [];
    
        const routes = [];
        for (const routeRef of routesRefs) {
          const routeDoc = await getDoc(routeRef);
          if (routeDoc.exists()) {
            const routeData = routeDoc.data();
            const routeId = routeDoc.id; 
    
            const monumentsRef = collection(routeRef, 'monuments');
            const monumentsSnapshot = await getDocs(monumentsRef);
            const monuments = monumentsSnapshot.docs.map(doc => {
              const monumentId = doc.id; 
              return { id: monumentId, ...doc.data() }; 
            });
    
            routes.push({ id: routeId, ...routeData, monuments });
          }
        }
    
        setRoutesCreated(routes);
      } catch (error) {
        console.error('Error fetching routes created:', error);
      }
    };
    
    fetchRoutesCreated();
    
  }, []);

  const draftsRoute = () => (
    <RoutesDrafts routesCreated={routesCreated} user={user} />
  );

  const publishedRoute = () => (
    <ScrollView style={styles.container}>
    <RoutesPublished routesCreated={routesCreated} />
    </ScrollView>
  );

  const renderScene = SceneMap({
    osnutki: draftsRoute,
    objavljene: publishedRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: screenWidth }}
      renderTabBar={props => (
        <TabBar
          {...props}
          style={{ backgroundColor: '#2196F3' }}
          indicatorStyle={{ backgroundColor: 'white' }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5FC',
    padding: 20,
  }
});

export default UserRoutesPage;

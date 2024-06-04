import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig'; 
import RoutePieChart from './RoutePieChart';
import RouteLineChart from './RouteLineChart';
import RouteBarChart from './RouteBarChart';
import { useUser } from '../UserContext'; 


const UserStatistics = () => {
  const [routesWalked, setRoutesWalked] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchRoutesWalked = async () => {
      try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', user));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log('User not found');
          return;
        }

        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;

        const routesWalkedRef = collection(firestore, 'users', userId, 'routesWalked');
        const routesSnapshot = await getDocs(routesWalkedRef);

        if (routesSnapshot.empty) {
          return;
        }

        const routesList = [];

        for (const doc of routesSnapshot.docs) {
          const routeWalkedData = doc.data();
          const routeRef = routeWalkedData.route;

          if (routeRef) {
            const routeDocSnapshot = await getDoc(routeRef);
            const routeDocData = routeDocSnapshot.data();

            if (routeDocData) {
              routesList.push({
                id: doc.id,
                ...routeWalkedData,
                routeDetails: routeDocData,
              });
            } else {
              console.log('Does not exist:', routeRef.path);
            }
          } else {
            console.log('Route reference missing');
          }
        }

        setRoutesWalked(routesList);
      } catch (e) {
        console.log(e);
      }
    };

    fetchRoutesWalked();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardHeading}>
        <Text style={styles.heading}>Letna statistika</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.yearlyText}>Število prehojenih po mesecih</Text>
        <RouteLineChart data={routesWalked} />
      </View>

      <View style={styles.card}>
        <Text style={styles.yearlyText}>Različne poti, ki ste jih prehodili</Text>
        <RoutePieChart data={routesWalked} />
      </View>

      <View style={styles.card}>
        <Text style={styles.yearlyText}>Število minut, ki ste jih porabili za hojo po poteh po mesecih</Text>
        <RouteBarChart data={routesWalked} />
      </View>

      
      
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 30,
  },
  cardHeading: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  yearlyText: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  heading: {
    textTransform: 'uppercase',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',


  }
});

export default UserStatistics;

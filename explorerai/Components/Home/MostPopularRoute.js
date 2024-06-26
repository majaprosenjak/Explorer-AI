import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from "../firebaseConfig";

const windowWidth = Dimensions.get('window').width;

const MostPopularRoute = () => {
  const [routes, setRoutes] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routesRef = collection(firestore, 'routes');
        const querySnapshot = await getDocs(routesRef);
  
        if (querySnapshot.empty) {
          console.log('No routes available.');
          return;
        }
  
        const fetchedRoutes = [];
        querySnapshot.forEach(doc => {
          const routeData = { id: doc.id, ...doc.data() };
          fetchedRoutes.push(routeData);
        });
  
        setRoutes(fetchedRoutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };
  
    fetchRoutes();
  }, []);

  const findMostPopularRoute = () => {
    let maxWalkedCounter = -1;
    let mostPopularRoute = null;
  
    routes.forEach(route => {
      if (route.walkedCounter > maxWalkedCounter) {
        maxWalkedCounter = route.walkedCounter;
        mostPopularRoute = route;
      }
    });
  
    return mostPopularRoute;
  };
  
  const mostPopularRoute = findMostPopularRoute();

  return (
    <View style={styles.container}>
      <View style={styles.titleCard}>
        <Text style={styles.headerText}>Naši uporabniki vedo, kaj je najboljše</Text>
        <Text style={styles.subHeaderText}>Preveri pot, ki je na naši strani NAJPOPULARNEJŠA</Text>
      </View>
      <ScrollView>
        {mostPopularRoute && (
          <View style={styles.card}>
            <Text style={styles.routeName}>{mostPopularRoute.name}</Text>
            <Text style={styles.routeDescription}>{mostPopularRoute.description}</Text>
            <Text style={styles.routeInfo}>Trajanje: {mostPopularRoute.duration}</Text>
            <Text style={styles.routeInfo}>Znamenitosti: {mostPopularRoute.monuments ? mostPopularRoute.monuments.length : 0}</Text>
            <Text style={styles.popularTag}>Najpopularnejša </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  titleCard: {
    backgroundColor: '#dcedfc',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    width: windowWidth-40,
    alignSelf: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  routeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  routeInfo: {
    fontSize: 12,
    color: '#888',
  },
  seasonalBadge: {
    fontSize: 12,
    color: '#ff9900',
    marginTop: 5,
  },
  popularTag: {
    top: 10,
    right: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 8,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
});

export default MostPopularRoute;

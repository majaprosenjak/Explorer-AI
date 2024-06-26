import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from "../firebaseConfig";

const SeasonalRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRoutesSeasonal = async () => {
      try {
        const routesRef = collection(firestore, 'routes');
        const q = query(routesRef, where('seasonal', '==', true));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log('No routes available.');
          return;
        }

        const fetchedRoutes = [];
        for (const doc of querySnapshot.docs) {
          const routeData = { id: doc.id, ...doc.data() };
          const monumentsSnapshot = await getDocs(collection(firestore, `routes/${doc.id}/monuments`));
          routeData.monuments = monumentsSnapshot.docs.map(monumentDoc => monumentDoc.data());
          fetchedRoutes.push(routeData);
        }

        setRoutes(fetchedRoutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };
    fetchRoutesSeasonal();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.cardTitle}>
            <Text style={styles.headerText}>Trenutno popularno - Sezonske Poti!</Text>
            <Text style={styles.subHeaderText}>Pohiti, te poti so aktivne le določen čas!</Text>
        </View>
        <ScrollView>
          {routes.map(route => (
            <View key={route.id} style={styles.card}>
              <Text style={styles.routeName}>{route.name}</Text>
              <Text style={styles.routeDescription}>{route.description}</Text>
              <Text style={styles.routeInfo}>Trajanje: {route.duration}</Text>
              <Text style={styles.routeInfo}>Znamenitosti: {route.monuments ? route.monuments.length : 0}</Text>
              <Text style={styles.seasonalBadge}>Aktivna do: {route.seasonalTo}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: '#EDF5FC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
    position: 'relative',
    marginBottom: 10,
  },
  cardTitle: {
    backgroundColor: '#dcedfc',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    position: 'relative',
    marginBottom: 10,
  },
  seasonalBadge: {
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 8,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
});

export default SeasonalRoutes;

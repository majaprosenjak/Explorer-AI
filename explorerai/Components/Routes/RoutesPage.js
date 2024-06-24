import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Button } from 'react-native';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';
import { firestore } from "../firebaseConfig";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [expandedRoute, setExpandedRoute] = useState(null); 

  const {t} = useTranslation();

  useEffect(() => {
    const fetchRoutesPublished = async () => {
      try {
        const routesRef = collection(firestore, 'routes');
        const q = query(routesRef, where('published', '==', true));
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

    fetchRoutesPublished();
  }, []);

  const navigation = useNavigation(); 

  const toggleExpand = (routeId) => {
    if (expandedRoute === routeId) {
      setExpandedRoute(null); 
    } else {
      setExpandedRoute(routeId); 
    }
  };

  const handleStartRoute = (route) => {
    navigation.navigate(t('monuments-map'), { route });
  };

  const renderMonumentsList = (monuments, route) => {
    return (
      <View style={styles.monumentsContainer}>
        <Text style={styles.monumentsHeader}>Monuments</Text>
        {monuments.map((monument, index) => (
          <View key={index} style={styles.monumentItem}>
            <Text style={styles.monumentName}>{monument.name}</Text>
            <Text style={styles.monumentDescription}>
              {truncateDescription(monument.description)}
            </Text>
          </View>
        ))}

        <Button
          title="Start"
          onPress={() => handleStartRoute(route)}
        />
      </View>
    );
  };

  const truncateDescription = (description) => {
    const maxLength = 100; 
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };

  return (
    <ScrollView style={styles.container}>
      {routes.map(route => (
        <TouchableOpacity
          key={route.id}
          style={[styles.card, expandedRoute === route.id && styles.expandedCard]}
          onPress={() => toggleExpand(route.id)}
          activeOpacity={0.8}
        >
          {route.seasonal && (
            <View style={styles.seasonalBadge}>
              <Text style={styles.publicText}>Seasonal</Text>
            </View>
          )}
          {route.published && !route.seasonal && (
            <View style={styles.publicBadge}>
              <Text style={styles.publicText}>Public</Text>
            </View>
          )}
          <Text style={styles.name}>{route.name}</Text>
          <Text style={styles.description}>{route.description}</Text>
          <Text style={styles.info}>Duration: {route.duration}</Text>
          <Text style={styles.info}>Monuments: {route.monuments ? route.monuments.length : 0}</Text>
          
          {expandedRoute === route.id && route.monuments && route.monuments.length > 0 && (
            renderMonumentsList(route.monuments, route)
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5FC',
    padding: 10,
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
  },
  expandedCard: {
    paddingBottom: 20, 
  },
  publicBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  seasonalBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#de8c06',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  publicText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  info: {
    fontSize: 12,
    color: '#888',
  },
  monumentsContainer: {
    marginTop: 10,
  },
  monumentsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  monumentItem: {
    marginBottom: 10,
  },
  monumentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  monumentDescription: {
    fontSize: 14,
    color: '#888',
  },
});

export default RoutesPage;

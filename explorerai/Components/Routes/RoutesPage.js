import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from "../firebaseConfig";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [expandedRoute, setExpandedRoute] = useState(null);
  const isFocused = useIsFocused(); 

  const { t } = useTranslation();

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
  }, [isFocused]);

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

  const isWithinSeasonalDates = (seasonalFrom, seasonalTo) => {
    const currentDate = new Date();
    const fromDate = new Date(seasonalFrom);
    const toDate = new Date(seasonalTo);
    return currentDate >= fromDate && currentDate <= toDate;
  };

  const renderMonumentsList = (monuments, route) => {
    const canStart = !route.seasonal || isWithinSeasonalDates(route.seasonalFrom, route.seasonalTo);

    return (
      <View style={styles.monumentsContainer}>
        <Text style={styles.monumentsHeader}>Monuments:</Text>
        {monuments.map((monument, index) => (
          <View key={index} style={styles.monumentItem}>
            <Text style={styles.monumentName}>{monument.name}</Text>
            <Text style={styles.monumentDescription}>
              {truncateDescription(monument.description)}
            </Text>
          </View>
        ))}

        {canStart ? (
          <Pressable
            style={styles.startButton} 
            onPress={() => handleStartRoute(route)}
          >
            <Text style={styles.startButtonText}>Start</Text>
          </Pressable>
        ) : (
          <Text style={styles.notAvailableText}>This route is not currently available.</Text>
        )}
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
      {routes.map((route, index) => (
        <TouchableOpacity
          key={route.id}
          style={[
            styles.card, 
            expandedRoute === route.id && styles.expandedCard,
            index === routes.length - 1 && styles.lastCard 
          ]}
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
          <Text style={styles.info}>Walked: {route.walkedCounter}</Text>
          {route.seasonal && (
            <View>
              <Text style={styles.info}>Seasonal from: {route.seasonalFrom}</Text>
              <Text style={styles.info}>Seasonal to: {route.seasonalTo}</Text>
            </View>
          )}
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
  lastCard: {
    marginBottom: 40, 
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
  notAvailableText: {
    color: '#b32727', 
    fontWeight: 'bold',
    marginTop: 10,
  },
  startButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoutesPage;

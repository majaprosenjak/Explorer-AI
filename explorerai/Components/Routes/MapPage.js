import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, ScrollView, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { FontAwesome } from '@expo/vector-icons';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { firestore } from "../firebaseConfig";
import { API_KEY_GOOGLE_MAPS } from '@env';
import { useTranslation } from 'react-i18next';

const INITIAL_REGION = {
  latitude: 46.5547,
  longitude: 15.6459,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const GOOGLE_MAPS_APIKEY = API_KEY_GOOGLE_MAPS;

const MapPage = ({ route, navigation }) => {

  const { t } = useTranslation();

  const routeDetails = route?.params?.route || {};
  const monuments = routeDetails.monuments || [];
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useState(new Animated.Value(60))[0];

  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    calculateTotalDuration();

    timerRef.current = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [monuments]);

  const calculateTotalDuration = async () => {
    if (monuments.length < 2) {
      return;
    }

    let origin = monuments[0];
    let duration = 0;
    let distance = 0;

    for (let i = 1; i < monuments.length; i++) {
      const destination = monuments[i];

      if (origin.coordinates.latitude && origin.coordinates.longitude && destination.coordinates.latitude && destination.coordinates.longitude) {
        try {
          const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.coordinates.latitude},${origin.coordinates.longitude}&destination=${destination.coordinates.latitude},${destination.coordinates.longitude}&mode=walking&key=${GOOGLE_MAPS_APIKEY}`;
          const response = await fetch(url);
          const data = await response.json();

          if (data.routes && data.routes.length > 0 && data.routes[0].legs && data.routes[0].legs.length > 0) {
            duration += data.routes[0].legs[0].duration.value;
            distance += data.routes[0].legs[0].distance.value;
          } else {
            console.error('No route found:', data);
          }

          origin = destination;
        } catch (error) {
          console.error('Error fetching directions:', error);
        }
      }
    }
    setTotalDistance(distance);
    setTotalDuration(duration);
  };

  const toggleExpand = () => {
    if (expanded) {
      Animated.timing(animatedHeight, {
        toValue: 60,
        duration: 300,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 600, 
        duration: 300,
        useNativeDriver: false
      }).start();
    }
    setExpanded(!expanded);
  };

  const finishWalking = async () => {
    clearInterval(timerRef.current);
    const walkingTime = timer;

    try {
      const routeDocRef = doc(firestore, "routes", routeDetails.id);
      await updateDoc(routeDocRef, { walkedCounter: increment(1) });

      Alert.alert(
        t('congratulations'),
        `${t("route-finish-message")} ${Math.floor(walkingTime / 60)} min ${walkingTime % 60} s`,
        //`You have completed the walk.\nTotal walking time: ${Math.floor(walkingTime / 60)} min ${walkingTime % 60} sec`,
        [
          { text: 'OK', onPress: () => navigation.navigate("routes-page") },
        ]
      );
    } catch (error) {
      console.error('Error updating walkedCounter:', error);
    }
  };

  const CustomMarker = ({ number }) => (
    <Svg height={50} width={30} viewBox="0 0 24 30">
      <Path
        d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 18 12 18s12-9.6 12-18c0-6.6-5.4-12-12-12zm0 16.8c-2.6 0-4.8-2.2-4.8-4.8S9.4 7.2 12 7.2 16.8 9.4 16.8 12s-2.2 4.8-4.8 4.8z"
        fill="#FF0000"
      />
      <Circle cx="12" cy="12" r="8" fill="white" />
      <SvgText
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="black"
      >
        {number}
      </SvgText>
    </Svg>
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {monuments.map((monument, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: monument.coordinates.latitude, longitude: monument.coordinates.longitude }}
            onPress={() => Alert.alert(monument.name, monument.description)}
          >
            <CustomMarker number={index + 1} />
          </Marker>
        ))}
        {monuments.length > 1 && monuments.map((monument, index) => (
          index < monuments.length - 1 && (
            <MapViewDirections
              key={index}
              origin={{
                latitude: monument.coordinates.latitude,
                longitude: monument.coordinates.longitude
              }}
              destination={{
                latitude: monuments[index + 1].coordinates.latitude,
                longitude: monuments[index + 1].coordinates.longitude
              }}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={5}
              strokeColor="#007AFF"
              mode="WALKING"
            />
          )
        ))}
      </MapView>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("monuments")}</Text>
          <Text style={styles.cardNumber}>{monuments.length}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("walking-duration")}</Text>
          <Text style={styles.cardNumber}>{Math.ceil(totalDuration / 60)} min</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("total-distance")}</Text>
          <Text style={styles.cardNumber}>{Math.ceil(totalDistance / 1000)} km</Text>
        </View>
      </View>

      <Animated.View style={[styles.expandingCard, { height: animatedHeight }]}>
        <TouchableOpacity style={styles.expandingHeader} onPress={toggleExpand}>
          <Text style={styles.routeTitle}>{routeDetails.name}</Text>
          <FontAwesome name={expanded ? 'chevron-up' : 'chevron-down'} size={24} color="black" />
        </TouchableOpacity>
        {expanded && (
          <ScrollView style={styles.expandingContent}>
            <Text style={styles.description}>{routeDetails.description}</Text>
            <View style={styles.tagsContainer}>
              {routeDetails.tags && routeDetails.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>#{tag}</Text>
              ))}
            </View>
            {monuments.map((monument, index) => (
              <View key={index} style={styles.monumentItem}>
                <Text style={styles.monumentName}>{monument.name}</Text>
                <Text style={styles.monumentDescription}>{monument.description}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </Animated.View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`}</Text>
        <TouchableOpacity style={styles.finishButton} onPress={finishWalking}>
          <Text style={styles.finishButtonText}>{t("finish")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5FC',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  cardsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    color: '#333',
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  expandingCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  expandingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  expandingContent: {
    marginTop: 10,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 14,
    color: '#007BFF',
    marginRight: 5,
  },
  monumentItem: {
    marginBottom: 10,
  },
  monumentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  monumentDescription: {
    fontSize: 14,
    color: '#666',
  },
  timerContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  finishButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 17,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapPage;

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import SeasonalRoutes from './SeasonalRoutes';
import MostPopularRoute from './MostPopularRoute';

const HomePage = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SeasonalRoutes />

      <View style={styles.card}><Text style={styles.headerText}>Se nemoreš odločiti kakšno pot bi prehodil?</Text>
        <Text style={styles.subHeaderText}>Brez strahu! Pri tem ti lahko pomagamo mi!</Text>
        <Text style={styles.subHeaderText}>Izpolni naš kratek kviz o tem, kaj imaš rad inkako se trenutno počutiš, mi pa ti bomo 
          predlagali kateri tip poti je zatenajbolj primeren.
        </Text>
        <TouchableOpacity style={styles.questionOptionsContainer} onPress={() => navigation.navigate('quiz-page')}>
          <Text style={styles.questionOptions}>Pojdi na kviz</Text>
        </TouchableOpacity>
      </View>

      <MostPopularRoute />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EDF5FC',
    padding: 20,
  },
  textContainer: {
    marginTop: 20,
  },
  subHeaderText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  questionOptionsContainer: {
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: "#007BFF",
    textAlign: "center",
    padding: 5,
    width: 200,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
  },

  questionOptions: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  
  card: {
    backgroundColor: '#dcedfc',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: "center",
  },
});

export default HomePage;
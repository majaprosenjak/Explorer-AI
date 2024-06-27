import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import SeasonalRoutes from './SeasonalRoutes';
import MostPopularRoute from './MostPopularRoute';
import { useTranslation } from 'react-i18next';

const HomePage = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SeasonalRoutes />

      <TouchableOpacity style={styles.navigateBtn} onPress={() => navigation.navigate(t('routes'))}>
          <Text style={styles.NavigateBtnText}>{t("all-routes")}</Text>
      </TouchableOpacity>

      <View style={styles.card}><Text style={styles.headerText}>{t("quiz-promotion-header")}</Text>
        <Text style={styles.subHeaderText}>{t("quiz-promotion-tagline")}</Text>
        <Text style={styles.subHeaderText}>{t("quiz-promotion-description")}</Text>
        <TouchableOpacity style={styles.navigateBtn} onPress={() => navigation.navigate(t('quiz-page'))}>
          <Text style={styles.NavigateBtnText}>{t("quiz-go-to-btn")}</Text>
        </TouchableOpacity>
      </View>

      <MostPopularRoute />

      <TouchableOpacity style={styles.navigateBtn} onPress={() => navigation.navigate(t('routes'))}>
          <Text style={styles.NavigateBtnText}>{t("all-routes")}</Text>
      </TouchableOpacity>
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
  navigateBtn: {
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
  NavigateBtnText: {
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
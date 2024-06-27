import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const RouteBarChart = ({ data }) => {
  const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  const monthlyData = Array(12).fill(0);

  data.forEach(route => {
    if (route.dateWalked && route.walkingTime) {
      const { seconds, nanoseconds } = route.dateWalked;
      const milliseconds = seconds * 1000 + nanoseconds / 1000000;
      const date = new Date(milliseconds);
      const month = date.getMonth(); 
      
      const walkingTimeMinutes = route.walkingTime / 60; 
      monthlyData[month] += walkingTimeMinutes;
    }
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: monthlyData,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 0, 
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForVerticalLabels: {
            fontSize: 12,
          },
          barPercentage: 0.5,
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  chart: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default RouteBarChart;

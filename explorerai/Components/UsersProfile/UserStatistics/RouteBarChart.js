import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const RouteBarChart = ({ data }) => {
  const labels = [
    'J', 'F', 'M', 'A', 'M', 'J',
    'J', 'A', 'S', 'O', 'N', 'D'
  ];

  const monthlyData = labels.reduce((acc, label, index) => {
    acc[index] = 0; 
    return acc;
  }, {});

  data.forEach(route => {
    if (route.started && route.finished) {
      const startDate = new Date(route.started.seconds * 1000 + route.started.nanoseconds / 1000000);
      const month = startDate.getMonth(); 
      const durationMs = route.finished.seconds * 1000 + route.finished.nanoseconds / 1000000 - (route.started.seconds * 1000 + route.started.nanoseconds / 1000000);
      const durationMin = durationMs / (1000 * 60); 
      monthlyData[month] += durationMin;
    }
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: Object.values(monthlyData),
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
          labelColor: (opacity = 0) => `rgba(200, 200, 200, ${opacity})`,
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
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  chart: {
    width:'100%',
    marginVertical: 8,
    borderRadius: 16
  },
});

export default RouteBarChart;

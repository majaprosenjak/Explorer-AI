import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const RouteLineChart = ({ data }) => {
  const monthlyData = data.reduce((acc, route) => {
    if (route.finished && typeof route.finished === 'object' && route.finished.seconds && route.finished.nanoseconds) {
      const timestampMs = route.finished.seconds * 1000 + route.finished.nanoseconds / 1000000;
      const date = new Date(timestampMs);
      const month = date.getMonth();
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {});


  const labels = [
    'J', 'F', 'M', 'A', 'M', 'J',
    'J', 'A', 'S', 'O', 'N', 'D'
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: labels.map((label, index) => monthlyData[index] || 0),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - 15}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: (opacity = 0) => `rgba(200, 200, 200, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "white", 
          }
        }}
        bezier
        style={styles.chart}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default RouteLineChart;

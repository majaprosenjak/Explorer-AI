import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const RouteLineChart = ({ data }) => {
  const monthlyData = Array(12).fill(0);

  data.forEach(route => {
    if (route.dateWalked) {
      const { seconds, nanoseconds } = route.dateWalked;
      const timestampMs = seconds * 1000 + nanoseconds / 1000000;
      const date = new Date(timestampMs);
      const month = date.getMonth();
      monthlyData[month]++;
    }
  });

  const labels = ['J', 'F', 'M', 'A', 'M', 'J','J', 'A', 'S', 'O', 'N', 'D'];

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

import React from 'react';
import { ScrollView, Dimensions, View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const RoutePieChart = ({ data }) => {
  const blueShades = ['#2196F3', '#64B5F6', '#90CAF9', '#BBDEFB', '#E3F2FD'];

  const pieChartData = data.reduce((acc, route, index) => {
    const routeName = route.routeName;
    const existingRoute = acc.find(item => item.name === routeName);

    if (existingRoute) {
      existingRoute.count += 1;
    } else {
      acc.push({ name: routeName, count: 1 });
    }

    return acc;
  }, []).map((item, index) => ({
    name: item.name,
    count: item.count,
    color: blueShades[index % blueShades.length],
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.chart}>
          <PieChart
            data={pieChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend={false}
          />
        </View>

        <View style={styles.legendContainer}>
          {pieChartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    paddingLeft: '40%'
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  legendColorBox: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
});

export default RoutePieChart;

import React from 'react';
import { Avatar, Card, Text, TouchableRipple } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

const LeftContentStatistics = props => <Avatar.Icon {...props} icon="chart-bar" backgroundColor="#2196F3" />
const LeftContentRoute = props => <Avatar.Icon {...props} icon="map-marker" backgroundColor="#2196F3" />
const LeftContentUsersRoutes = props => <Avatar.Icon {...props} icon="format-list-bulleted" backgroundColor="#2196F3" />
const LeftContentTranslate = props => <Avatar.Icon {...props} icon="translate" backgroundColor="#2196F3" />

const ProfileCards = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.row}>
        <Card style={styles.card} onPress={() => navigation.navigate('Statistika')}>
          <Card.Title left={LeftContentStatistics} />
          <Card.Content>
            <Text variant="titleLarge">Statistika uporabe</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate('Dodaj pot')}>
          <Card.Title left={LeftContentRoute} />
          <Card.Content>
            <Text variant="titleLarge">Vnos nove poti</Text>
          </Card.Content>
        </Card>
    </View>
    <View style={styles.row}>
        <Card style={styles.card} onPress={() => navigation.navigate('Uporabnikove poti')}>
          <Card.Title left={LeftContentUsersRoutes} />
          <Card.Content>
            <Text variant="titleLarge">Pregled vaših poti</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate('Prevod')}>
          <Card.Title left={LeftContentTranslate} />
          <Card.Content>
            <Text variant="titleLarge">Prevod</Text>
          </Card.Content>
        </Card>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: '40%',
    marginHorizontal: '5%',
    marginVertical: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileCards;

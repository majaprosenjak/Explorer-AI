import React from 'react';
import { Avatar, Card, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const LeftContentStatistics = props => <Avatar.Icon {...props} icon="chart-bar" backgroundColor="#2196F3" />
const LeftContentRoute = props => <Avatar.Icon {...props} icon="map-marker" backgroundColor="#2196F3" />
const LeftContentUsersRoutes = props => <Avatar.Icon {...props} icon="format-list-bulleted" backgroundColor="#2196F3" />
const LeftContentTranslate = props => <Avatar.Icon {...props} icon="translate" backgroundColor="#2196F3" />

const ProfileCards = ({ navigation }) => {
  const { t } = useTranslation(); 

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Card style={styles.card} onPress={() => navigation.navigate(t('up-statistics'))}>
          <Card.Title left={LeftContentStatistics} />
          <Card.Content>
            <Text variant="titleLarge">{t('cardStatistics')}</Text> 
          </Card.Content>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate(t('up-addRoute'))}>
          <Card.Title left={LeftContentRoute} />
          <Card.Content>
            <Text variant="titleLarge">{t('cardNewRoute')}</Text> 
          </Card.Content>
        </Card>
      </View>
      <View style={styles.row}>
        <Card style={styles.card} onPress={() => navigation.navigate(t('up-userRoutes'))}>
          <Card.Title left={LeftContentUsersRoutes} />
          <Card.Content>
            <Text variant="titleLarge">{t('cardRouteOverview')}</Text> 
          </Card.Content>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate(t('up-translate'))}>
          <Card.Title left={LeftContentTranslate} />
          <Card.Content>
            <Text variant="titleLarge">{t('cardTranslation')}</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

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

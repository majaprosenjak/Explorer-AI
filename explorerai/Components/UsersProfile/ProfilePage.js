import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Text, Button, ScrollView } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import LoginScreen from './LoginPage';
import { Avatar } from 'react-native-paper';
import ProfileCards from './ProfileCards';
import { useUser } from './UserContext';
import { useTranslation } from 'react-i18next';


const auth = getAuth();

const ProfilePage = ({ navigation }) => {
  const { user, setUser } = useUser();  
  const [currentUser, setCurrentUser] = useState(null);
  const { t } = useTranslation(); 


  useEffect(() => {
    if (currentUser) {
      setUser(currentUser.email);
    }
  }, [currentUser, setUser]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
        setUser(null); 
        console.log('User signed out');
      })
      .catch((error) => {
        console.error(`Error signing out: ${error.code} - ${error.message}`);
        Alert.alert('Napaka', `Napaka pri odjavi: ${error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View>
          <View style={styles.userInfo}>
            <Avatar.Icon icon="account" backgroundColor="#2196F3" />
            <Text style={styles.userName}>{user}</Text>
          </View>
          <ProfileCards navigation={navigation} />
          <Button title={t('logout')} onPress={handleSignOut} />
        </View>
      ) : (
        <LoginScreen onUserLoggedIn={setCurrentUser} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop:20
  },
  userName: {
    marginLeft: 10,
    fontSize: 18,
  },
});

export default ProfilePage;

import React, { useState } from "react";
import { StyleSheet, View, Alert, Text, Button} from 'react-native';
import {  getAuth, signOut } from 'firebase/auth';
import LoginScreen from "./LoginPage";


const auth = getAuth();


const ProfilePage = () => {

    const [currentUser, setCurrentUser] = useState(null);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                setCurrentUser(null);
                Alert.alert("Success", "You have been signed out.");
                console.log("User signed out");
            })
            .catch((error) => {
                console.error(`Error signing out: ${error.code} - ${error.message}`);
                Alert.alert("Error", `Error signing out: ${error.message}`);
            });
    };
    return (
        <View style={styles.container}>
            {currentUser ? (
                <View>
                    <Text>Pozdravljen, {currentUser.email}!</Text>
                    <Button style={styles.footerButton} title="Sign Out" onPress={handleSignOut} />
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
    },
    map: {
      width: '100%',
      height: '100%',
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      paddingVertical: 20,
      backgroundColor: '#B8C5D6',
  },
  footerButton: {
    position: 'absolute',
    bottom: 20, // Spremenite lahko tudi na želeno vrednost
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
},
  footerText: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  });
  
  export default ProfilePage;
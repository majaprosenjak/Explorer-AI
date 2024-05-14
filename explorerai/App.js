import { registerRootComponent } from 'expo';
import React, { useState } from "react";
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import MapPage from './Components/MapPage';
import LoginPage from './Components/LoginPage';
import {  getAuth, signOut } from 'firebase/auth';

const auth = getAuth();


export default function App() {
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
                    <MapPage />
                    <Text>Welcome, {currentUser.email}!</Text>
                    <Button title="Sign Out" onPress={handleSignOut} />
                </View>
            ) : (
              <LoginPage onUserLoggedIn={setCurrentUser} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});


registerRootComponent(App);


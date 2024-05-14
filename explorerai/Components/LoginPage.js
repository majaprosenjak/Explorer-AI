import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from "./firebaseConfig";

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

const LoginScreen = ({ onUserLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(true);

    const isValidEmail = (email) => {
        // email validation 
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleAuth = () => {
        if (!isValidEmail(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }

        if (!password) {
            Alert.alert("Error", "Please enter a password.");
            return;
        }

        if (isSigningUp) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    console.log(`User created: ${user.email}`);
                    onUserLoggedIn(user);
                })
                .catch(error => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(`Error creating user: ${errorCode} - ${errorMessage}`);
                    Alert.alert("Error", `Error creating user: ${errorMessage}`);
                });
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    console.log(`User logged in: ${user.email}`);
                    onUserLoggedIn(user);
                })
                .catch(error => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(`Error logging in user: ${errorCode} - ${errorMessage}`);
                    Alert.alert("Error", `Error logging in user: ${errorMessage}`);
                });
        }
    };

    
    return (
        <View style={styles.container}>

            <Text style={styles.naslov} >Prijava in Registracija</Text>

            <Text>Email</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Enter email"
            />
            <Text>Password</Text>
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                placeholder="Enter password"
            />
            <Button title={isSigningUp ? "Sign Up!" : "Login"} onPress={handleAuth} />
            <Button title={isSigningUp ? "Switch to Login" : "Switch to Sign Up"} onPress={() => setIsSigningUp(!isSigningUp)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EDF5FC",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    naslov: {
        fontSize: 20,
        justifyContent: "center",
        fontWeight: 'bold',
    }
});

export default LoginScreen;
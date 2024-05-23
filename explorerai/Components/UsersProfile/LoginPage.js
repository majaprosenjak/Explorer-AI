import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from "../firebaseConfig";
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../firebaseConfig'; 


const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

const LoginScreen = ({ onUserLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(true);

    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleAuth = () => {
        if (!isValidEmail(email)) {
            Alert.alert("Napaka", "Vnesite veljaven e-mail.");
            return;
        }

        if (!password) {
            Alert.alert("Napaka", "Vnesite pravilno geslo.");
            return;
        }

        if (isSigningUp) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    console.log(`User created: ${user.email}`);
                    const userData = {
                        email: user.email,
                        // Add any additional user data you want to store
                      };
                    addDoc(collection(firestore, 'users'), userData);
                    onUserLoggedIn(user);

                })
                .catch(error => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(`Error creating user: ${errorCode} - ${errorMessage}`);
                    Alert.alert("Napaka", `Napaka pri ustvarjanju uporabnika. Poskusite znova.`);
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
                    console.log(`Error logging in user: ${errorCode} - ${errorMessage}`);
                    Alert.alert("Napaka", `Napaka pri prijavi uporabnika. Preverite prijavne podatke.`);
                });
        }
    };

    
    return (
        <View style={styles.container}>

            <Text style={styles.naslov}>
                {isSigningUp ? "Registracija" : "Prijava"}
            </Text>
            <Text>E-mail</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="E-mail"
            />
            <Text>Geslo</Text>
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                placeholder="Geslo"
            />
            <TouchableOpacity  onPress={handleAuth} style={styles.button}>
                <Text style={styles.buttonText}>{isSigningUp ? "Registracija" : "Prijava"}</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => setIsSigningUp(!isSigningUp)} style={styles.button}>
                <Text style={styles.buttonText}>{isSigningUp ? "Pojdi na prijavo" : "Pojdi na registracijo"}</Text>
            </TouchableOpacity>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
      },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        marginTop: 5,
      },
    naslov: {
        fontSize: 20,
        justifyContent: "center",
        fontWeight: 'bold',
        textTransform: 'uppercase', 
        marginBottom: 20,
    },
    button: {
        margin: 10, 
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        textTransform: 'uppercase', 
      },
});

export default LoginScreen;
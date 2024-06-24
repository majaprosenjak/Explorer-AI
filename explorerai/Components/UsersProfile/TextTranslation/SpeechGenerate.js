import React, { useState } from 'react';
import { View, Button, Alert} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { connectFirestoreEmulator } from 'firebase/firestore';


const apiKey = 'API_KEY'; 
const apiUrl = 'https://api.openai.com/v1/audio/speech';

const SpeechGenerate = ({ initialText }) => {
    const [textInput, setTextInput] = useState(initialText || '');
    const [generatedFileName, setGeneratedFileName] = useState('');

    const generateUniqueFileName = () => {
        const timestamp = new Date().getTime();
        return `speech_${timestamp}.mp3`; 
    };

    const handleButtonPress = async () => {
        try {
            if (generatedFileName) {
                await playSpeech();
            } else {
                await generateSpeech();
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Napaka', 'Napaka pri generiranju datoteke.');
        }
    };

    const generateSpeech = async () => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'tts-1',
                    voice: 'alloy',
                    input: textInput,
                }),
            };

            const response = await fetch(apiUrl, requestOptions);

            if (!response.ok) {
                connectFirestoreEmulator.log(response.status);
            }

            const audioBlob = await response.blob();

            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const audioBase64 = reader.result.split(',')[1];

                const fileName = generateUniqueFileName();
                const filePath = FileSystem.documentDirectory + fileName;

                await FileSystem.writeAsStringAsync(filePath, audioBase64, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                console.log('Audio saved at:', filePath);
                Alert.alert('Uspešno ustvarjena datoteka z govorom: ', fileName);
                setGeneratedFileName(fileName);
            };
        } catch (error) {
            console.error('Error generating or saving speech:', error);
            Alert.alert('Napaka', 'FPri generiranju datoteke z govorom je prišlo do napake. Poskusite znova.');
        }
    };

    const playSpeech = async () => {
        try {
            const filePath = FileSystem.documentDirectory + generatedFileName;

            console.log('File path:', filePath);

            const soundObject = new Audio.Sound();
            await soundObject.loadAsync({ uri: filePath });
            await soundObject.playAsync();
        } catch (error) {
            console.error('Error playing speech:', error);
            Alert.alert('Napaka', 'Napaka pri predvajanju.');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title={generatedFileName ? "Predvajaj" : "Ustvari govor"} onPress={handleButtonPress} />
        </View>
    );
};

export default SpeechGenerate;

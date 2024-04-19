import React, { useState } from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const TextTranslationScreen = () => {
    const [selectedImageUri, setSelectedImageUri] = useState(null);

    const openImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.status !== 'granted') {
            console.log('Permission to access the media library was denied.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            setSelectedImageUri(imageUri);
        }
    };

    const handleCameraLaunch = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.status !== 'granted') {
            console.log('Permission to use the camera was denied.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            setSelectedImageUri(imageUri);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {selectedImageUri && (
                <Image
                    source={{ uri: selectedImageUri }}
                    style={{ width: '100%', height: '70%', aspectRatio: 1, resizeMode: 'contain' }}
                />
            )}
            <View style={{ marginTop: 20 }}>
                <Button title="Choose from Device" onPress={openImagePicker} />
            </View>
            <View style={{ marginTop: 20, marginBottom: 50 }}>
                <Button title="Open Camera" onPress={handleCameraLaunch} />
            </View>
        </View>
    );
};

export default TextTranslationScreen;

import React, { useState } from 'react';
import { View, Button, Text, ScrollView, Image, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

const TextDetectionComponent = () => {
  const [imageUri, setImageUri] = useState(null);
  const [detectedText, setDetectedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [toLanguage, setToLanguage] = useState('');
  const [openFrom, setOpenFrom] = useState(false);

  const analyzeImage = async () => {
    try {
      if (!imageUri) {
        alert('Please select an image or take a photo first.');
        return;
      }

      // Google Cloud Vision API key
      const apiKey = 'AIzaSyA40lu7XYSOMa4XZcjllF-1FBWos-yYkLI';
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      // Read the image file from local URI and convert it to base64
      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Prepare request data
      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [{ type: 'TEXT_DETECTION', maxResults: 5 }],
          },
        ],
      };

      // Send a POST request to the Google Vision API
      const apiResponse = await axios.post(apiUrl, requestData);

      // Retrieve the detected text from the API response
      const textAnnotations = apiResponse.data.responses[0].textAnnotations;
      if (textAnnotations && textAnnotations.length > 0) {
        setDetectedText(textAnnotations[0].description);
        console.log(detectedText)
      } else {
        setDetectedText('');
        setTranslatedText(''); // Reset translated text if no text detected
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Error analyzing image. Please try again later.');
    }
  };


  const translateTextAutomatically = async () => {
    console.log(toLanguage);
    if (!detectedText || !toLanguage) {
        return; 
    }

    try {
        const API_KEY = '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';

        // Replace newline characters with spaces
        const textWithoutNewlines = detectedText.replace(/\n/g, ' ');

        // Now you have the entire text as one paragraph without splitting
        // You can directly translate the entire paragraph
        const trimmedText = textWithoutNewlines.trim(); // Remove leading/trailing whitespace
        console.log(trimmedText);
        if (trimmedText) { // Check if the text is not empty
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    messages: [
                        { role: 'user', content: `translate ${trimmedText} to ${toLanguage}` },
                        { role: 'assistant', content: 'translate' },
                    ],
                    max_tokens: 150,
                    model: 'gpt-3.5-turbo-0125',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_KEY}`,
                    },
                }
            );

            if (response.data && response.data.choices && response.data.choices.length > 0) {
                const translatedContent = response.data.choices[0].message.content;
                setTranslatedText(translatedContent);
            } else {
                alert('Translation failed. Please try again later.');
            }
        } else {
            alert('Text is empty.');
        }

        Keyboard.dismiss();
    } catch (error) {
        console.error('Error translating text:', error);
        alert('Error translating text. Please try again later.');
    }
};

  
  

const pickImage = async () => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result === null) {
            // Handle case where the result is null (user canceled or encountered an error)
            console.log('Image picking canceled or encountered an error.');
            return;
        }

        if (!result.cancelled) {
            setImageUri(result.assets[0].uri);
        } else {
            console.log('Image picking canceled by the user.');
        }
    } catch (error) {
        console.error('Error picking image:', error);
        alert('Error picking image. Please try again later.');
    }
};

  const takePhoto = async () => {
    // Function implementation
  };

  const handleButtonClick = () => {
    console.log('Button clicked. Selected language:', toLanguage);
    translateTextAutomatically();
    // Call other functions if needed
};


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
      <Button title="Pick Image" onPress={pickImage} />
      <Button title="Take Photo" onPress={takePhoto} />
      <Button title="Analyze Image" onPress={analyzeImage} />
      <DropDownPicker
                open={openFrom}
                value={toLanguage}
                setOpen={setOpenFrom}
                setValue={setToLanguage}
                items={[
                    { label: 'English', value: 'english' },
                    { label: 'Spanish', value: 'spanish' },
                    { label: 'Slovene', value: 'slovene' },
                    { label: 'German', value: 'german' },
                ]}
                onChangeValue={(item) => {
                    if (item && item.value) {
                        setToLanguage(item.value);
                    }
                }}
            />
            <Button title="test" onPress={handleButtonClick} />


      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginVertical: 20 }}
        />
      )}

      <ScrollView>
        <Text style={{ marginTop: 20 }}>Detected Text:</Text>
        <Text style={{ marginTop: 10 }}>{detectedText}</Text>


        {translatedText !== '' && (
          <>
            <Text style={{ marginTop: 20 }}>Translated Text:</Text>
            <Text style={{ marginTop: 10 }}>{translatedText}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default TextDetectionComponent;

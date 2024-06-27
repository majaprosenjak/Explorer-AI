import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Keyboard, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTranslation } from 'react-i18next';
import SpeechGenerate from './SpeechGenerate';
import { API_KEY_GOOGLE_VISION, API_KEY_TRANSLATE} from '@env';

const TextDetectionComponent = () => {
  const [imageUri, setImageUri] = useState(null);
  const [detectedText, setDetectedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [toLanguage, setToLanguage] = useState('');
  const [openFrom, setOpenFrom] = useState(false);
  const { t } = useTranslation(); 


  const analyzeImage = async (imageUri) => {
    try {
      if (!imageUri) {
        alert('Najprej izberite sliko.');
        return;
      }

      // Google Cloud Vision API key
      const apiKey = API_KEY_GOOGLE_VISION;
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      // Read the image file from local URI and convert it to base64
      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

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

      // POST request to Google Vision API
      const apiResponse = await axios.post(apiUrl, requestData);

      // API response
      const textAnnotations = apiResponse.data.responses[0].textAnnotations;
      if (textAnnotations && textAnnotations.length > 0) {
        setDetectedText(textAnnotations[0].description);
        console.log(detectedText)
      } else {
        setDetectedText('');
        setTranslatedText(''); 
      }
    } catch (error) {
      console.error('Napaka pri analizi slike:', error);
      alert('Napaka pri analizi slike. Poskusite znova.');
    }
  };

  const translateText = async () => {
    console.log(toLanguage);
    if (!detectedText || !toLanguage) {
        return; 
    }

    try {
        const API_KEY = API_KEY_TRANSLATE;
        const textWithoutNewlines = detectedText.replace(/\n/g, ' ');
        const trimmedText = textWithoutNewlines.trim(); 
        console.log(trimmedText);
        if (trimmedText) { 
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    messages: [
                        { role: 'user', content: `translate this text: ${trimmedText} into this language: ${toLanguage}` },
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
                alert('Napaka pri prevajanju. Poskusite znova.');
            }
        } else {
            alert('Ni zaznanega besedila.');
        }

        Keyboard.dismiss();
    } catch (error) {
        console.error('Napaka pri prevajanju:', error);
        alert('Napaka pri prevajanju. Poskusite znova.');
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
            console.log('Image picking interrupted');
            return;
        }

        if (!result.cancelled) {
            setImageUri(result.assets[0].uri);
            analyzeImage(result.assets[0].uri);

        } else {
            console.log('Izbiranje slike je bilo prekinjeno.');
        }

    } catch (error) {
        console.error(error);
        alert('Napaka pri izbiranju slike. Poskusite znova.');
    }
};

const takePhoto = async () => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);

    }
  } catch (error) {
    console.log( error);
  }
};

  


  return (
    <View style={styles.container}>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={pickImage} style={styles.button}>
            <Text style={styles.buttonText}>{t('tGallery')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={styles.button}>
            <Text style={styles.buttonText}>{t('tCamera')}</Text>
          </TouchableOpacity>
        </View>


      <DropDownPicker
        open={openFrom}
        value={toLanguage}
        setOpen={setOpenFrom}
        setValue={setToLanguage}
        placeholder={t('tPickLang')}
        items={[
            { label: t('tAng'), value: 'english' },
            { label: t('tSpa'), value: 'spanish' },
            { label: t('tSlo'), value: 'slovene' },
            { label: t('tNem'), value: 'german' },
            { label: t('tIta'), value: 'italian' }
        ]}
        onChangeValue={(item) => {
            if (item && item.value) {
                setToLanguage(item.value);
            }
        }}
        />
        <TouchableOpacity onPress={translateText} style={styles.button}>
          <Text style={styles.buttonText}>{t('tTranslate')}</Text>
        </TouchableOpacity>


        <ScrollView >
          {detectedText !== '' && (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={{ marginTop: 10 }}>{detectedText}</Text>
              </View>
            </View>    
          )}

          {translatedText !== '' && (
            <View style={styles.cardTrans}>
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.translatedText}>{translatedText}</Text>
                  <SpeechGenerate initialText={translatedText} />
                </View>
              </View>
            </View>   
          )}
        </ScrollView>
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textContainer: {
    flexDirection: 'column', 
    alignItems: 'center', 
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
  buttonRow: {
    flexDirection: 'row', 
    marginTop: 20, 
  },
  card: {
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 8,
},
cardTrans: {
  padding: 10,
  marginTop: 10,
  marginBottom: 600,

  borderWidth: 1,
  borderColor: '#ccc',
  backgroundColor: 'white',
  borderRadius: 8,
},
cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
},

});

export default TextDetectionComponent;

import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from './LanguageContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export default function CropDiagnosis({ navigation }) {
  const { t } = useLanguage();
  const [image, setImage] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isDiagnosing) {
      progress.stopAnimation();
      progress.setValue(0);
      return undefined;
    }

    const animation = Animated.loop(
      Animated.timing(progress, { toValue: 1, duration: 1100, useNativeDriver: true })
    );
    animation.start();
    return () => animation.stop();
  }, [isDiagnosing, progress]);

  // =========================
  // PICK IMAGE FROM GALLERY
  // =========================
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permission to access photos is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setDiagnosis(null);
    }
  };

  // =========================
  // TAKE PHOTO
  // =========================
  const takePhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert('Camera permission is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setDiagnosis(null);
    }
  };

  // =========================
  // DIAGNOSE CROP
  // =========================
  const diagnoseCrop = async () => {
    if (!image || isDiagnosing) {
      alert('Please select or take a crop image first.');
      return;
    }

    const formData = new FormData();

    formData.append('file', {
      uri: image,
      name: 'crop.jpg',
      type: 'image/jpeg',
    });

    setIsDiagnosing(true);
    setDiagnosis(null);

    try {
      if (!API_BASE_URL) {
        throw new Error('EXPO_PUBLIC_API_URL is not configured.');
      }
      const response = await fetch(
        `${API_BASE_URL}/diagnose`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      console.log('Diagnosis result:', data);

      // Store the complete backend response
      setDiagnosis(data);

      // No diagnosis popup here.
      // The result will appear in the result box below.
    } catch (error) {
      console.log('Diagnosis error:', error);
      alert('Could not connect to the backend.');
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* =========================
          SCROLLABLE CONTENT
      ========================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* TITLE */}

        <Text style={styles.title}>
          {t('cropDiagnosis')} 🌱
        </Text>

        <Text style={styles.subtitle}>
          {t('cropUpload')}
        </Text>

        {/* MAIN CARD */}

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            {t('cropDetection')}
          </Text>

          <Text style={styles.cardText}>
            {t('cropPhotoHelp')}
          </Text>

          {/* TAKE PHOTO */}

          <TouchableOpacity
            style={styles.button}
            onPress={takePhoto}
          >
            <Text style={styles.buttonText}>
              📷 {t('takePhoto')}
            </Text>
          </TouchableOpacity>

          {/* GALLERY */}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={pickImage}
          >
            <Text style={styles.secondaryButtonText}>
              🖼️ {t('chooseGallery')}
            </Text>
          </TouchableOpacity>

          {/* IMAGE */}

          {image && (
            <Image
              source={{ uri: image }}
              style={styles.cropImage}
              resizeMode="contain"
            />
          )}

          {/* DIAGNOSE BUTTON */}

          {image && (
            <TouchableOpacity
              style={[styles.diagnoseButton, isDiagnosing && styles.diagnoseButtonDisabled]}
              onPress={diagnoseCrop}
              disabled={isDiagnosing}
            >
              <Text style={styles.diagnoseButtonText}>
                {isDiagnosing ? '⏳ Analyzing crop image...' : `🔍 ${t('diagnoseCrop')}`}
              </Text>
            </TouchableOpacity>
          )}

          {isDiagnosing && (
            <View style={styles.progressSection} accessibilityLabel="Crop diagnosis is in progress">
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      transform: [{
                        translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-160, 160] }),
                      }],
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>Please wait while AI analyzes your crop.</Text>
            </View>
          )}

          {/* =========================
              RESULT BOX
          ========================= */}

          {diagnosis && (
            <View style={styles.resultBox}>

              <Text style={styles.resultTitle}>
                🌱 Diagnosis Result
              </Text>

              <View style={styles.resultLine}>
                <Text style={styles.label}>
                  Crop
                </Text>

                <Text style={styles.value}>
                  {diagnosis.crop?.name || 'Unknown'}
                </Text>
              </View>

              <View style={styles.resultLine}>
                <Text style={styles.label}>
                  Confidence
                </Text>

                <Text style={styles.value}>
                  {diagnosis.crop?.confidence != null
                    ? `${(diagnosis.crop.confidence * 100).toFixed(0)}%`
                    : 'N/A'}
                </Text>
              </View>

              <View style={styles.resultLine}>
                <Text style={styles.label}>
                  Disease Type
                </Text>

                <Text style={styles.value}>
                  {diagnosis.disease?.type || 'Not detected'}
                </Text>
              </View>

              <View style={styles.detailSection}>

                <Text style={styles.detailTitle}>
                  Description
                </Text>

                <Text style={styles.detailText}>
                  {diagnosis.disease?.description ||
                    'Not available'}
                </Text>

              </View>

              <View style={styles.detailSection}>

                <Text style={styles.detailTitle}>
                  Symptoms
                </Text>

                <Text style={styles.detailText}>
                  {diagnosis.disease?.symptoms ||
                    'Not available'}
                </Text>

              </View>

              <View style={styles.detailSection}>

                <Text style={styles.detailTitle}>
                  Severity
                </Text>

                <Text style={styles.detailText}>
                  {diagnosis.disease?.severity ||
                    'Not available'}
                </Text>

              </View>

              <View style={styles.detailSection}>

                <Text style={styles.detailTitle}>
                  Spreading
                </Text>

                <Text style={styles.detailText}>
                  {diagnosis.disease?.spreading ||
                    'Not available'}
                </Text>

              </View>

              <View style={styles.detailSection}>

                <Text style={styles.detailTitle}>
                  Treatment
                </Text>

                <Text style={styles.detailText}>
                  {diagnosis.disease?.treatment ||
                    'Not available'}
                </Text>

              </View>

            </View>
          )}

        </View>

        {/* BACK BUTTON */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            ← {t('back')}
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}


// =========================
// STYLES
// =========================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7F2',
  },

  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#555555',
    lineHeight: 24,
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 12,
  },

  cardText: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 23,
    marginBottom: 25,
  },

  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cropImage: {
    width: '100%',
    height: 250,
    marginTop: 20,
    borderRadius: 10,
  },

  diagnoseButton: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
  },

  diagnoseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  diagnoseButtonDisabled: {
    backgroundColor: '#6E9871',
  },

  progressSection: {
    backgroundColor: '#EFF7ED',
    borderRadius: 12,
    marginTop: 16,
    padding: 14,
  },

  progressTrack: {
    backgroundColor: '#D7E9D4',
    borderRadius: 99,
    height: 7,
    overflow: 'hidden',
  },

  progressBar: {
    backgroundColor: '#2E7D32',
    borderRadius: 99,
    height: '100%',
    width: '55%',
  },

  progressText: {
    color: '#467149',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },

  // =========================
  // RESULT BOX
  // =========================

  resultBox: {
    marginTop: 25,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F9FFF7',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    elevation: 3,
  },

  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 18,
  },

  resultLine: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },

  value: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222222',
  },

  detailSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },

  detailText: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 22,
  },

  backButton: {
    marginTop: 25,
    alignItems: 'center',
  },

  backButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

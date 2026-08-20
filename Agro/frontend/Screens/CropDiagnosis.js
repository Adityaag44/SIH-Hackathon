import React,{useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CropDiagnosis({ navigation }) {
  const [image,setImage]= useState(null);
  const pickImage = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

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
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Crop Diagnosis 🌱
            </Text>

            <Text style={styles.subtitle}>
                Upload a photo of your crop to detect possible diseases using AI.
            </Text>

            <View style={styles.card}>

                <Text style={styles.cardTitle}>
                    Crop Disease Detection
                </Text>

                <Text style={styles.cardText}>
                    Take a clear photo of the affected part of your crop.
                    Our AI will analyze the image and provide possible
                    disease information.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        // Camera functionality will be added later
                    }}
                >
                    <Text style={styles.buttonText}>
                        📷 Take a Photo
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={pickImage
                    }
                >
                    <Text style={styles.secondaryButtonText}>
                        🖼️ Choose from Gallery
                    </Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>
                    ← Back
                </Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F5F7F2',
        padding: 24,
        paddingTop: 60,
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
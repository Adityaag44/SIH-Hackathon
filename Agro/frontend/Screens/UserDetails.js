import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLanguage } from './LanguageContext';

export default function UserDetails({ navigation, route }) {
  const { t } = useLanguage();
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');
  const [cropType, setCropType] = useState('');
  const [landSize, setLandSize] = useState('');
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(32)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(formOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(formTranslateY, { toValue: 0, friction: 8, tension: 50, useNativeDriver: true }),
    ]).start();
  }, [formOpacity, formTranslateY]);

  const handleContinue = () => {
    if (![location, soilType, cropType, landSize].every((field) => field.trim())) {
      Alert.alert('Missing farm details', 'Please fill in each field to continue.');
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{
        name: 'Home',
        params: {
          profile: { ...route.params?.profile, location, soilType, cropType, landSize },
        },
      }],
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>🌱 AGRO</Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.step}>STEP 2 OF 2</Text>

        <Animated.View
          style={[
            styles.card,
            { opacity: formOpacity, transform: [{ translateY: formTranslateY }] },
          ]}
        >
          <Text style={styles.title}>{t('tellUsFarm')}</Text>
          <Text style={styles.subtitle}>
            These details help us tailor recommendations to your crops.
          </Text>

          <FormField label={t('location')} icon="📍" value={location} onChangeText={setLocation} placeholder="Village, city, or district" />
          <FormField label={t('soilType')} icon="🟤" value={soilType} onChangeText={setSoilType} placeholder="e.g. Black, loamy, sandy" />
          <FormField label={t('cropType')} icon="🌾" value={cropType} onChangeText={setCropType} placeholder="e.g. Wheat, rice, cotton" />
          <FormField label={t('landSize')} icon="📐" value={landSize} onChangeText={setLandSize} placeholder="Enter size in acres" keyboardType="decimal-pad" />

          <TouchableOpacity style={styles.primaryButton} onPress={handleContinue} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>{t('completeProfile')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{t('backToRegistration')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({ label, icon, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>{icon}</Text>
        <TextInput style={styles.input} placeholderTextColor="#8A9686" {...inputProps} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2F6B3B' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 46 },
  logo: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', letterSpacing: 1, marginBottom: 22 },
  progressTrack: { backgroundColor: '#679E70', borderRadius: 99, height: 6, overflow: 'hidden' },
  progressFill: { backgroundColor: '#DFF1D9', borderRadius: 99, height: '100%', width: '100%' },
  step: { color: '#DDEEDB', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginBottom: 16, marginTop: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, elevation: 6 },
  title: { color: '#1E3825', fontSize: 26, fontWeight: '700' },
  subtitle: { color: '#667565', fontSize: 14, lineHeight: 20, marginBottom: 12, marginTop: 7 },
  field: { marginTop: 14 },
  label: { color: '#314532', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  inputRow: { alignItems: 'center', backgroundColor: '#F3F7F1', borderColor: '#D7E3D4', borderRadius: 12, borderWidth: 1, flexDirection: 'row', height: 52, paddingHorizontal: 14 },
  inputIcon: { fontSize: 17, marginRight: 9 },
  input: { color: '#1E3825', flex: 1, fontSize: 16, height: '100%' },
  primaryButton: { alignItems: 'center', backgroundColor: '#3E814B', borderRadius: 12, marginTop: 28, paddingVertical: 16 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  backButton: { alignItems: 'center', marginTop: 18 },
  backText: { color: '#3E814B', fontSize: 14, fontWeight: '600' },
});

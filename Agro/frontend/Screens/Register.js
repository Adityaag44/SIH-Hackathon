import React, { useState } from 'react';
import {
  Alert,
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

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (![name, username, contact, password, confirmPassword].every((field) => field.trim())) {
      Alert.alert('Missing details', 'Please complete all fields to create your account.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Re-enter the same password in both fields.');
      return;
    }

    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>🌱 AGRO</Text>
        <View style={styles.card}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Join AGRO and keep your farm information close at hand.</Text>

          <FormField label="Full name" value={name} onChangeText={setName} placeholder="Enter your full name" />
          <FormField label="Username" value={username} onChangeText={setUsername} placeholder="Choose a username" autoCapitalize="none" />
          <FormField label="Email or phone number" value={contact} onChangeText={setContact} placeholder="Enter email or phone number" autoCapitalize="none" keyboardType="email-address" />
          <FormField label="Password" value={password} onChangeText={setPassword} placeholder="Create a password" secureTextEntry />
          <FormField label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter your password" secureTextEntry />

          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
            <Text style={styles.primaryButtonText}>Create account</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.link}> Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({ label, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#8A9686"
        autoComplete="off"
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2F6B3B' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 46 },
  logo: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', letterSpacing: 1, marginBottom: 22 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, elevation: 6 },
  title: { color: '#1E3825', fontSize: 26, fontWeight: '700' },
  subtitle: { color: '#667565', fontSize: 14, lineHeight: 20, marginBottom: 14, marginTop: 7 },
  field: { marginTop: 12 },
  label: { color: '#314532', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#F3F7F1', borderColor: '#D7E3D4', borderRadius: 12, borderWidth: 1, color: '#1E3825', fontSize: 16, height: 50, paddingHorizontal: 14 },
  primaryButton: { alignItems: 'center', backgroundColor: '#3E814B', borderRadius: 12, marginTop: 26, paddingVertical: 16 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#667565', fontSize: 14 },
  link: { color: '#2F6B3B', fontSize: 14, fontWeight: '700' },
});

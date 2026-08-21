import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Login({ navigation }) {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!identity.trim() || !password) {
      Alert.alert('Missing details', 'Enter your email or phone number and password.');
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
      <View style={styles.hero}>
        <Text style={styles.logo}>🌱 AGRO</Text>
        <Text style={styles.tagline}>Growing smarter, together</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to manage your farm with confidence.</Text>

        <Text style={styles.label}>Email or phone number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email or phone number"
          placeholderTextColor="#8A9686"
          value={identity}
          onChangeText={setIdentity}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#8A9686"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Log in</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to AGRO?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}> Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2F6B3B', justifyContent: 'center', padding: 24 },
  hero: { marginBottom: 30 },
  logo: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', letterSpacing: 1 },
  tagline: { color: '#DDEEDB', fontSize: 16, marginTop: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, elevation: 6 },
  title: { color: '#1E3825', fontSize: 27, fontWeight: '700' },
  subtitle: { color: '#667565', fontSize: 14, lineHeight: 20, marginBottom: 24, marginTop: 7 },
  label: { color: '#314532', fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  input: { backgroundColor: '#F3F7F1', borderColor: '#D7E3D4', borderRadius: 12, borderWidth: 1, color: '#1E3825', fontSize: 16, height: 52, paddingHorizontal: 14 },
  primaryButton: { alignItems: 'center', backgroundColor: '#3E814B', borderRadius: 12, marginTop: 28, paddingVertical: 16 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  footerText: { color: '#667565', fontSize: 14 },
  link: { color: '#2F6B3B', fontSize: 14, fontWeight: '700' },
});

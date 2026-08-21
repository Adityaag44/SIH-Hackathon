import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { languages, useLanguage } from './LanguageContext';

export default function Profile({ navigation, route }) {
  const { language, setLanguage, t } = useLanguage();
  const profile = route.params?.profile || {};
  const [profileImage, setProfileImage] = useState(null);
  const displayName = profile.name || 'Farmer';
  const initial = displayName.charAt(0).toUpperCase();

  const chooseProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow photo-library access to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const details = [
    [t('username'), profile.username || 'Not provided'],
    [t('contact'), profile.contact || 'Not provided'],
    [t('location'), profile.location || 'Not provided'],
    [t('soilType'), profile.soilType || 'Not provided'],
    [t('cropType'), profile.cropType || 'Not provided'],
    [t('landSize'), profile.landSize ? `${profile.landSize} acres` : 'Not provided'],
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSummary}>
          <TouchableOpacity style={styles.avatarButton} onPress={chooseProfileImage} activeOpacity={0.85}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}><Text style={styles.avatarInitial}>{initial}</Text></View>
            )}
            <View style={styles.cameraBadge}><Text style={styles.cameraIcon}>📷</Text></View>
          </TouchableOpacity>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.role}>AGRO Farmer</Text>
          <TouchableOpacity onPress={chooseProfileImage}>
            <Text style={styles.changePhoto}>{t('changePhoto')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t('profileDetails')}</Text>
        <View style={styles.detailsCard}>
          {details.map(([label, value], index) => (
            <View key={label} style={[styles.detailRow, index !== details.length - 1 && styles.detailBorder]}>
              <Text style={styles.detailLabel}>{label}</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Language preference</Text>
        <View style={styles.languageCard}>
          {languages.map((item) => (
            <TouchableOpacity
              key={item.code}
              onPress={() => setLanguage(item.code)}
              style={[styles.languageChip, language === item.code && styles.languageChipSelected]}
            >
              <Text style={[styles.languageText, language === item.code && styles.languageTextSelected]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>created by Vital6</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8F2' },
  header: { backgroundColor: '#2F6B3B', paddingBottom: 26, paddingHorizontal: 24, paddingTop: 64 },
  headerTitle: { color: '#FFFFFF', fontSize: 27, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 42 },
  profileSummary: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, elevation: 3, marginTop: -2, padding: 24 },
  avatarButton: { height: 108, marginBottom: 12, position: 'relative', width: 108 },
  avatar: { borderRadius: 54, height: 108, width: 108 },
  avatarPlaceholder: { alignItems: 'center', backgroundColor: '#DCEFDA', borderRadius: 54, height: 108, justifyContent: 'center', width: 108 },
  avatarInitial: { color: '#2F6B3B', fontSize: 42, fontWeight: '700' },
  cameraBadge: { alignItems: 'center', backgroundColor: '#3E814B', borderColor: '#FFFFFF', borderRadius: 18, borderWidth: 3, bottom: -3, height: 36, justifyContent: 'center', position: 'absolute', right: -3, width: 36 },
  cameraIcon: { fontSize: 16 },
  name: { color: '#1E3825', fontSize: 23, fontWeight: '700' },
  role: { color: '#6E7D6E', fontSize: 14, marginTop: 4 },
  changePhoto: { color: '#2F6B3B', fontSize: 14, fontWeight: '700', marginTop: 14 },
  sectionTitle: { color: '#1E3825', fontSize: 19, fontWeight: '700', marginBottom: 12, marginTop: 25 },
  detailsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, elevation: 2, paddingHorizontal: 16 },
  detailRow: { paddingVertical: 15 },
  detailBorder: { borderBottomColor: '#E6ECE3', borderBottomWidth: 1 },
  detailLabel: { color: '#788477', fontSize: 13, marginBottom: 4 },
  detailValue: { color: '#263C2B', fontSize: 16, fontWeight: '600' },
  languageCard: { backgroundColor: '#FFFFFF', borderRadius: 16, elevation: 2, flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 14 },
  languageChip: { backgroundColor: '#EEF4EB', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9 },
  languageChipSelected: { backgroundColor: '#2F6B3B' },
  languageText: { color: '#36533B', fontSize: 13, fontWeight: '600' },
  languageTextSelected: { color: '#FFFFFF' },
  logoutButton: { alignItems: 'center', borderColor: '#B42318', borderRadius: 12, borderWidth: 1, marginTop: 26, paddingVertical: 14 },
  logoutText: { color: '#B42318', fontSize: 16, fontWeight: '700' },
  footer: { color: '#6B7B3B', fontSize: 13, fontWeight: '600', marginTop: 22, textAlign: 'center' },
});

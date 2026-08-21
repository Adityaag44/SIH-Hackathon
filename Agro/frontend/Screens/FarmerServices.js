import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLanguage } from './LanguageContext';

export default function FarmerServices() {
  const { t } = useLanguage();

  const openWebsite = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>🧑‍🌾 {t('farmerServices')}</Text>

        <Text style={styles.subtitle}>
          {t('farmerServicesSubtitle')}
        </Text>

        {/* Fertilizer e-Token */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            openWebsite('https://evikas.mpkrishi.mp.gov.in/')
          }
        >
          <Text style={styles.icon}>🌱</Text>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Fertilizer e-Token
            </Text>

            <Text style={styles.cardText}>
              Book fertilizer token
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* e-Uparjan */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            openWebsite('https://mpeuparjan.nic.in/')
          }
        >
          <Text style={styles.icon}>🌾</Text>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              e-Uparjan Slot
            </Text>

            <Text style={styles.cardText}>
              Book crop procurement slot
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* KCC */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            openWebsite('https://fasalrin.gov.in/')
          }
        >
          <Text style={styles.icon}>💳</Text>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              KCC Status
            </Text>

            <Text style={styles.cardText}>
              Check KCC status
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* PM Kisan */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            openWebsite('https://pmkisan.gov.in/')
          }
        >
          <Text style={styles.icon}>💰</Text>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              PM-Kisan
            </Text>

            <Text style={styles.cardText}>
              Check payment & beneficiary status
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Fasal Bima */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            openWebsite('https://pmfby.gov.in/')
          }
        >
          <Text style={styles.icon}>🛡️</Text>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Fasal Bima
            </Text>

            <Text style={styles.cardText}>
              Crop insurance services
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Government Schemes */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            openWebsite(
              'https://cmhelpline.mp.gov.in/schemeDashboard.aspx'
            )
          }
        >
          <Text style={styles.icon}>📋</Text>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Government Schemes
            </Text>

            <Text style={styles.cardText}>
              Find farmer welfare schemes
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F2',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 25,
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 6,
    marginBottom: 22,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },

  icon: {
    fontSize: 32,
    width: 55,
  },

  cardContent: {
    flex: 1,
    marginLeft: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  cardText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  arrow: {
    fontSize: 30,
    color: '#777',
    marginLeft: 10,
  },
});

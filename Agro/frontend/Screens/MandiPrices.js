import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function MandiPrices() {
  const [search, setSearch] = useState('');

  const mandiData = [
    {
      crop: 'Wheat',
      icon: '🌾',
      price: '₹2,400',
      min: '₹2,200',
      max: '₹2,550',
      mandi: 'Pune Mandi',
    },
    {
      crop: 'Rice',
      icon: '🍚',
      price: '₹3,100',
      min: '₹2,800',
      max: '₹3,400',
      mandi: 'Pune Mandi',
    },
    {
      crop: 'Maize',
      icon: '🌽',
      price: '₹2,100',
      min: '₹1,900',
      max: '₹2,300',
      mandi: 'Pune Mandi',
    },
    {
      crop: 'Onion',
      icon: '🧅',
      price: '₹1,800',
      min: '₹1,500',
      max: '₹2,100',
      mandi: 'Pune Mandi',
    },
    {
      crop: 'Tomato',
      icon: '🍅',
      price: '₹2,200',
      min: '₹1,800',
      max: '₹2,500',
      mandi: 'Pune Mandi',
    },
  ];

  const filteredData = mandiData.filter((item) =>
    item.crop.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💰 Mandi Prices</Text>
          <Text style={styles.subtitle}>
            Check today's crop market prices
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            style={styles.input}
            placeholder="Search crop..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Location */}
        <View style={styles.locationBox}>
          <Text style={styles.locationLabel}>📍 Mandi Location</Text>
          <Text style={styles.locationName}>Pune Mandi</Text>
          <Text style={styles.updated}>Prices updated today</Text>
        </View>

        {/* Section title */}
        <Text style={styles.sectionTitle}>Today's Prices</Text>

        {/* Price Cards */}
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.priceCard}
              activeOpacity={0.8}
            >
              <View style={styles.cropIcon}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>

              <View style={styles.cropInfo}>
                <Text style={styles.cropName}>
                  {item.crop}
                </Text>

                <Text style={styles.hindiName}>
                  {item.hindi}
                </Text>

                <Text style={styles.mandiName}>
                  {item.mandi}
                </Text>

                <View style={styles.rangeRow}>
                  <Text style={styles.rangeText}>
                    Min {item.min}
                  </Text>

                  <Text style={styles.rangeText}>
                    Max {item.max}
                  </Text>
                </View>
              </View>

              <View style={styles.priceBox}>
                <Text style={styles.price}>
                  {item.price}
                </Text>

                <Text style={styles.perQuintal}>
                  / Quintal
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResult}>
            <Text style={styles.noResultIcon}>🔎</Text>
            <Text style={styles.noResultText}>
              No crop found
            </Text>
            <Text style={styles.noResultSubtext}>
              Try searching another crop
            </Text>
          </View>
        )}

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>ℹ️ Price Information</Text>

          <Text style={styles.noteText}>
            Prices shown are sample market prices.
            Connect a mandi price API to display
            live market rates.
          </Text>
        </View>

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

  header: {
    paddingTop: 25,
    paddingBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 6,
  },

  searchBox: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 16,
    elevation: 2,
  },

  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },

  locationBox: {
    backgroundColor: '#EAF4E3',
    borderRadius: 15,
    padding: 16,
    marginBottom: 22,
  },

  locationLabel: {
    fontSize: 14,
    color: '#555',
  },

  locationName: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 5,
  },

  updated: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },

  cropIcon: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#F1F7EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 30,
  },

  cropInfo: {
    flex: 1,
  },

  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  hindiName: {
    fontSize: 13,
    color: '#777',
    marginTop: 1,
  },

  mandiName: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },

  rangeRow: {
    flexDirection: 'row',
    marginTop: 7,
    gap: 12,
  },

  rangeText: {
    fontSize: 11,
    color: '#666',
  },

  priceBox: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },

  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  perQuintal: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },

  noResult: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 35,
    alignItems: 'center',
  },

  noResultIcon: {
    fontSize: 35,
  },

  noResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },

  noResultSubtext: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },

  noteBox: {
    backgroundColor: '#FFF8E8',
    borderRadius: 15,
    padding: 16,
    marginTop: 8,
    marginBottom: 30,
  },

  noteTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  noteText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginTop: 6,
  },
});
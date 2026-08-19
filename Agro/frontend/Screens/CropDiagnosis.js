import { StyleSheet, Text, View } from 'react-native';

export default function CropDiagnosis() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crop Diagnosis 🌱</Text>

      <Text style={styles.subtitle}>
        Upload a photo of your crop to detect possible diseases using AI.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Coming Next</Text>
        <Text style={styles.cardText}>
          📷 Take a photo{'\n'}
          🖼️ Choose from gallery{'\n'}
          🤖 AI disease detection{'\n'}
          💊 Treatment recommendations
        </Text>
      </View>
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
    marginBottom: 15,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  cardText: {
    fontSize: 16,
    lineHeight: 30,
  },
});

subtitle: {
  size: 19,
  lineHeight: 26,
}
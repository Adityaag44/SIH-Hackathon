import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CropDiagnosis from './screens/CropDiagnosis';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
     <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CropDiagnosis"
          component={CropDiagnosis}
          options={{ title: 'Crop Diagnosis' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.logo}>🌱 AGRO</Text>
      <Text style={styles.welcome}>Welcome, Farmer</Text>
      <Text style={styles.subtitle}>
        Your smart farming assistant
      </Text>

      <View style={styles.cards}>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.icon}>🌿</Text>
          <View>
            <Text style={styles.cardTitle}>Crop Diagnosis</Text>
            <Text style={styles.cardText}>
              Detect crop diseases using AI
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.icon}>🌦️</Text>
          <View>
            <Text style={styles.cardTitle}>Weather & Soil</Text>
            <Text style={styles.cardText}>
              Check weather and soil conditions
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.icon}>💰</Text>
          <View>
            <Text style={styles.cardTitle}>Mandi Prices</Text>
            <Text style={styles.cardText}>
              Find current market prices
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.icon}>💧</Text>
          <View>
            <Text style={styles.cardTitle}>Farm Advisory</Text>
            <Text style={styles.cardText}>
              Get irrigation and fertilizer advice
            </Text>
          </View>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F2',
    padding: 24,
    paddingTop: 70,
  },

  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    marginBottom: 30,
  },

  cards: {
    gap: 15,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },

  icon: {
    fontSize: 32,
    marginRight: 18,
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
});

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CropDiagnosis from './Screens/CropDiagnosis';
import MandiPrices from './Screens/MandiPrices';
import FarmerServices from './Screens/FarmerServices';
import Login from './Screens/Login';
import Register from './Screens/Register';
import UserDetails from './Screens/UserDetails';
import Profile from './Screens/Profile';
import { LanguageProvider, useLanguage } from './Screens/LanguageContext';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <LanguageProvider>
     <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CropDiagnosis"
          component={CropDiagnosis}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="MandiPrices"
          component={MandiPrices}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FarmerServices"
          component={FarmerServices}
          options={{ headerShown: false }}
        />


      </Stack.Navigator>
    </NavigationContainer>
    </LanguageProvider>
  );
}

function HomeScreen({ navigation, route }) {
  const profile = route.params?.profile || {};
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.topRow}>
        <Text style={styles.logo}>🌱 AGRO</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile', { profile })}
          accessibilityLabel="View profile"
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.welcome}>{t('welcome')}</Text>
      <Text style={styles.subtitle}>
        {t('smartAssistant')}
      </Text>

      <View style={styles.cards}>

        <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('CropDiagnosis')}>
          <Text style={styles.icon}>🌿</Text>
          <View>
            <Text style={styles.cardTitle}>{t('cropDiagnosis')}</Text>
            <Text style={styles.cardText}>
              {t('cropDiagnosisDesc')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.icon}>🌦️</Text>
          <View>
            <Text style={styles.cardTitle}>{t('weatherSoil')}</Text>
            <Text style={styles.cardText}>
              {t('weatherSoilDesc')}
            </Text>
          </View>
        </TouchableOpacity>

       <TouchableOpacity
         style={styles.card}
         onPress={() => navigation.navigate('MandiPrices')}
> 
         <Text style={styles.icon}>💰</Text>

        <View>
           <Text style={styles.cardTitle}>{t('mandiPrices')}</Text>

          <Text style={styles.cardText}>
             {t('mandiPricesDesc')}
             </Text>
           </View>
          </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.icon}>💧</Text>
          <View>
            <Text style={styles.cardTitle}>{t('farmAdvisory')}</Text>
            <Text style={styles.cardText}>
              {t('farmAdvisoryDesc')}
            </Text>
          </View>
        </TouchableOpacity>

      <TouchableOpacity
         style={styles.card}
         onPress={() => navigation.navigate('FarmerServices')}
>
          <Text style={styles.icon}>🧑‍🌾</Text>

           <View>
             <Text style={styles.cardTitle}>{t('farmerServices')}</Text>

            <Text style={styles.cardText}>
             {t('farmerServicesDesc')}
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
  },

  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  profileButton: {
    alignItems: 'center',
    backgroundColor: '#E0EEDC',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },

  profileIcon: {
    fontSize: 22,
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

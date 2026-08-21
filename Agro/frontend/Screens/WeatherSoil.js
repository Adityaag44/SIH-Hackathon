import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

function weatherLabel(code) {
  if (code === 0) return 'Clear sky';
  if ([1, 2, 3].includes(code)) return 'Partly cloudy';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rainy';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowy';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Conditions unavailable';
}

function soilAdvice(moisture, rain, et0) {
  if (rain >= 5) return 'Rain is expected today. Hold irrigation and check field drainage.';
  if (moisture == null) return 'Soil moisture is unavailable for this area. Check the field before irrigating.';
  if (moisture < 0.15 && et0 >= 3) return 'Surface soil is dry and evaporation is high. Inspect the root zone and plan irrigation.';
  if (moisture < 0.2) return 'Surface soil is getting dry. Check crop and root-zone moisture before the next irrigation.';
  if (moisture > 0.4) return 'Surface soil is quite wet. Avoid irrigation and watch for waterlogging.';
  return 'Surface moisture is moderate. Irrigate according to your crop and root-zone check.';
}

export default function WeatherSoil({ navigation, route }) {
  const savedLocation = route.params?.profile?.location || '';
  const [location, setLocation] = useState(savedLocation);
  const [data, setData] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadConditions = async (query = location) => {
    if (!query.trim()) {
      setError('Enter a village, city, or district first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (!API_BASE_URL) throw new Error('EXPO_PUBLIC_API_URL is not configured. Add it to frontend/.env.');
      const response = await fetch(`${API_BASE_URL}/weather?location=${encodeURIComponent(query.trim())}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Weather service is temporarily unavailable');
      setData(result.forecast);
      setPlaceName(result.place_name);
    } catch (requestError) {
      setData(null);
      setError(requestError.message || 'Unable to load weather data. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (savedLocation) loadConditions(savedLocation);
  }, []);

  const current = data?.current;
  const daily = data?.daily;
  const todayRain = daily?.precipitation_sum?.[0] ?? 0;
  const todayEt0 = daily?.et0_fao_evapotranspiration?.[0] ?? 0;
  const moisture = current?.soil_moisture_0_to_1cm;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>Weather</Text>
      <Text style={styles.subtitle}>Live forecast and field conditions</Text>

      <View style={styles.searchRow}>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Village, city, or district"
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={() => loadConditions()}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => loadConditions()} disabled={loading}>
          <Text style={styles.searchButtonText}>Check</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />}
      {!!error && <Text style={styles.error}>{error}</Text>}

      {data && current && daily && (
        <>
          <Text style={styles.place}>📍 {placeName}</Text>
          <View style={styles.weatherCard}>
            <Text style={styles.temperature}>{Math.round(current.temperature_2m)}°C</Text>
            <View><Text style={styles.condition}>{weatherLabel(current.weather_code)}</Text><Text style={styles.muted}>Humidity {Math.round(current.relative_humidity_2m)}% · Rain now {current.precipitation} mm</Text></View>
          </View>

          <Text style={styles.sectionTitle}>Soil conditions</Text>
          <View style={styles.metricRow}>
            <Metric label="Surface soil temp." value={current.soil_temperature_0cm == null ? '—' : `${current.soil_temperature_0cm.toFixed(1)}°C`} />
            <Metric label="Surface moisture" value={moisture == null ? '—' : `${Math.round(moisture * 100)}%`} />
          </View>
          <View style={styles.adviceCard}><Text style={styles.adviceTitle}>🌱 Field advice</Text><Text style={styles.advice}>{soilAdvice(moisture, todayRain, todayEt0)}</Text></View>

          <Text style={styles.sectionTitle}>3-day farm forecast</Text>
          {daily.time.map((date, index) => (
            <View style={styles.dayRow} key={date}>
              <Text style={styles.day}>{index === 0 ? 'Today' : new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
              <Text style={styles.dayData}>{Math.round(daily.temperature_2m_min[index])}–{Math.round(daily.temperature_2m_max[index])}°C</Text>
              <Text style={styles.dayData}>🌧 {daily.precipitation_sum[index]} mm</Text>
            </View>
          ))}
          <Text style={styles.note}>Forecast soil values are model estimates for the selected area; confirm root-zone moisture in the field before irrigating.</Text>
        </>
      )}
    </ScrollView>
  );
}

function Metric({ label, value }) {
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F8F2', padding: 24, paddingTop: 62 },
  back: { color: '#2E7D32', fontSize: 16, fontWeight: '600', marginBottom: 18 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1B4332' }, subtitle: { color: '#667085', marginTop: 4, marginBottom: 22 },
  searchRow: { flexDirection: 'row', gap: 10 }, input: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#D7E5D2', paddingHorizontal: 14, height: 48 },
  searchButton: { alignItems: 'center', backgroundColor: '#2E7D32', borderRadius: 12, justifyContent: 'center', paddingHorizontal: 17 }, searchButtonText: { color: '#FFF', fontWeight: 'bold' },
  loader: { marginTop: 32 }, error: { color: '#B42318', marginTop: 18, lineHeight: 21 }, place: { color: '#475467', fontWeight: '600', marginTop: 24, marginBottom: 10 },
  weatherCard: { alignItems: 'center', backgroundColor: '#DFF1E1', borderRadius: 18, flexDirection: 'row', padding: 20 }, temperature: { color: '#1B4332', fontSize: 42, fontWeight: 'bold', marginRight: 20 }, condition: { color: '#1B4332', fontSize: 18, fontWeight: 'bold' }, muted: { color: '#52615A', fontSize: 13, marginTop: 4 },
  sectionTitle: { color: '#1B4332', fontSize: 20, fontWeight: 'bold', marginTop: 25, marginBottom: 12 }, metricRow: { flexDirection: 'row', gap: 12 }, metric: { backgroundColor: '#FFF', borderRadius: 16, elevation: 2, flex: 1, padding: 16 }, metricValue: { color: '#2E7D32', fontSize: 25, fontWeight: 'bold' }, metricLabel: { color: '#667085', fontSize: 13, marginTop: 5 },
  adviceCard: { backgroundColor: '#FFF8E1', borderRadius: 16, marginTop: 13, padding: 16 }, adviceTitle: { color: '#7A5A00', fontWeight: 'bold', fontSize: 16 }, advice: { color: '#5F530E', lineHeight: 21, marginTop: 6 },
  dayRow: { alignItems: 'center', backgroundColor: '#FFF', borderBottomColor: '#E9EFE6', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12 }, day: { color: '#344054', fontWeight: '600', width: 80 }, dayData: { color: '#475467', fontSize: 13 }, note: { color: '#667085', fontSize: 12, lineHeight: 18, marginTop: 18, marginBottom: 20 },
});

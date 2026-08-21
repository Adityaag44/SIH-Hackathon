import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLanguage } from './LanguageContext';

function makeAdvice(crop, n, p, k, question) {
  const notes = [];
  if (n < 20) notes.push('Nitrogen is low. Use compost or a crop-appropriate nitrogen dose in split applications.');
  else if (n > 80) notes.push('Nitrogen is high. Avoid another nitrogen dose now; excess can cause soft growth and pest pressure.');
  else notes.push('Nitrogen is in a moderate range. Apply only according to the crop stage and local recommendation.');
  if (p < 10) notes.push('Phosphorus is low. Place phosphorus near the root zone at planting; do not apply it directly onto wet leaves.');
  if (k < 100) notes.push('Potassium is low. Consider a crop-appropriate potash source, especially before flowering and fruit filling.');
  const q = question.toLowerCase();
  if (q.includes('yellow')) notes.push('For yellow leaves, inspect whether older leaves yellow first (often nitrogen) and check for pests, waterlogging, or root damage.');
  if (q.includes('water') || q.includes('irrigat')) notes.push('Irrigate only after checking root-zone moisture. Water early morning and avoid standing water around roots.');
  if (q.includes('pest') || q.includes('insect')) notes.push('Inspect the underside of leaves. Use integrated pest management: remove badly affected parts, use traps, and follow only label-approved treatment.');
  return `${crop || 'Your crop'}: ${notes.join(' ')}`;
}

export default function FarmerAdvisory({ navigation, route }) {
  const { t } = useLanguage();
  const crop = route.params?.profile?.cropType || ''; const [values, setValues] = useState({ nitrogen: '', phosphorus: '', potassium: '', question: '' }); const [advice, setAdvice] = useState('');
  const ask = () => setAdvice(makeAdvice(crop, Number(values.nitrogen) || 0, Number(values.phosphorus) || 0, Number(values.potassium) || 0, values.question));
  const field = (label, key, numeric = true) => <View><Text style={styles.label}>{label}</Text><TextInput style={styles.input} value={values[key]} onChangeText={(value) => setValues({ ...values, [key]: value })} keyboardType={numeric ? 'decimal-pad' : 'default'} placeholder={numeric ? t('enterSoilValue') : t('cropQuestionExample')} multiline={!numeric} /></View>;
  return <ScrollView contentContainerStyle={styles.container}><TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← {t('back')}</Text></TouchableOpacity><Text style={styles.title}>💧 {t('farmAdvisoryTitle')}</Text><Text style={styles.subtitle}>{t('advisorySubtitle')}</Text><View style={styles.card}>{field(t('nitrogen'), 'nitrogen')}{field(t('phosphorus'), 'phosphorus')}{field(t('potassium'), 'potassium')}{field(t('askCrop'), 'question', false)}<TouchableOpacity style={styles.button} onPress={ask}><Text style={styles.buttonText}>{t('getAdvice')}</Text></TouchableOpacity></View>{!!advice && <View style={styles.answer}><Text style={styles.answerTitle}>🌱 {t('advisory')}</Text><Text style={styles.answerText}>{advice}</Text><Text style={styles.disclaimer}>{t('advisoryDisclaimer')}</Text></View>}</ScrollView>;
}
const styles = StyleSheet.create({ container: { backgroundColor: '#F5F8F2', flexGrow: 1, padding: 24, paddingTop: 60 }, back: { color: '#2E7D32', fontWeight: '600', marginBottom: 18 }, title: { color: '#1B4332', fontSize: 28, fontWeight: 'bold' }, subtitle: { color: '#667085', lineHeight: 21, marginTop: 6, marginBottom: 20 }, card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16 }, label: { color: '#344054', fontWeight: '600', marginBottom: 6, marginTop: 8 }, input: { backgroundColor: '#F8FBF7', borderColor: '#D7E5D2', borderRadius: 10, borderWidth: 1, minHeight: 46, padding: 12, textAlignVertical: 'top' }, button: { alignItems: 'center', backgroundColor: '#2E7D32', borderRadius: 10, marginTop: 18, padding: 14 }, buttonText: { color: '#FFF', fontWeight: 'bold' }, answer: { backgroundColor: '#FFF8E1', borderRadius: 16, marginTop: 16, padding: 16 }, answerTitle: { color: '#735C00', fontSize: 17, fontWeight: 'bold' }, answerText: { color: '#4A460F', lineHeight: 22, marginTop: 7 }, disclaimer: { color: '#756F43', fontSize: 12, lineHeight: 18, marginTop: 12 } });

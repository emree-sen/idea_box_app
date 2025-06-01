import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Chip,
  Appbar
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const CreateProjectScreen = ({ navigation }) => {
  const [projectIdea, setProjectIdea] = useState('');

  const handleContinue = () => {
    if (!projectIdea.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir proje fikri girin.');
      return;
    }

    navigation.navigate('Chat', {
      initialMessage: projectIdea.trim(),
      projectData: {
        createdAt: new Date().toISOString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#6366F1', '#4F46E5']}
            style={styles.headerGradient}
          >
            <Appbar.Header style={styles.appbar}>
              <Appbar.BackAction onPress={() => navigation.goBack()} iconColor="#FFFFFF" />
              <Appbar.Content
                title="Yeni Proje Fikri"
                titleStyle={styles.headerTitle}
              />
            </Appbar.Header>

            <View style={styles.headerContent}>
              <Text style={styles.headerSubtitle}>
                💡 Fikirlerinizi AI ile profesyonel projelere dönüştürün
              </Text>
            </View>
          </LinearGradient>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Text Input Section */}
          <Card style={styles.textCard}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.sectionTitle}>✍️ Proje Fikrinizi Yazın</Text>

              {/* Talimatlar */}
              <Card style={styles.instructionsCard}>
                <Card.Content style={styles.instructionsContent}>
                  <Text style={styles.instructionsTitle}>📋 İyi bir proje fikri yazmanız için ipuçları:</Text>

                  <Text style={styles.instructionItem}>
                    • <Text style={styles.bold}>Ne yapacağını belirtin:</Text> Uygulamanızın temel amacı
                  </Text>
                  <Text style={styles.instructionItem}>
                    • <Text style={styles.bold}>Kimin için:</Text> Hedef kullanıcı grubu (yaş, meslek, ilgi)
                  </Text>
                  <Text style={styles.instructionItem}>
                    • <Text style={styles.bold}>Hangi sorunu çözecek:</Text> Kullanıcıların hangi ihtiyacını karşılayacak
                  </Text>
                  <Text style={styles.instructionItem}>
                    • <Text style={styles.bold}>Ana özellikler:</Text> Temel 2-3 özellik neler olacak
                  </Text>
                  <Text style={styles.instructionItem}>
                    • <Text style={styles.bold}>Farkınız:</Text> Benzer uygulamalardan ne ile ayrılacak
                  </Text>

                  <Text style={styles.exampleTitle}>✅ İyi örnek:</Text>
                  <Text style={styles.exampleText}>
                    "Üniversite öğrencileri için ders notlarını paylaşabilecekleri sosyal platform.
                    Öğrenciler notlarını yükleyip puan kazanacak, kaliteli notları bulup indirebilecek.
                    Ana özellikler: not yükleme/indirme, puanlama sistemi, ders kategorileri.
                    Farkı: gamification sistemi ile motivasyon artırımı."
                  </Text>
                </Card.Content>
              </Card>

              <TextInput
                mode="outlined"
                value={projectIdea}
                onChangeText={setProjectIdea}
                placeholder="Örnek: Fitness tutkunları için kişisel antrenör bulunan ve beslenme takibi yapabilen uygulama. Kullanıcılar..."
                multiline
                numberOfLines={8}
                style={styles.textInput}
                outlineColor="#E5E7EB"
                activeOutlineColor="#6366F1"
                placeholderTextColor="#6B7280"
                onFocus={() => {
                  setTimeout(() => {
                    // Bu scroll işlemi otomatik olarak KeyboardAvoidingView tarafından yapılacak
                  }, 300);
                }}
              />

              <Text style={styles.suggestionsTitle}>💡 Hızlı başlangıç fikirleri:</Text>
              <View style={styles.suggestionChips}>
                <Chip
                  mode="outlined"
                  style={styles.chip}
                  onPress={() => setProjectIdea('Küçük işletmeler için stok yönetimi uygulaması. Esnafların ürün stoklarını takip edip, azalan ürünler için otomatik uyarı alabilecekleri sistem. Ana özellikler: barkod okuma, stok takibi, satış raporları.')}
                >
                  Stok Yönetimi
                </Chip>
                <Chip
                  mode="outlined"
                  style={styles.chip}
                  onPress={() => setProjectIdea('Öğrenciler için ders programı ve not takip uygulaması. Dersler, ödevler, sınavları organize edip hatırlatma alabilen sistem. Ana özellikler: takvim entegrasyonu, not ortalaması hesaplama, ödev takibi.')}
                >
                  Öğrenci Takip
                </Chip>
                <Chip
                  mode="outlined"
                  style={styles.chip}
                  onPress={() => setProjectIdea('Komşuluk yardımlaşması için sosyal platform. İnsanların birbirinden küçük hizmetler alıp verebileceği sistem. Ana özellikler: hizmet listeleme, değerlendirme sistemi, mesajlaşma, konum bazlı eşleştirme.')}
                >
                  Komşuluk Ağı
                </Chip>
                <Chip
                  mode="outlined"
                  style={styles.chip}
                  onPress={() => setProjectIdea('Pet sahipleri için veteriner randevusu ve bakım takibi uygulaması. Evcil hayvan sahiplerinin vet randevusu alıp aşı takibi yapabilecekleri sistem. Ana özellikler: randevu sistemi, aşı takvimi, pet profili.')}
                >
                  Pet Bakım
                </Chip>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleContinue}
            disabled={!projectIdea.trim()}
            style={styles.continueButton}
            icon="arrow-right"
          >
            AI ile Devam Et
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingBottom: 16,
    paddingTop: 8,
  },
  appbar: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerSubtitle: {
    color: '#E5E7EB',
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  textCard: {
    borderRadius: 16,
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  textInput: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    minHeight: 120,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    color: '#6B7280',
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  continueButton: {
    borderRadius: 12,
    backgroundColor: '#6366F1',
    paddingVertical: 4,
  },
  instructionsCard: {
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  instructionsContent: {
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: '#374151',
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginTop: 12,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 13,
    color: '#065F46',
    fontStyle: 'italic',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    borderLeft: 3,
    borderLeftColor: '#10B981',
  },
});

export default CreateProjectScreen;
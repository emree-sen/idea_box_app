import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Animated
} from 'react-native';
import {
  Text,
  Card,
  Button,
  IconButton,
  Divider,
  Appbar,
  Switch,
  List
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme } from '../theme/AppTheme';

const SettingsScreen = ({ navigation }) => {
  const theme = lightTheme;
  const [autoSave, setAutoSave] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const clearAllData = async () => {
    Alert.alert(
      'Tüm Verileri Sil',
      'Tüm projeleriniz ve ayarlarınız silinecek. Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Başarılı', 'Tüm veriler temizlendi.');
            } catch (error) {
              Alert.alert('Hata', 'Veriler temizlenirken hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={theme.colors.gradient.primary}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <Appbar.Header style={styles.appbar}>
            <Appbar.Content
              title="Ayarlar"
              titleStyle={styles.headerTitle}
            />
          </Appbar.Header>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>
            🔧 Uygulama ayarlarını buradan yönetebilirsiniz
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Card style={[styles.settingsCard, theme.shadows.medium]}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.sectionTitle}>📱 Uygulama Ayarları</Text>

              <List.Item
                title="Otomatik Kaydetme"
                description="Projeler otomatik olarak kaydedilsin"
                left={() => <List.Icon icon="content-save" color={theme.colors.primary} />}
                right={() => (
                  <Switch
                    value={autoSave}
                    onValueChange={setAutoSave}
                    color={theme.colors.primary}
                  />
                )}
                style={styles.listItem}
              />

              <List.Item
                title="Sesli Özellikler"
                description="Ses kaydı ve okuma özellikleri"
                left={() => <List.Icon icon="microphone" color={theme.colors.primary} />}
                right={() => (
                  <Switch
                    value={voiceEnabled}
                    onValueChange={setVoiceEnabled}
                    color={theme.colors.primary}
                  />
                )}
                style={styles.listItem}
              />

              <List.Item
                title="Bildirimler"
                description="Uygulama bildirimleri"
                left={() => <List.Icon icon="bell" color={theme.colors.primary} />}
                right={() => (
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    color={theme.colors.primary}
                  />
                )}
                style={styles.listItem}
              />
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Card style={[styles.settingsCard, theme.shadows.medium]}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.sectionTitle}>🗂️ Veri Yönetimi</Text>

              <List.Item
                title="Tüm Verileri Temizle"
                description="Projeler ve ayarları sil"
                left={() => <List.Icon icon="delete-sweep" color={theme.colors.error} />}
                onPress={clearAllData}
                style={styles.listItem}
              />
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Card style={[styles.settingsCard, theme.shadows.medium]}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.sectionTitle}>ℹ️ Hakkında</Text>

              <View style={styles.aboutContent}>
                <Text style={styles.aboutTitle}>App Creator AI</Text>
                <Text style={styles.aboutVersion}>Versiyon 1.0.0</Text>
                <Text style={styles.aboutDescription}>
                  AI destekli proje template oluşturucu. Fikirlerinizi profesyonel projelere dönüştürün.
                </Text>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingBottom: 16,
  },
  headerTop: {
    paddingTop: 4,
  },
  appbar: {
    backgroundColor: 'transparent',
    elevation: 0,
    minHeight: 48,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
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
  section: {
    marginBottom: 16,
  },
  settingsCard: {
    borderRadius: 16,
  },
  cardContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  aboutContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SettingsScreen;
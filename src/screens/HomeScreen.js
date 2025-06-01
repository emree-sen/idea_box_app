import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Animated } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, Chip, Text, Appbar, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { GeminiService } from '../services/GeminiService';

const HomeScreen = ({ navigation, route }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = new Animated.Value(0);

  // Her tab focus olduğunda projeleri yeniden yükle
  useFocusEffect(
    React.useCallback(() => {
      loadProjects();
      // Fade in animasyonu
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, [])
  );

  // Route params değişikliklerini izle
  useEffect(() => {
    if (route?.params?.refresh) {
      loadProjects();
    }
  }, [route?.params]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);

      const savedProjects = await AsyncStorage.getItem('projects');

      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('❌ HomeScreen: Projeler yüklenirken hata:', error);
      Alert.alert('Hata', 'Projeler yüklenirken bir hata oluştu: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadProject = async (project) => {
    try {
      const fileName = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_template.txt`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, project.template);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Başarılı', `Proje template'i ${fileName} olarak kaydedildi.`);
      }
    } catch (error) {
      Alert.alert('Hata', 'Dosya indirilemedi: ' + error.message);
    }
  };

  const deleteProject = async (projectId) => {
    Alert.alert(
      'Projeyi Sil',
      'Bu projeyi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedProjects = projects.filter(p => p.id !== projectId);
              setProjects(updatedProjects);
              await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
              console.log('🗑️ Proje silindi, kalan proje sayısı:', updatedProjects.length);
            } catch (error) {
              console.error('❌ Proje silinirken hata:', error);
              Alert.alert('Hata', 'Proje silinemedi: ' + error.message);
            }
          }
        }
      ]
    );
  };

  const clearAllProjects = async () => {
    Alert.alert(
      'Tüm Projeleri Sil',
      'Tüm projeleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Tümünü Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('projects');
              setProjects([]);
              console.log('🗑️ Tüm projeler silindi');
            } catch (error) {
              console.error('❌ Projeler silinirken hata:', error);
            }
          }
        }
      ]
    );
  };

  const renderProject = ({ item, index }) => {
    return (
      <View style={styles.simpleCard}>
        <Text style={styles.simpleTitle}>{item.title}</Text>
        <Text style={styles.simpleDescription}>{item.description}</Text>

        {/* Verimlilik istatistikleri */}
        {item.stats && (
          <View style={styles.predictionStats}>
            <Text style={styles.statsTitle}>📊 Başarı Tahmini</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>📥 Tahmini İndirme:</Text>
              <Text style={styles.statValue}>{item.stats.expectedInstalls.toLocaleString('tr-TR')}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>⭐ Tahmini Rating:</Text>
              <Text style={styles.statValue}>{item.stats.expectedRating}/5.0</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>💬 Tahmini Yorum:</Text>
              <Text style={styles.statValue}>{item.stats.expectedReviews.toLocaleString('tr-TR')}</Text>
            </View>
            <Text style={styles.successCategory}>{item.stats.successCategory}</Text>
          </View>
        )}

        <Text style={styles.simpleDate}>
          📅 {new Date(item.createdAt).toLocaleDateString('tr-TR')}
        </Text>

        <View style={styles.simpleActions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ProjectDetail', { project: item })}
            style={styles.simpleButton}
          >
            Görüntüle
          </Button>
          <Button
            mode="outlined"
            onPress={() => deleteProject(item.id)}
            style={styles.simpleButton}
          >
            Sil
          </Button>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={['#6366F1', '#4F46E5']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <Appbar.Header style={styles.appbar}>
            <Appbar.Content
              title="Projelerim"
              titleStyle={styles.headerTitle}
            />
            {projects.length > 0 && (
              <Appbar.Action
                icon="delete-sweep"
                onPress={clearAllProjects}
                iconColor="#FFFFFF"
              />
            )}
          </Appbar.Header>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            💡 {projects.length} Proje {isLoading && '(Yükleniyor...)'}
          </Text>
          <Text style={styles.statsSubtext}>
            Fikirleriniz gerçeğe dönüşüyor
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={['#F0F4FF', '#E5EDFF']}
        style={styles.emptyGradient}
      >
        <Text style={styles.emptyIcon}>🚀</Text>
        <Text style={styles.emptyTitle}>
          {isLoading ? 'Projeler yükleniyor...' : 'İlk projenizi oluşturun!'}
        </Text>
        {!isLoading && (
          <Text style={styles.emptySubtext}>
            Fikirlerinizi AI ile profesyonel projelere dönüştürün
          </Text>
        )}
      </LinearGradient>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      {renderHeader()}

      {projects.length === 0 ? renderEmptyState() : (
        <FlatList
          data={projects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={loadProjects}
        />
      )}

      <FAB
        style={[styles.fab, { backgroundColor: '#6366F1' }]}
        icon="plus"
        onPress={() => navigation.navigate('Create')}
        color="#FFFFFF"
        size="medium"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 12,
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
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  statsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSubtext: {
    color: '#E5E7EB',
    fontSize: 14,
    marginTop: 2,
  },
  listContainer: {
    padding: 16,
    paddingTop: 4,
  },
  emptyContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  emptyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#374151',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  // Basit card stilleri
  simpleCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  simpleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  simpleDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  simpleDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  simpleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  simpleButton: {
    flex: 1,
  },
  predictionStats: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  successCategory: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
    marginTop: 8,
    textAlign: 'center',
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 6,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default HomeScreen;
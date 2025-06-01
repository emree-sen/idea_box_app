import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Modal,
  Portal,
  TextInput,
  Appbar,
  Chip,
  Divider,
  IconButton
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ProjectDetailScreen = ({ route, navigation }) => {
  const { project } = route.params;
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editableTemplate, setEditableTemplate] = useState(project.template);
  const [isUpdating, setIsUpdating] = useState(false);

  const downloadTemplate = async () => {
    try {
      const fileName = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_template.txt`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, editableTemplate);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Başarılı', `Template ${fileName} olarak kaydedildi.`);
      }
    } catch (error) {
      Alert.alert('Hata', 'Template indirilemedi: ' + error.message);
    }
  };

  const saveTemplateChanges = async () => {
    try {
      setIsUpdating(true);

      // AsyncStorage'dan mevcut projeleri al
      const existingProjects = await AsyncStorage.getItem('projects');
      const projects = existingProjects ? JSON.parse(existingProjects) : [];

      // Bu projeyi güncelle
      const updatedProjects = projects.map(p =>
        p.id === project.id
          ? { ...p, template: editableTemplate, updatedAt: new Date().toISOString() }
          : p
      );

      // AsyncStorage'a kaydet
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));

      setShowTemplateEditor(false);
      Alert.alert('Başarılı', 'Template güncellemeleri kaydedildi!');

      console.log('✅ Template güncellendi');
    } catch (error) {
      console.error('❌ Template güncellenirken hata:', error);
      Alert.alert('Hata', 'Template güncellenemedi: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProject = async () => {
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
              const existingProjects = await AsyncStorage.getItem('projects');
              const projects = existingProjects ? JSON.parse(existingProjects) : [];

              const updatedProjects = projects.filter(p => p.id !== project.id);
              await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));

              Alert.alert('Başarılı', 'Proje silindi', [
                { text: 'Tamam', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Hata', 'Proje silinemedi: ' + error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#ffffff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#6366F1', '#4f46e5']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <Appbar.Header style={styles.appbar}>
              <Appbar.BackAction onPress={() => navigation.goBack()} iconColor="#FFFFFF" />
              <Appbar.Content
                title={project.title}
                subtitle="Proje Detayları"
                titleStyle={styles.headerTitle}
                subtitleStyle={styles.headerSubtitle}
              />
              <Appbar.Action
                icon="delete"
                onPress={deleteProject}
                iconColor="#FFFFFF"
              />
            </Appbar.Header>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Proje Bilgileri */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.projectTitle}>
              {project.title}
            </Text>

            <Text variant="bodyMedium" style={styles.description}>
              {project.description}
            </Text>

            <View style={styles.chipContainer}>
              <Chip mode="outlined" style={styles.chip}>
                📅 {new Date(project.createdAt).toLocaleDateString('tr-TR')}
              </Chip>
              {project.category && (
                <Chip mode="outlined" style={styles.chip}>
                  🏷️ {project.category}
                </Chip>
              )}
              {project.updatedAt && (
                <Chip mode="outlined" style={styles.chip}>
                  🔄 Güncellendi: {new Date(project.updatedAt).toLocaleDateString('tr-TR')}
                </Chip>
              )}
            </View>

            {project.originalIdea && (
              <View style={styles.originalIdeaContainer}>
                <Text variant="labelMedium" style={styles.originalIdeaLabel}>
                  💡 Orijinal Fikir:
                </Text>
                <Text variant="bodySmall" style={styles.originalIdea}>
                  "{project.originalIdea}"
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Template Görüntüleme */}
        <Card style={styles.templateCard}>
          <Card.Content>
            <View style={styles.templateHeader}>
              <Text variant="headlineSmall" style={styles.templateTitle}>
                📋 Proje Template'i
              </Text>
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => setShowTemplateEditor(true)}
                style={styles.editIcon}
              />
            </View>

            <Divider style={styles.divider} />

            <ScrollView style={styles.templateScroll} nestedScrollEnabled>
              <Text variant="bodyMedium" style={styles.templateText}>
                {editableTemplate}
              </Text>
            </ScrollView>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => setShowTemplateEditor(true)}
            style={styles.editButton}
            icon="pencil"
          >
            Template'i Düzenle
          </Button>

          <Button
            mode="contained"
            onPress={downloadTemplate}
            style={styles.downloadButton}
            icon="download"
          >
            Template'i Paylaş
          </Button>
        </View>
      </ScrollView>

      {/* Template Editor Modal */}
      <Portal>
        <Modal
          visible={showTemplateEditor}
          onDismiss={() => setShowTemplateEditor(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Appbar.Header>
            <Appbar.BackAction onPress={() => setShowTemplateEditor(false)} />
            <Appbar.Content title="Template Düzenle" />
            <Appbar.Action
              icon="check"
              onPress={saveTemplateChanges}
              disabled={isUpdating}
            />
          </Appbar.Header>

          <View style={styles.editorContainer}>
            <TextInput
              mode="outlined"
              value={editableTemplate}
              onChangeText={setEditableTemplate}
              multiline
              style={styles.templateEditor}
              placeholder="Template içeriğini buradan düzenleyebilirsiniz..."
              disabled={isUpdating}
            />

            <View style={styles.editorActions}>
              <Button
                mode="outlined"
                onPress={() => setShowTemplateEditor(false)}
                style={styles.cancelButton}
                disabled={isUpdating}
              >
                İptal
              </Button>
              <Button
                mode="contained"
                onPress={saveTemplateChanges}
                style={styles.saveButton}
                loading={isUpdating}
                disabled={isUpdating}
              >
                Kaydet
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
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
    paddingBottom: 12,
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
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#E5E7EB',
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 4,
  },
  projectTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6366F1',
  },
  description: {
    lineHeight: 22,
    marginBottom: 12,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
  },
  originalIdeaContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  originalIdeaLabel: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#6366F1',
  },
  originalIdea: {
    fontStyle: 'italic',
    color: '#555',
  },
  templateCard: {
    marginBottom: 16,
    elevation: 4,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateTitle: {
    fontWeight: 'bold',
    color: '#6366F1',
  },
  editIcon: {
    margin: 0,
  },
  divider: {
    marginVertical: 12,
  },
  templateScroll: {
    maxHeight: 400,
  },
  templateText: {
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
    borderColor: '#6366F1',
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#4caf50',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 50,
    borderRadius: 8,
  },
  editorContainer: {
    flex: 1,
    padding: 16,
  },
  templateEditor: {
    flex: 1,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 16,
  },
  editorActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6366F1',
  },
});

export default ProjectDetailScreen;
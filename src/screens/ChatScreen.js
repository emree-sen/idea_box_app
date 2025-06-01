import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
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
  ActivityIndicator,
  IconButton,
  Modal,
  Portal,
  Appbar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeminiService } from '../services/GeminiService';

const ChatScreen = ({ route, navigation }) => {
  const { initialMessage, projectData } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectTemplate, setProjectTemplate] = useState(null);
  const [isTemplateComplete, setIsTemplateComplete] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editableTemplate, setEditableTemplate] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    const welcomeMessage = {
      id: `welcome-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: `Merhaba! Proje fikrinizi aldım: "${initialMessage}"\n\n✨ Size birkaç akıllı soru soracağım ve hızlıca profesyonel bir proje template'i oluşturacağım. Minimum soru, maksimum verimlilik!`,
      isUser: false,
      timestamp: new Date().toISOString()
    };

    setMessages([welcomeMessage]);

    // İlk soruyu sor
    setTimeout(() => {
      askFirstQuestion();
    }, 1500);
  };

  const askFirstQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await GeminiService.getFirstQuestion(initialMessage);

      // JSON response mı kontrol et
      if (typeof response === 'object' && response.isComplete) {
        // AI direkt template oluşturmuş
        console.log('🎯 AI direkt template oluşturdu:', response);
        setProjectTemplate(response.template);
        setEditableTemplate(response.template.fullTemplate);
        setIsTemplateComplete(true);

        const successMessage = {
          id: `success-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: response.message,
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, successMessage]);
        showTemplateCompleteMessage();

      } else if (typeof response === 'object' && !response.isComplete) {
        // AI soru soruyor
        const aiMessage = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: response.message,
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);

      } else {
        // String response (eski format)
        const aiMessage = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: response,
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error) {
      console.error('İlk soru alınamadı:', error);
      const fallbackMessage = {
        id: `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: "Anlıyorum! Fikriniz çok net. 🎯 Hemen profesyonel template'inizi hazırlamaya geçiyorum...",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackMessage]);
      // Hızlı template oluşturma için fallback
      setTimeout(() => {
        proceedToTemplateCreation();
      }, 1000);
    }
    setIsLoading(false);
  };

  const proceedToTemplateCreation = async () => {
    setIsLoading(true);
    try {
      const response = await GeminiService.processUserResponse(
        messages,
        initialMessage,
        projectData
      );

      if (response.isComplete) {
        setProjectTemplate(response.template);
        setEditableTemplate(response.template.fullTemplate);
        setIsTemplateComplete(true);
        showTemplateCompleteMessage();
      } else {
        const aiMessage = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: response.message,
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Template oluşturulamadı:', error);
      const errorMessage = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: "Template oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage];
      const response = await GeminiService.processUserResponse(
        conversationHistory,
        initialMessage,
        projectData
      );

      console.log('📥 sendMessage response type:', typeof response);
      console.log('📥 sendMessage response:', response);

      // JSON response handling
      if (typeof response === 'object' && response.isComplete) {
        // AI template oluşturmuş
        console.log('🎯 AI template oluşturdu (sendMessage):', response);
        setProjectTemplate(response.template);
        setEditableTemplate(response.template.fullTemplate);
        setIsTemplateComplete(true);

        const successMessage = {
          id: `success-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: response.message,
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, successMessage]);
        showTemplateCompleteMessage();

      } else if (typeof response === 'object' && !response.isComplete) {
        // AI soru soruyor
        const aiMessage = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: response.message,
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);

      } else {
        // String response (fallback)
        console.log('⚠️ String response received in sendMessage:', response);
        const aiMessage = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: typeof response === 'string' ? response : response.message || 'Yanıt alınamadı',
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
      const errorMessage = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const showTemplateCompleteMessage = () => {
    const completeMessage = {
      id: `complete-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: "🎉 Harika! Proje template'iniz hazır. Template'i görüntüleyebilir, düzenleyebilir ve projenizi kaydedebilirsiniz.",
      isUser: false,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, completeMessage]);
  };

  const saveProject = async () => {
    try {
      const project = {
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: projectTemplate?.title || 'Yeni Proje',
        description: projectTemplate?.description || initialMessage,
        template: editableTemplate || projectTemplate?.fullTemplate || 'Template oluşturulamadı',
        category: projectTemplate?.category || 'Genel',
        createdAt: new Date().toISOString(),
        originalIdea: initialMessage,
        conversationHistory: messages
      };

      console.log('💾 Proje kaydediliyor:', project.title);

      const existingProjects = await AsyncStorage.getItem('projects');
      const projects = existingProjects ? JSON.parse(existingProjects) : [];
      projects.unshift(project);

      await AsyncStorage.setItem('projects', JSON.stringify(projects));
      console.log('✅ Proje başarıyla kaydedildi, toplam proje sayısı:', projects.length);

      Alert.alert(
        'Başarılı!',
        'Proje template\'iniz kaydedildi.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              // Basit navigation - önce geri git, sonra Home'a git
              navigation.goBack(); // CreateProject'e geri dön
              setTimeout(() => {
                navigation.getParent()?.jumpTo('Home'); // Home tab'ına geç
              }, 100);
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Proje kaydedilemedi:', error);
      Alert.alert('Hata', 'Proje kaydedilemedi: ' + error.message);
    }
  };

  const openTemplateEditor = () => {
    setShowTemplateEditor(true);
  };

  const closeTemplateEditor = () => {
    setShowTemplateEditor(false);
  };

  const saveTemplateEdits = () => {
    setShowTemplateEditor(false);
    Alert.alert('Başarılı', 'Template değişiklikleriniz kaydedildi!');
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      {item.isUser ? (
        <View style={styles.userMessageContent}>
          <Text style={styles.userMessageText}>{item.text}</Text>
          <Text style={styles.messageTime}>
            {new Date(item.timestamp).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      ) : (
        <View style={styles.aiMessageContent}>
          <Text style={styles.aiMessageText}>{item.text}</Text>
          <Text style={styles.messageTime}>
            {new Date(item.timestamp).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      )}
    </View>
  );

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
                title="AI Asistan"
                subtitle="Proje template'i oluşturuluyor"
                titleStyle={styles.headerTitle}
                subtitleStyle={styles.headerSubtitle}
              />
            </Appbar.Header>
          </LinearGradient>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
        />

        {/* Loading */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6366F1" />
            <Text style={styles.loadingText}>AI düşünüyor...</Text>
          </View>
        )}

        {/* Template Complete Actions */}
        {isTemplateComplete && (
          <View style={styles.templateActions}>
            <Card style={styles.templateCard}>
              <Card.Content>
                <Text style={styles.templateTitle}>🎉 Template Hazır!</Text>
                <Text style={styles.templateSubtitle}>Projeniz başarıyla oluşturuldu</Text>

                <View style={styles.templateButtons}>
                  <Button
                    mode="outlined"
                    onPress={openTemplateEditor}
                    style={styles.templateButton}
                  >
                    Düzenle
                  </Button>
                  <Button
                    mode="contained"
                    onPress={saveProject}
                    style={styles.templateButton}
                    buttonColor="#10B981"
                  >
                    Kaydet
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Input */}
        {!isTemplateComplete && (
          <View style={styles.inputContainer}>
            <View style={styles.inputContent}>
              <TextInput
                mode="outlined"
                value={inputText}
                onChangeText={setInputText}
                placeholder="Mesajınızı yazın..."
                style={styles.textInput}
                multiline
                disabled={isLoading}
                outlineColor="#E5E7EB"
                activeOutlineColor="#6366F1"
              />
              <IconButton
                icon="send"
                size={24}
                onPress={sendMessage}
                disabled={!inputText.trim() || isLoading}
                style={[
                  styles.sendButton,
                  { backgroundColor: inputText.trim() ? '#6366F1' : '#E5E7EB' }
                ]}
                iconColor="#FFFFFF"
              />
            </View>
          </View>
        )}

        {/* Template Editor Modal */}
        <Portal>
          <Modal
            visible={showTemplateEditor}
            onDismiss={closeTemplateEditor}
            contentContainerStyle={styles.modalContainer}
          >
            <Appbar.Header>
              <Appbar.BackAction onPress={closeTemplateEditor} />
              <Appbar.Content title="Template Düzenle" />
              <Appbar.Action icon="check" onPress={saveTemplateEdits} />
            </Appbar.Header>

            <View style={styles.editorContainer}>
              <TextInput
                mode="outlined"
                value={editableTemplate}
                onChangeText={setEditableTemplate}
                multiline
                style={styles.templateEditor}
                placeholder="Template içeriğini buradan düzenleyebilirsiniz..."
              />
            </View>
          </Modal>
        </Portal>
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
    marginBottom: 8,
  },
  headerGradient: {
    paddingBottom: 8,
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
  headerSubtitle: {
    color: '#E5E7EB',
    fontSize: 12,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  userMessageContent: {
    backgroundColor: '#6366F1',
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 4,
  },
  aiMessageContent: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiMessageText: {
    color: '#374151',
    fontSize: 16,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#6B7280',
  },
  templateActions: {
    padding: 16,
  },
  templateCard: {
    borderRadius: 16,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  templateSubtitle: {
    fontSize: 14,
    color: '#065F46',
    marginBottom: 16,
  },
  templateButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  templateButton: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    minHeight: 70,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 50,
    borderRadius: 16,
  },
  editorContainer: {
    flex: 1,
    padding: 16,
  },
  templateEditor: {
    flex: 1,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});

export default ChatScreen;
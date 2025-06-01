# App Creator - Mobil Uygulama Fikri Geliştirici

Bu React Native Expo uygulaması, kullanıcıların mobil uygulama fikirlerini sesli veya yazılı olarak paylaşmalarını ve AI asistanı ile etkileşime girerek detaylı proje template'leri oluşturmalarını sağlar.

## 🚀 Özellikler

- **Sesli ve Yazılı Girdi**: Proje fikirlerinizi yazarak veya sesle anlatabilirsiniz
- **AI Asistan**: Gemini API ile güçlendirilmiş akıllı soru-cevap sistemi
- **Proje Template Oluşturma**: Detaylı ve profesyonel proje template'leri
- **Proje Yönetimi**: Oluşturulan projeleri kaydetme, görüntüleme ve silme
- **Dosya İndirme**: Template'leri TXT formatında indirme
- **Modern UI**: React Native Paper ile güzel ve kullanıcı dostu arayüz

## 📱 Ekranlar

1. **Ana Ekran (HomeScreen)**: Kaydedilmiş proje fikirlerini listeler
2. **Proje Oluşturma (CreateProjectScreen)**: Yeni proje fikri girişi
3. **Chat Ekranı (ChatScreen)**: AI asistan ile etkileşim

## 🛠️ Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- Expo CLI
- Gemini API anahtarı

### Adımlar

1. **Projeyi klonlayın**
   ```bash
   git clone <repository-url>
   cd app_creator_app
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Gemini API anahtarını yapılandırın**
   
   `src/services/GeminiService.js` dosyasında `GEMINI_API_KEY` değişkenini kendi API anahtarınızla değiştirin:
   
   ```javascript
   const GEMINI_API_KEY = 'YOUR_ACTUAL_GEMINI_API_KEY';
   ```
   
   Gemini API anahtarı almak için: https://makersuite.google.com/app/apikey

4. **Uygulamayı başlatın**
   ```bash
   npm start
   ```

## 🔧 API Yapılandırması

### Gemini API Anahtarı Alma

1. [Google AI Studio](https://makersuite.google.com/app/apikey) adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" butonuna tıklayın
4. Oluşturulan anahtarı kopyalayın
5. `src/services/GeminiService.js` dosyasında `YOUR_GEMINI_API_KEY_HERE` yerine yapıştırın

### Güvenlik Notu
Üretim ortamında API anahtarını environment variable olarak kullanın:

```javascript
const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || 'fallback-key';
```

## 📦 Kullanılan Paketler

- **@react-navigation/native**: Navigasyon
- **@react-navigation/stack**: Stack navigasyon
- **@react-navigation/bottom-tabs**: Tab navigasyon
- **react-native-paper**: UI bileşenleri
- **expo-av**: Ses kayıt ve çalma
- **expo-speech**: Metni sesli okuma
- **expo-file-system**: Dosya işlemleri
- **expo-sharing**: Dosya paylaşma
- **@react-native-async-storage/async-storage**: Yerel veri saklama

## 🎯 Kullanım

### 1. Yeni Proje Fikri Oluşturma
- Ana ekranda "+" butonuna tıklayın
- Proje fikrinizi yazın veya "Ses Kaydı Başlat" ile sesle anlatın
- "AI Asistan ile Devam Et" butonuna tıklayın

### 2. AI Asistan ile Etkileşim
- AI asistanı size proje hakkında sorular soracak
- Soruları yanıtlayarak proje detaylarını geliştirin
- Yeterli bilgi toplandığında template otomatik oluşturulacak

### 3. Proje Template'ini Kaydetme
- Template hazır olduğunda "Projeyi Kaydet" butonuna tıklayın
- Proje ana ekranda görünecek
- "İndir" butonu ile TXT formatında indirebilirsiniz

## 🔊 Ses Özellikleri

### Ses Kaydı
- Mikrofon izni gerektirir
- Yüksek kaliteli ses kaydı
- Kayıt sırasında görsel geri bildirim

### Metni Sesli Okuma
- Türkçe TTS desteği
- Ayarlanabilir hız ve ton
- Girilen metni sesli okuma

## 💾 Veri Saklama

Uygulama AsyncStorage kullanarak verileri yerel olarak saklar:
- Proje fikirleri
- Template'ler
- Konuşma geçmişi

## 🎨 UI/UX Özellikleri

- **Material Design**: React Native Paper ile modern tasarım
- **Responsive**: Farklı ekran boyutlarına uyumlu
- **Accessibility**: Erişilebilirlik desteği
- **Dark/Light Theme**: Sistem temasına uyum

## 🚀 Geliştirme

### Proje Yapısı
```
src/
├── screens/
│   ├── HomeScreen.js
│   ├── CreateProjectScreen.js
│   └── ChatScreen.js
├── services/
│   └── GeminiService.js
└── components/
    └── (gelecek bileşenler)
```

### Yeni Özellik Ekleme
1. Yeni screen'ler `src/screens/` klasörüne
2. Yeni servisler `src/services/` klasörüne
3. Yeniden kullanılabilir bileşenler `src/components/` klasörüne

## 📱 Platform Desteği

- **iOS**: Tam destek (mikrofon izinleri dahil)
- **Android**: Tam destek (ses kayıt izinleri dahil)
- **Web**: Temel destek (ses özellikleri sınırlı)

## 🔮 Gelecek Özellikler

- [ ] Ses kayıtlarını metne çevirme (Speech-to-Text)
- [ ] Proje template'lerini farklı formatlarda export etme
- [ ] Proje kategorileri ve filtreleme
- [ ] Kullanıcı hesapları ve bulut senkronizasyonu
- [ ] Proje paylaşma özellikleri
- [ ] Gelişmiş AI önerileri

## 🐛 Bilinen Sorunlar

- Ses kayıtlarının metne çevrilmesi henüz implement edilmedi
- Web platformunda ses özellikleri sınırlı
- Çok uzun konuşmalarda performans sorunları olabilir

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için issue açabilir veya email gönderebilirsiniz.

---

**Not**: Gemini API anahtarınızı güvenli tutun ve public repository'lerde paylaşmayın! 
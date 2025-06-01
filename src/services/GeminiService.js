import Constants from 'expo-constants';

// Gemini API anahtarınızı buraya ekleyin
const GEMINI_API_KEY = 'AIzaSyB7lpYwj2s_BRZeWMfoYp-E38I8zF4dQ-s';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

class GeminiService {
  static async makeRequest(prompt) {
    try {
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      };

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  static async getFirstQuestion(projectIdea) {
    const prompt = `
Kullanıcı bu mobil uygulama fikrini verdi: "${projectIdea}"

Eğer fikir detaylıysa (10+ kelime) direkt template oluştur.
Eğer çok basitse (3-5 kelime) kısa bir soru sor.

JSON formatında yanıt ver:

Detaylı fikir için:
{
  "isComplete": true,
  "message": "Template'iniz hazır!",
  "template": {
    "title": "[Proje adı]",
    "description": "[Kısa açıklama]",
    "category": "[Kategori]",
    "fullTemplate": "[Basit markdown template]"
  }
}

Basit fikir için:
{
  "isComplete": false,
  "message": "[Tek soru]"
}

Template formatı:
# [Proje Adı]

## Proje Özeti ve Teknoloji Yığını

**Projenin Amacı:**
[Projenin ne yapacağı, hangi problemi çözeceği, hedef kitle]

**Dosya yapısı:**
- src/components/common/
- src/components/screens/
- src/services/
- src/context/
- src/utils/
- src/assets/

**Teknoloji Yığını:**
- React Native
- React Navigation
- Firebase Auth
- Firestore
- AsyncStorage
- React Native Paper

---

**Proje Durumu Takibi**

Bu dosya, projenin yapılacaklar listesini ve ilerleme durumunu takip etmek için kullanılır.

**AI Asistanı İçin Talimatlar:**
- Yukarıdaki Proje Özeti ve Teknoloji Yığını'nı inceleyerek projenin amacını ve kullanılacak araçları anla.
- Bu dosya projenin yapılacaklar listesini içerir. Lütfen aşağıdaki görev listesini referans al.
- Bir görevi tamamladığında veya önemli bir ilerleme kaydettiğinde, ilgili görevin başındaki [ ] işaretini [x] olarak güncelle.
- Yaptığın önemli güncellemeleri veya tamamladığın adımları aşağıdaki Geliştirme Günlüğü bölümüne, tarih belirterek ekle.
- Log formatı: YYYY-MM-DD: Tamamlanan görev veya yapılan önemli değişiklik açıklaması.
- Dosyayı her güncellemeden sonra kaydet.
- Kod yazarken türkçe JSDoc açıklamaları ekle.
- Kodunu modüler, gerektiğinde geliştirilebilir şekilde yaz.

---

## Yapılacaklar Listesi

### Faz 1: Temel Yapı (1-2 hafta)
- [ ] Proje kurulumu ve dependency management
- [ ] React Navigation yapısı (Stack + Bottom Tabs)
- [ ] Firebase proje kurulumu ve config
- [ ] Authentication flow (giriş/kayıt ekranları)
- [ ] Ana UI bileşenleri oluşturma
- [ ] Temel ekran yapıları

### Faz 2: Ana Özellikler (2-3 hafta)
- [ ] [Ana özellik 1] implementasyonu
- [ ] [Ana özellik 2] implementasyonu
- [ ] [Ana özellik 3] implementasyonu
- [ ] Firestore CRUD operations
- [ ] Form validations
- [ ] Error handling

### Faz 3: İyileştirmeler (1 hafta)
- [ ] UI/UX iyileştirmeleri
- [ ] Performance optimizasyonu
- [ ] Test yazma
- [ ] App store hazırlıkları
- [ ] Son kontroller

---

## Geliştirme Günlüğü (AI Tarafından)

*Henüz başlangıç aşamasında. İlerleme kayıtları burada görünecek.*
`;

    const response = await this.makeRequest(prompt);

    try {
      // Basit JSON temizleme
      let cleanResponse = response.trim();
      cleanResponse = cleanResponse.replace(/```json/g, '').replace(/```/g, '');

      const jsonStart = cleanResponse.indexOf('{');
      const jsonEnd = cleanResponse.lastIndexOf('}') + 1;

      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
      }

      const parsed = JSON.parse(cleanResponse);
      return parsed;
    } catch (error) {
      console.log('JSON parse failed, returning string response');
      return response;
    }
  }

  static async processUserResponse(conversationHistory, originalIdea, projectData) {
    const conversation = conversationHistory.map(msg =>
      `${msg.isUser ? 'Kullanıcı' : 'AI'}: ${msg.text}`
    ).join('\n');

    const prompt = `
Orijinal fikir: "${originalIdea}"
Konuşma: ${conversation}

Artık yeterli bilgi var. Template oluştur.

JSON formatında yanıt ver:
{
  "isComplete": true,
  "message": "Template hazır!",
  "template": {
    "title": "[Proje adı]",
    "description": "[Açıklama]",
    "category": "[Kategori]",
    "fullTemplate": "[Basit template]"
  }
}

Template formatı:
# [Proje Adı]

## Proje Özeti ve Teknoloji Yığını

**Projenin Amacı:**
[Projenin ne yapacağı, hangi problemi çözeceği, hedef kitle]

**Dosya yapısı:**
- src/components/common/
- src/components/screens/
- src/services/
- src/context/
- src/utils/
- src/assets/

**Teknoloji Yığını:**
- React Native
- React Navigation
- Firebase Auth
- Firestore
- AsyncStorage
- React Native Paper

---

**Proje Durumu Takibi**

Bu dosya, projenin yapılacaklar listesini ve ilerleme durumunu takip etmek için kullanılır.

**AI Asistanı İçin Talimatlar:**
- Yukarıdaki Proje Özeti ve Teknoloji Yığını'nı inceleyerek projenin amacını ve kullanılacak araçları anla.
- Bu dosya projenin yapılacaklar listesini içerir. Lütfen aşağıdaki görev listesini referans al.
- Bir görevi tamamladığında veya önemli bir ilerleme kaydettiğinde, ilgili görevin başındaki [ ] işaretini [x] olarak güncelle.
- Yaptığın önemli güncellemeleri veya tamamladığın adımları aşağıdaki Geliştirme Günlüğü bölümüne, tarih belirterek ekle.
- Log formatı: YYYY-MM-DD: Tamamlanan görev veya yapılan önemli değişiklik açıklaması.
- Dosyayı her güncellemeden sonra kaydet.
- Kod yazarken türkçe JSDoc açıklamaları ekle.
- Kodunu modüler, gerektiğinde geliştirilebilir şekilde yaz.

---

## Yapılacaklar Listesi

### Faz 1: Temel Yapı (1-2 hafta)
- [ ] Proje kurulumu ve dependency management
- [ ] React Navigation yapısı (Stack + Bottom Tabs)
- [ ] Firebase proje kurulumu ve config
- [ ] Authentication flow (giriş/kayıt ekranları)
- [ ] Ana UI bileşenleri oluşturma
- [ ] Temel ekran yapıları

### Faz 2: Ana Özellikler (2-3 hafta)
- [ ] [Ana özellik 1] implementasyonu
- [ ] [Ana özellik 2] implementasyonu
- [ ] [Ana özellik 3] implementasyonu
- [ ] Firestore CRUD operations
- [ ] Form validations
- [ ] Error handling

### Faz 3: İyileştirmeler (1 hafta)
- [ ] UI/UX iyileştirmeleri
- [ ] Performance optimizasyonu
- [ ] Test yazma
- [ ] App store hazırlıkları
- [ ] Son kontroller

---

## Geliştirme Günlüğü (AI Tarafından)

*Henüz başlangıç aşamasında. İlerleme kayıtları burada görünecek.*
`;

    const response = await this.makeRequest(prompt);

    try {
      // Basit JSON temizleme
      let cleanResponse = response.trim();
      cleanResponse = cleanResponse.replace(/```json/g, '').replace(/```/g, '');

      const jsonStart = cleanResponse.indexOf('{');
      const jsonEnd = cleanResponse.lastIndexOf('}') + 1;

      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
      }

      const parsed = JSON.parse(cleanResponse);
      return parsed;
    } catch (error) {
      console.error('JSON parse failed:', error);
      // Fallback
      return {
        isComplete: true,
        message: "Template hazır!",
        template: {
          title: "Mobil Uygulama",
          description: originalIdea,
          category: "Mobile App",
          fullTemplate: `# ${originalIdea}\n\n## Açıklama\n${originalIdea}\n\n## Özellikler\n- Ana özellik\n- Kullanıcı yönetimi\n\n## Teknoloji\n- React Native\n- Firebase`
        }
      };
    }
  }
}

export { GeminiService };
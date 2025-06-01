import Constants from 'expo-constants';

// Gemini API anahtarınızı buraya ekleyin
const GEMINI_API_KEY = 'AIzaSyB7lpYwj2s_BRZeWMfoYp-E38I8zF4dQ-s';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Verimlilik tahmini API'si
const PREDICTION_API_URL = "http://45.147.47.135:4242";
const PREDICTION_HEADERS = {
  "Content-Type": "application/json"
};

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

  /**
   * Template'den app bilgilerini çıkararak verimlilik tahminini alır
   * @param {Object} template - Oluşturulan template objesi
   * @returns {Promise<Object>} Verimlilik tahmini sonucu
   */
  static async getEfficiencyPrediction(template) {
    try {
      // Template'den kategori ve uygulama türü çıkar
      const category = this.extractCategory(template.category || template.title);
      const appType = "Free"; // Şimdilik hepsi free
      const size = this.estimateAppSize(template);

      const appData = {
        "app_name": template.title || "Yeni Uygulama",
        "category": category,
        "app_type": appType,
        "price": 0.0,
        "content_rating": "Everyone",
        "size": size
      };

      console.log('Verimlilik tahmini için gönderilen veri:', appData);
      console.log('API URL:', `${PREDICTION_API_URL}/predict`);

      // Farklı header formatlarını deneyelim
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': 'lavukserhat'  // API key header formatı
      };

      console.log('Request headers:', headers);

      const response = await fetch(`${PREDICTION_API_URL}/predict`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(appData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Verimlilik tahmini sonucu:', result);

      return {
        success: true,
        prediction: result,
        appData: appData
      };
    } catch (error) {
      console.error('Verimlilik tahmini hatası:', error);
      return {
        success: false,
        error: error.message,
        prediction: null
      };
    }
  }

  /**
   * Template kategorisinden API kategorisine çevirir
   */
  static extractCategory(categoryText) {
    const categories = {
      'oyun': 'GAME',
      'game': 'GAME',
      'eğitim': 'EDUCATION',
      'education': 'EDUCATION',
      'eglence': 'ENTERTAINMENT',
      'entertainment': 'ENTERTAINMENT',
      'iş': 'BUSINESS',
      'business': 'BUSINESS',
      'sağlık': 'MEDICAL',
      'health': 'MEDICAL',
      'medical': 'MEDICAL',
      'sosyal': 'SOCIAL',
      'social': 'SOCIAL',
      'alışveriş': 'SHOPPING',
      'shopping': 'SHOPPING',
      'finans': 'FINANCE',
      'finance': 'FINANCE',
      'araç': 'TOOLS',
      'tools': 'TOOLS',
      'yardımcı': 'TOOLS',
      'utility': 'TOOLS'
    };

    const lowerText = (categoryText || '').toLowerCase();

    for (const [key, value] of Object.entries(categories)) {
      if (lowerText.includes(key)) {
        return value;
      }
    }

    return 'TOOLS'; // Default kategori
  }

  /**
   * Template içeriğine göre uygulama boyutunu tahmin eder
   */
  static estimateAppSize(template) {
    const content = (template.fullTemplate || template.description || '').toLowerCase();

    // Kompleks özellikler varsa daha büyük boyut
    if (content.includes('video') || content.includes('kamera') || content.includes('ses')) {
      return '50M';
    } else if (content.includes('veritabanı') || content.includes('firebase') || content.includes('api')) {
      return '35M';
    } else if (content.includes('oyun') || content.includes('animasyon')) {
      return '40M';
    } else {
      return '25M';
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

      // Eğer template oluşturulduysa verimlilik tahminini de al
      if (parsed.isComplete && parsed.template) {
        console.log('Template oluşturuldu, verimlilik tahminini alıyorum...');
        const prediction = await this.getEfficiencyPrediction(parsed.template);
        parsed.efficiencyPrediction = prediction;
      }

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

      // Eğer template oluşturulduysa verimlilik tahminini de al
      if (parsed.isComplete && parsed.template) {
        console.log('Template oluşturuldu, verimlilik tahminini alıyorum...');
        const prediction = await this.getEfficiencyPrediction(parsed.template);
        parsed.efficiencyPrediction = prediction;
      }

      return parsed;
    } catch (error) {
      console.error('JSON parse failed:', error);
      // Fallback
      const fallbackTemplate = {
        isComplete: true,
        message: "Template hazır!",
        template: {
          title: "Mobil Uygulama",
          description: originalIdea,
          category: "Mobile App",
          fullTemplate: `# ${originalIdea}\n\n## Açıklama\n${originalIdea}\n\n## Özellikler\n- Ana özellik\n- Kullanıcı yönetimi\n\n## Teknoloji\n- React Native\n- Firebase`
        }
      };

      // Fallback için de verimlilik tahminini al
      const prediction = await this.getEfficiencyPrediction(fallbackTemplate.template);
      fallbackTemplate.efficiencyPrediction = prediction;

      return fallbackTemplate;
    }
  }
}

export { GeminiService };
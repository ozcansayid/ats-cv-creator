# ATS Uyumlu CV Oluşturucu & Portfolyo Editörü

Bu proje, iş arayanların Aday Takip Sistemleri (ATS - Applicant Tracking Systems) filtrelerinden kolayca geçebilecek, şık ve profesyonel CV'ler oluşturmasını sağlayan tarayıcı tabanlı dinamik bir araçtır. 

Herhangi bir sunucu veya backend bağlantısı gerektirmeden tamamen istemci tarafında (client-side) çalışır.

## 🚀 Özellikler

- **Dinamik Form Editörü:** Bilgilerinizi sol taraftaki formlardan güncelleyin, sağ taraftaki önizleme alanında anında canlı görün.
- **ATS Uyumlu Şablonlar:** 
  - *Modern*: Şık ve modern bir yerleşim.
  - *Klasik*: Tamamen geleneksel ve sade ATS dostu tasarım.
  - *Executive*: Liderlik ve yönetim pozisyonları için optimize edilmiş tasarım.
- **Renk Paleti Seçenekleri:** Kraliyet Mavisi, Zümrüt Yeşili, Mor ve Koyu Slate renk temalarıyla tasarımınızı kişiselleştirin.
- **Koyu / Açık Tema:** Gece modu desteği ile göz yormayan arayüz.
- **JSON Veri Yönetimi:**
  - **Veri Aktar:** CV verilerinizi `.json` formatında yedekleyin.
  - **Veri Yükle:** Daha önce yedeklediğiniz JSON dosyasını yükleyerek kaldığınız yerden düzenlemeye devam edin.
  - **Demo Yükle:** Şablonu hemen test etmek için tek tıkla örnek verileri yükleyin.
- **Kusursuz PDF Çıktısı:** Sayfa taşmaları, yarıda kesilen satırlar gibi yaygın yazdırma problemlerini çözen, A4 boyutuna özel `@media print` CSS kuralları ile tarayıcınızın yazdırma (Print) aracı üzerinden mükemmel PDF çıktısı alın.
- **Otomatik Kayıt:** Yazdığınız her şey tarayıcınızın `localStorage` alanına otomatik olarak kaydedilir; tarayıcıyı kapatsanız dahi verileriniz kaybolmaz.

## 🛠️ Kullanılan Teknolojiler

- **HTML5:** Anlamsal (semantic) etiket yapısı ile erişilebilir ve taranabilir yapı.
- **Vanilla CSS:** CSS değişkenleri (variables), Flexbox, CSS Grid ve yazdırmaya özel stil kuralları (Print CSS).
- **Vanilla JavaScript (ES6+):** Harici hiçbir kütüphane veya framework (React, Vue, jQuery vb.) kullanılmadan, temiz bir durum (state) yönetimi ve DOM manipülasyonu.
- **FontAwesome:** Kullanıcı arayüzü simgeleri.

## 💻 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak oldukça basittir:

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/ozcansayid/ats-cv-creator.git
   ```
2. Proje dizinine gidin:
   ```bash
   cd cv
   ```
3. `index.html` dosyasını tarayıcınızda çift tıklayarak açın veya basit bir yerel sunucu (Live Server) ile çalıştırın.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Dilediğiniz gibi kullanabilir, özelleştirebilir ve katkıda bulunabilirsiniz.

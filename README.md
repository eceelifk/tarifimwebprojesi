# tarifim - MERN Stack Yemek Tarifleri Paylaşım Platformu

**tarifim**, MERN Stack (MongoDB, Express.js, React.js, Node.js) mimarisi kullanılarak geliştirilmiş, modern, iştah açıcı ve şık tasarıma sahip full-stack bir yemek tarifleri paylaşım platformudur.

Kullanıcılar sistemde kendi hesaplarını oluşturabilir, leziz yemek tariflerini paylaşabilir, diğer şeflerin tariflerine puan verebilir, yorum yazabilir ve beğendikleri tarifleri favorilerine ekleyebilirler.

---

##  Proje Özellikleri

1. **Backend (Node.js + Express.js + Mongoose):**
   - MVC (Model-View-Controller) mimarisine uygun temiz klasör yapısı.
   - RESTful API standartlarına uygun en az 4 farklı endpoint yönetimi (GET, POST, PUT, DELETE).
   - Merkezi hata yönetimi (`hataYonetimi.js`) ve API loglama sistemleri.
   - MongoDB Atlas veya lokal MongoDB ile tam uyumlu çalışan veritabanı yapısı.

2. **Frontend (React.js + Vite):**
   - Hızlı derleme için Vite altyapısı ve React v19.
   - React Router DOM ile 4'ten fazla sayfa (Ana Sayfa, Tarif Detay, Profil, Giriş/Kayıt, Tarif Ekle/Düzenle).
   - `OturumBaglami` (Context API) ile global durum (State) yönetimi.
   - Dinamik malzeme ve adım ekleme içeren akıllı form validasyonları.
   - Şık, modern ve mobil uyumlu (responsive) Vanilla CSS tasarımı (glassmorphism/cam efekti ve yumuşak geçişler).

3. **Kimlik Doğrulama ve Güvenlik:**
   - Şifrelerin veritabanına kaydedilmeden önce `bcryptjs` ile hashlenmesi.
   - JWT (JSON Web Token) tabanlı oturum yönetimi.
   - Korumalı rotalar (Giriş yapmayan kullanıcılar tarif ekleyemez veya yorum yapamaz).
   - Rol tabanlı erişim altyapısı (`rol: kullanici / admin`).

4. **Kullanıcı Etkileşimi:**
   - Tariflere 1-5 yıldız arası puan verme ve ortalama puanı dinamik hesaplama.
   - Tariflerin altına anlık yorum yazma ve yetkilendirilmiş silme (Sadece yorum sahibi, tarif yazarı veya admin silebilir).
   - Beğenilen tarifleri favorilere ekleme ve profil sayfasında listeleme.

---

##  Kullanılan Teknolojiler

- **Frontend:** React.js, Vite, React Router DOM, Lucide React (İkonlar), Vanilla CSS.
- **Backend:** Node.js, Express.js, Mongoose, JWT, Bcrypt.js, Morgan, CORS, Dotenv.
- **Veritabanı:** MongoDB (Lokal veya Atlas).
- **Yönetim:** Concurrently (Frontend ve Backend'i aynı anda çalıştırmak için).

---

## Proje Klasör Yapısı

```
tarifim/
├── backend/                  # Sunucu ve API Kodları
│   ├── config/               # Veritabanı bağlantısı
│   ├── controllers/          # İstek işleyicileri (Controllers)
│   ├── middleware/           # Araya giren kontroller (Auth, Hata)
│   ├── models/               # Mongoose Veri Şemaları
│   ├── routes/               # Express Rotaları
│   ├── .env.example          # Ortam değişkenleri şablonu
│   └── sunucu.js             # Sunucu başlangıç noktası (server.js)
├── frontend/                 # Arayüz Kodları (React)
│   ├── src/
│   │   ├── components/       # Küçük arayüz parçaları (Navbar, Kart vb.)
│   │   ├── context/          # Oturum durumu yönetimi (Context API)
│   │   ├── pages/            # Sayfalar
│   │   ├── App.css           # Bileşen ve Sayfa Tasarımları
│   │   ├── App.jsx           # Rotaların belirlendiği ana bileşen
│   │   ├── index.css         # Tasarım Değişkenleri ve Global Sıfırlamalar
│   │   └── main.jsx          # Başlangıç noktası
├
└── package.json              # Kök dizin kontrol dosyası
```

---

##  Kurulum ve Çalıştırma Adımları

Proje kök dizininde yer alan `package.json` dosyasındaki özel betikler sayesinde sunucu ve arayüzü tek tuşla kurup ayağa kaldırabilirsiniz.

### 1. Gereksinimler
- Bilgisayarınızda **Node.js** yüklü olmalıdır.
- Veritabanı için bilgisayarınızda **MongoDB** lokal olarak çalışıyor olmalıdır (veya Atlas hesabı).

### 2. Bağımlılıkların Kurulması (Tek Komutla)
Projenin en üst klasöründe (`tarifim/` dizininde) terminali açıp şu komutu çalıştırın:
```bash
npm install
```
*Bu komut, kök dizindeki bağımlılıkları yükledikten sonra otomatik olarak `backend` ve `frontend` klasörlerine gidip oradaki bağımlılıkları da kuracaktır (`postinstall` betiği).*

### 3. Ortam Değişkenlerinin (.env) Ayarlanması
`backend` klasörünün içine girip `.env` adında yeni bir dosya oluşturun ve şu satırları yapıştırın:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tarifim
JWT_SECRET=tarifim_cok_gizli_anahtar_123456
```
*(Eğer MongoDB Atlas kullanıyorsanız, `MONGODB_URI` kısmına Atlas bağlantı linkinizi yazabilirsiniz).*

### 4. Projeyi Çalıştırma (Tek Komutla)
Bağımlılıkları yükleyip `.env` dosyasını ayarladıktan sonra, tekrar en üst klasörde (`tarifim/` dizininde) şu komutu çalıştırın:
```bash
npm start
```
*Bu komut sayesinde hem backend API sunucusu `http://localhost:5000` adresinde, hem de React arayüzü `http://localhost:5173` adresinde **aynı anda** çalışmaya başlayacaktır.*

---

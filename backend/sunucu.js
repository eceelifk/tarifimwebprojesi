import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// Veritabanı ve Middleware içe aktar
import veritabaninaBaglan from './config/veritabani.js';
import hataYakalayici from './middleware/hataYonetimi.js';

// Rota dosyalarını içe aktar
import kullaniciRotalari from './routes/kullaniciRotalari.js';
import tarifRotalari from './routes/tarifRotalari.js';
import yorumRotalari from './routes/yorumRotalari.js';

// .env dosyasındaki ortam değişkenlerini yükleme
dotenv.config();

// MongoDB'ye bağlanma
veritabaninaBaglan();

// Express uygulamasını başlatma
const app = express();

// Arayazılımları (Middleware) kurma
app.use(cors()); // CORS politikalarını ayarlama (Frontend'in sunucuya erişebilmesi için)
app.use(express.json({ limit: '10mb' })); // Gelen JSON verilerini okuyabilmek için 
app.use(express.urlencoded({ limit: '10mb', extended: true })); // URL encoded veriler için limit ayarı
app.use(morgan('dev')); // Gelen HTTP isteklerini konsola loglamak için

// Rota tanımlamaları
app.use('/api/kullanici', kullaniciRotalari);
app.use('/api/tarifler', tarifRotalari);
app.use('/api/yorumlar', yorumRotalari);

// Sunucunun çalışıp çalışmadığını anlamak için basit bir anasayfa endpoint'i
app.get('/', (req, res) => {
  res.status(200).json({ mesaj: 'Tarifim API sunucusu sorunsuz çalışıyor!' });
});

// Tanımlanmamış rotalara girilirse 404 hatası döndüren kod
app.use((req, res, sonraki) => {
  res.status(404);
  const hata = new Error(`Aradığınız sayfa bulunamadı - ${req.originalUrl}`);
  sonraki(hata);
});

// Merkezi Hata Yönetimi middleware'ini bağlama (Rotalardan sonra olucsk)
app.use(hataYakalayici);

// Port numarasını al(varsayılan olarak 5000)
const PORT = process.env.PORT || 5000;

// Sunucuyu dinlemeye başla
app.listen(PORT, () => {
  console.log(`\n=========================================`);
  console.log(`Tarifim Sunucusu ${PORT} portunda yayında!`);
  console.log(`Zaman: ${new Date().toLocaleTimeString()}`);
  console.log(`=========================================\n`);
});

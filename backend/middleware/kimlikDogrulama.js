import jwt from 'jsonwebtoken';
import Kullanici from '../models/Kullanici.js';

// Kullanıcının giriş yapıp yapmadığını kontrol eden güvenlik duvarı (middleware)
export const kimlikDogrula = async (req, res, sonraki) => {
  let token;

  // Tarayıcıdan veya API istemcisinden gelen istek başlıklarında Authorization kısmını arıyoruz
  // Token genelde "Bearer xyzabc..." şeklinde gelir
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // "Bearer" kelimesini çıkartıp sadece token kısmını alıyoruz
      token = req.headers.authorization.split(' ')[1];

      // Token'ı gizli anahtarımızla (JWT_SECRET) çözüyoruz. Bu token gerçekten bizim mi kontrol ediyoruz.
      const acilanToken = jwt.verify(token, process.env.JWT_SECRET);

      // Token içindeki kullanıcı kimliği (id) ile veritabanından kullanıcıyı buluyoruz.
      // Şifre alanını istemciden gizlemek için select('-sifre') yapıyoruz.
      req.kullanici = await Kullanici.findById(acilanToken.id).select('-sifre');

      if (!req.kullanici) {
        return res.status(401).json({ mesaj: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
      }

      // Her şey yolundaysa sıradaki fonksiyona/kontrolcüye geçiyoruz
      sonraki();
    } catch (hata) {
      console.error('Token Doğrulama Hatası:', hata.message);
      return res.status(401).json({ mesaj: 'Geçersiz veya süresi dolmuş token.' });
    }
  }

  // Eğer istekte token gönderilmediyse hata dönüyoruz
  if (!token) {
    return res.status(401).json({ mesaj: 'Yetkisiz erişim. Token bulunamadı.' });
  }
};

// Sadece Admin olan kullanıcıların girmesine izin veren kontrolcü
export const adminKontrolu = (req, res, sonraki) => {
  // kimlikDogrula middleware'i req.kullanici nesnesini doldurmuş olmalıdır
  if (req.kullanici && req.kullanici.rol === 'admin') {
    sonraki(); // Admin ise geçebilir
  } else {
    return res.status(403).json({ mesaj: 'Bu işlem için yetkiniz yok. Sadece yöneticiler yapabilir.' });
  }
};

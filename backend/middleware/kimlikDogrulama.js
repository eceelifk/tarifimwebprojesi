import jwt from 'jsonwebtoken';
import Kullanici from '../models/Kullanici.js';

// Kullanıcının girişini kontrol eden güvenlik duvarı (middleware)
export const kimlikDogrula = async (req, res, sonraki) => {
  let token;

  // istek başlıklarında Authorization kısmını ara
  // Token genelde "Bearer xyzabc..." şeklinde gelir
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // "Bearer" ı çıkartıp sadece token kısmını al
      token = req.headers.authorization.split(' ')[1];

      // Token'ı gizli anahtarla (JWT_SECRET) çöz. Bu token gerçekten bizim mi kontrol egtme
      const acilanToken = jwt.verify(token, process.env.JWT_SECRET);

      // Token içindeki kullanıcı kimliği (id) ile veritabanından kullanıcıyı bul
      // Şifre alanını istemciden gizlemek için select('-sifre') yaptım
      req.kullanici = await Kullanici.findById(acilanToken.id).select('-sifre');

      if (!req.kullanici) {
        return res.status(401).json({ mesaj: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
      }

      sonraki();
    } catch (hata) {
      console.error('Token Doğrulama Hatası:', hata.message);
      return res.status(401).json({ mesaj: 'Geçersiz veya süresi dolmuş token.' });
    }
  }

  // Eğer istekte token gönderilmediyse hata dön
  if (!token) {
    return res.status(401).json({ mesaj: 'Yetkisiz erişim. Token bulunamadı.' });
  }
};

// Sadece Admin olan kullanıcıların girmesine izin veren kontrolcü
export const adminKontrolu = (req, res, sonraki) => {
  // kimlikDogrula middleware'i req.kullanici nesnesini doldurmuş olmalıdır
  if (req.kullanici && req.kullanici.rol === 'admin') {
    sonraki(); // Admin ise geç
  } else {
    return res.status(403).json({ mesaj: 'Bu işlem için yetkiniz yok. Sadece yöneticiler yapabilir.' });
  }
};

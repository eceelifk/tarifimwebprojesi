import Kullanici from '../models/Kullanici.js';
import jwt from 'jsonwebtoken';

// JWT Token üretme yardımcı fonksiyonu
const tokenUret = (id) => {
  // Token oluşturup içine kullanıcının veritabanı ID'sini gömüyoruz.
  // 30 gün geçerli olacak şekilde ayarladık.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Yeni kullanıcı kaydı
// @route   POST /api/kullanici/kayit
// @access  Public (Herkes erişebilir)
export const kayitOl = async (req, res, sonraki) => {
  const { isim, eposta, sifre, profilResmi } = req.body;

  try {
    // 1. Gerekli alanların doldurulduğunu kontrol et
    if (!isim || !eposta || !sifre) {
      res.status(400);
      throw new Error('Lütfen tüm alanları doldurunuz.');
    }

    // 2. E-posta adresinin sistemde kayıtlı olup olmadığını kontrol et
    const epostaVarMi = await Kullanici.findOne({ eposta });
    if (epostaVarMi) {
      res.status(400);
      throw new Error('Bu e-posta adresi zaten kullanımda.');
    }

    // 3. Yeni kullanıcıyı oluştur (Şifreleme Mongoose modelinde pre-save ile otomatik yapılacak)
    const yeniKullanici = await Kullanici.create({
      isim,
      eposta,
      sifre,
      profilResmi // Eğer boşsa şema varsayılan resmi kullanacaktır
    });

    if (yeniKullanici) {
      // 4. Kullanıcı oluşturulduysa token üretip geri dön
      res.status(201).json({
        basarili: true,
        mesaj: 'Kullanıcı başarıyla kaydedildi.',
        token: tokenUret(yeniKullanici._id),
        kullanici: {
          _id: yeniKullanici._id,
          isim: yeniKullanici.isim,
          eposta: yeniKullanici.eposta,
          rol: yeniKullanici.rol,
          profilResmi: yeniKullanici.profilResmi,
          favoriler: yeniKullanici.favoriler || []
        }
      });
    } else {
      res.status(400);
      throw new Error('Kullanıcı kaydedilirken geçersiz veri hatası oluştu.');
    }
  } catch (hata) {
    // Express'in hata yakalayıcısına yönlendiriyoruz
    sonraki(hata);
  }
};

// @desc    Kullanıcı girişi (Giriş yap)
// @route   POST /api/kullanici/giris
// @access  Public
export const girisYap = async (req, res, sonraki) => {
  const { eposta, sifre } = req.body;

  try {
    // 1. Alanların girildiğini kontrol et
    if (!eposta || !sifre) {
      res.status(400);
      throw new Error('Lütfen e-posta ve şifrenizi giriniz.');
    }

    // 2. Kullanıcıyı e-postaya göre veritabanında ara
    const kullanici = await Kullanici.findOne({ eposta });
    
    // 3. Kullanıcı bulunduysa ve şifre eşleşiyorsa token ile giriş izni ver
    if (kullanici && (await kullanici.sifreKarsilastir(sifre))) {
      res.status(200).json({
        basarili: true,
        mesaj: 'Giriş başarılı!',
        token: tokenUret(kullanici._id),
        kullanici: {
          _id: kullanici._id,
          isim: kullanici.isim,
          eposta: kullanici.eposta,
          rol: kullanici.rol,
          profilResmi: kullanici.profilResmi,
          favoriler: kullanici.favoriler || []
        }
      });
    } else {
      res.status(401);
      throw new Error('Geçersiz e-posta veya şifre.');
    }
  } catch (hata) {
    sonraki(hata);
  }
};

// @desc    Kullanıcı profilini getir
// @route   GET /api/kullanici/profil
// @access  Private (Sadece giriş yapmış olanlar)
export const profilGetir = async (req, res, sonraki) => {
  try {
    // req.kullanici zaten kimlikDogrula middleware'inden geliyor.
    // Kullanıcının favori tariflerini de (kullanıcı modelindeki ref referansını) veritabanından getiriyoruz.
    const kullanici = await Kullanici.findById(req.kullanici._id)
      .select('-sifre')
      .populate('favoriler');

    if (kullanici) {
      res.status(200).json({
        basarili: true,
        kullanici
      });
    } else {
      res.status(404);
      throw new Error('Kullanıcı profili bulunamadı.');
    }
  } catch (hata) {
    sonraki(hata);
  }
};

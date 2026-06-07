import Kullanici from '../models/Kullanici.js';
import jwt from 'jsonwebtoken';

// JWT Token üretme yardımcı fonksiyonu
const tokenUret = (id) => {
  // Token oluşturup içine kullanıcının veritabanı ID'sini gömüyo
  // 30 gün geçerli olacak şekilde ayarlı
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Yeni kullanıcı kaydı
// @route   POST /api/kullanici/kayit
// @access  Public 
export const kayitOl = async (req, res, sonraki) => {
  const { isim, eposta, sifre, profilResmi } = req.body;

  try {
    // Gerekli alanların doldurulduğunu kontrol etme
    if (!isim || !eposta || !sifre) {
      res.status(400);
      throw new Error('Lütfen tüm alanları doldurunuz.');
    }

    //  E-posta adresinin sistemde kayıtlı olup olmadığını kontrol etme
    const epostaVarMi = await Kullanici.findOne({ eposta });
    if (epostaVarMi) {
      res.status(400);
      throw new Error('Bu e-posta adresi zaten kullanımda.');
    }

    //  Yeni kullanıcıyı oluştur (Şifreleme Mongoose modelinde pre-save ile otomatik yapılacak)
    const yeniKullanici = await Kullanici.create({
      isim,
      eposta,
      sifre,
      profilResmi // Eğer boşsa şema varsayılan resmi kullanacak
    });

    if (yeniKullanici) {
      // Kullanıcı oluşturulduysa token üretip geri dönme
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
    // Express'in hata yakalayıcısına yönlendirme
    sonraki(hata);
  }
};

// @desc    Kullanıcı girişi (Giriş yap)
// @route   POST /api/kullanici/giris
// @access  Public
export const girisYap = async (req, res, sonraki) => {
  const { eposta, sifre } = req.body;

  try {
    // Alanların girildiğini kontrol etme
    if (!eposta || !sifre) {
      res.status(400);
      throw new Error('Lütfen e-posta ve şifrenizi giriniz.');
    }

    //e-postaya göre veritabanında arama
    const kullanici = await Kullanici.findOne({ eposta });
    
    //  bulunduysa ve şifre eşleşiyorsa token ile giriş izni verme
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
// @access  Private 
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

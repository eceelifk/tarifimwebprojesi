import Tarif from '../models/Tarif.js';
import Kullanici from '../models/Kullanici.js';
import Yorum from '../models/Yorum.js';

// @desc    Tüm tarifleri listele (Arama ve kategori filtresi destekli)
// @route   GET /api/tarifler
// @access  Public
export const tarifleriGetir = async (req, res, sonraki) => {
  try {
    const { arama, kategori } = req.query;
    let sorgu = {};

    // 1. Arama sorgusu varsa filtreleme yap (Başlığa göre harf duyarsız arama)
    if (arama) {
      sorgu.baslik = { $regex: arama, $options: 'i' };
    }

    // 2. Kategori seçilmişse filtreleme yap
    if (kategori && kategori !== 'Tümü') {
      sorgu.kategori = kategori;
    }

    // Sorguyu çalıştırıp tarif yazarının ismini ve profil resmini dolduruyoruz (populate)
    const tarifler = await Tarif.find(sorgu)
      .populate('yazar', 'isim profilResmi')
      .sort({ createdAt: -1 }); // En yeni tarifler üstte

    res.status(200).json({
      basarili: true,
      sayi: tarifler.length,
      tarifler
    });
  } catch (hata) {
    sonraki(hata);
  }
};

// @desc    ID ile tek bir tarifi getir
// @route   GET /api/tarifler/:id
// @access  Public
export const tarifGetir = async (req, res, sonraki) => {
  const { id } = req.params;

  try {
    // Tarifi bulup yazar bilgilerini çekiyoruz
    const tarif = await Tarif.findById(id).populate('yazar', 'isim profilResmi');

    if (!tarif) {
      res.status(404);
      throw new Error('Belirtilen yemek tarifi bulunamadı.');
    }

    // Bu tarife yapılan yorumları ve yorum yazarlarının isimlerini de buluyoruz
    const yorumlar = await Yorum.find({ tarif: id })
      .populate('yazar', 'isim profilResmi')
      .sort({ createdAt: -1 });

    res.status(200).json({
      basarili: true,
      tarif,
      yorumlar
    });
  } catch (hata) {
    sonraki(hata);
  }
};

// @desc    Yeni tarif oluştur
// @route   POST /api/tarifler
// @access  Private (Sadece giriş yapmış kullanıcılar)
export const tarifEkle = async (req, res, sonraki) => {
  const { baslik, aciklama, kategori, malzemeler, hazirlanis, hazirlamaSuresi, pisirmeSuresi, kisiSayisi, resimUrl } = req.body;

  try {
    // Giriş yapan kullanıcının ID'sini yazar olarak kaydediyoruz
    const yeniTarif = new Tarif({
      baslik,
      aciklama,
      kategori,
      malzemeler,
      hazirlanis,
      hazirlamaSuresi,
      pisirmeSuresi,
      kisiSayisi,
      resimUrl,
      yazar: req.kullanici._id
    });

    const kaydedilenTarif = await yeniTarif.save();

    res.status(201).json({
      basarili: true,
      mesaj: 'Yemek tarifiniz başarıyla eklendi.',
      tarif: kaydedilenTarif
    });
  } catch (hata) {
    sonraki(hata);
  }
};

// @desc    Tarifi güncelle
// @route   PUT /api/tarifler/:id
// @access  Private
export const tarifGuncelle = async (req, res, sonraki) => {
  const { id } = req.params;

  try {
    const tarif = await Tarif.findById(id);

    if (!tarif) {
      res.status(404);
      throw new Error('Güncellenecek tarif bulunamadı.');
    }

    // Yetki Kontrolü: Tarifi sadece kendi yazarı veya admin güncelleyebilir
    if (tarif.yazar.toString() !== req.kullanici._id.toString() && req.kullanici.rol !== 'admin') {
      res.status(403);
      throw new Error('Bu tarifi güncellemek için yetkiniz yok.');
    }

    // Gelen yeni bilgileri güncelle
    const guncellenenTarif = await Tarif.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true } // new: true güncel halini döner, runValidators ise şema kurallarını çalıştırır
    );

    res.status(200).json({
      basarili: true,
      mesaj: 'Tarif başarıyla güncellendi.',
      tarif: guncellenenTarif
    });
  } catch (hata) {
    sonraki(hata);
  }
};

// @desc    Tarifi sil
// @route   DELETE /api/tarifler/:id
// @access  Private
export const tarifSil = async (req, res, sonraki) => {
  const { id } = req.params;

  try {
    const tarif = await Tarif.findById(id);

    if (!tarif) {
      res.status(404);
      throw new Error('Silinecek tarif bulunamadı.');
    }

    // Yetki Kontrolü: Tarifi sadece kendi yazarı veya admin silebilir
    if (tarif.yazar.toString() !== req.kullanici._id.toString() && req.kullanici.rol !== 'admin') {
      res.status(403);
      throw new Error('Bu tarifi silmek için yetkiniz yok.');
    }

    // 1. Tarifi sil
    await Tarif.findByIdAndDelete(id);

    // 2. Bu tarife bağlı tüm yorumları temizle (Veritabanı tutarlılığı için)
    await Yorum.deleteMany({ tarif: id });

    // 3. Kullanıcıların favorilerinden bu tarifi kaldır
    await Kullanici.updateMany(
      { favoriler: id },
      { $pull: { favoriler: id } }
    );

    res.status(200).json({
      basarili: true,
      mesaj: 'Tarif ve tarife ait tüm yorumlar başarıyla silindi.'
    });
  } catch (hata) {
    sonraki(hata);
  }
};

// @desc    Tarife puan ver (1-5 arası)
// @route   POST /api/tarifler/:id/puan
// @access  Private
export const tarifePuanVer = async (req, res, sonraki) => {
  const { id } = req.params;
  const { puan } = req.body;

  try {
    // Puan kontrolü
    if (!puan || puan < 1 || puan > 5) {
      res.status(400);
      throw new Error('Lütfen 1 ile 5 arasında geçerli bir puan giriniz.');
    }

    const tarif = await Tarif.findById(id);
    if (!tarif) {
      res.status(404);
      throw new Error('Puan verilecek tarif bulunamadı.');
    }

    // Kullanıcı daha önce bu tarife puan vermiş mi?
    const eskiPuanIndex = tarif.puanlar.findIndex(
      (oge) => oge.kullanici.toString() === req.kullanici._id.toString()
    );

    if (eskiPuanIndex > -1) {
      // Daha önce puan vermişse puanı güncelle
      tarif.puanlar[eskiPuanIndex].puan = Number(puan);
    } else {
      // İlk kez puan veriyorsa yeni puan nesnesini diziye ekle
      tarif.puanlar.push({
        kullanici: req.kullanici._id,
        puan: Number(puan)
      });
    }

    // Ortalama puanı yeniden hesapla
    tarif.ortalamaPuanHesapla();
    
    // Veritabanına kaydet
    await tarif.save();

    res.status(200).json({
      basarili: true,
      mesaj: 'Puanınız kaydedildi.',
      ortalamaPuan: tarif.ortalamaPuan,
      toplamOy: tarif.puanlar.length
    });
  } catch (hata) {
    sonraki(hata);
  }
};

// @desc    Tarifi favorilere ekle / çıkar (Toggle)
// @route   POST /api/tarifler/:id/favori
// @access  Private
export const tarifFavoriToggle = async (req, res, sonraki) => {
  const { id } = req.params;

  try {
    const tarif = await Tarif.findById(id);
    if (!tarif) {
      res.status(404);
      throw new Error('Tarif bulunamadı.');
    }

    const kullanici = await Kullanici.findById(req.kullanici._id);

    // Tarif kullanıcının favorilerinde zaten var mı?
    const favorideMi = kullanici.favoriler.includes(id);

    if (favorideMi) {
      // Varsa favorilerden çıkar ($pull)
      kullanici.favoriler.pull(id);
      await kullanici.save();
      
      res.status(200).json({
        basarili: true,
        mesaj: 'Tarif favorilerinizden kaldırıldı.',
        favoride: false
      });
    } else {
      // Yoksa favorilere ekle ($push)
      kullanici.favoriler.push(id);
      await kullanici.save();

      res.status(200).json({
        basarili: true,
        mesaj: 'Tarif favorilerinize eklendi.',
        favoride: true
      });
    }
  } catch (hata) {
    sonraki(hata);
  }
};

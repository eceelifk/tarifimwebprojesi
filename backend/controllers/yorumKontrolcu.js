import Yorum from '../models/Yorum.js';
import Tarif from '../models/Tarif.js';

// @desc    Tarife yorum ekle
// @route   POST /api/yorumlar
// @access  Private
export const yorumEkle = async (req, res, sonraki) => {
  const { tarifId, icerik } = req.body;

  try {
    if (!tarifId || !icerik) {
      res.status(400);
      throw new Error('Lütfen yorum içeriğini yazınız.');
    }

    // Yorum yapılacak tarif gerçekten var mı?
    const tarif = await Tarif.findById(tarifId);
    if (!tarif) {
      res.status(404);
      throw new Error('Yorum yapılacak tarif bulunamadı.');
    }

    // Yeni yorumu oluştur
    const yeniYorum = new Yorum({
      tarif: tarifId,
      icerik,
      yazar: req.kullanici._id
    });

    const kaydedilenYorum = await yeniYorum.save();

    // Kaydedilen yorumun yazar bilgilerini çekip öyle döndürelim (ekranda anında görünmesi için)
    const detayliYorum = await Yorum.findById(kaydedilenYorum._id).populate(
      'yazar',
      'isim profilResmi'
    );

    res.status(201).json({
      basarili: true,
      mesaj: 'Yorumunuz başarıyla eklendi.',
      yorum: detayliYorum
    });
  } catch (hata) {
    sonraki(hata);
  }
};

// @desc    Yorum sil
// @route   DELETE /api/yorumlar/:id
// @access  Private
export const yorumSil = async (req, res, sonraki) => {
  const { id } = req.params;

  try {
    const yorum = await Yorum.findById(id).populate('tarif');

    if (!yorum) {
      res.status(404);
      throw new Error('Silinecek yorum bulunamadı.');
    }

    // Yetki Kontrolü: 
    // Yorumu sadece kendi yazarı, yorumun yapıldığı tarifin sahibi (yazarı) veya admin silebilir.
    const yorumYazari = yorum.yazar.toString();
    const tarifYazari = yorum.tarif.yazar.toString();
    const istekYapanKullanici = req.kullanici._id.toString();

    if (
      istekYapanKullanici !== yorumYazari &&
      istekYapanKullanici !== tarifYazari &&
      req.kullanici.rol !== 'admin'
    ) {
      res.status(403);
      throw new Error('Bu yorumu silmek için yetkiniz yok.');
    }

    await Yorum.findByIdAndDelete(id);

    res.status(200).json({
      basarili: true,
      mesaj: 'Yorum başarıyla silindi.'
    });
  } catch (hata) {
    sonraki(hata);
  }
};
